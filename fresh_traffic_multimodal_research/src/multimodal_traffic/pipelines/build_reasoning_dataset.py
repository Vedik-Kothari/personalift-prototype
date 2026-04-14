from __future__ import annotations

import json
from pathlib import Path
from typing import Iterable, List

import pandas as pd

from multimodal_traffic.data.schemas import ApproachState, ReasoningSample, SceneState
from multimodal_traffic.data.scene_text import scene_to_text
from multimodal_traffic.models.policy import derive_policy_label, normalize_phase_label


REQUIRED_COLUMNS = {
    "scene_id",
    "timestamp",
    "source_dataset",
    "location",
    "current_phase",
    "phase_elapsed_sec",
    "north_queue",
    "south_queue",
    "east_queue",
    "west_queue",
    "north_wait_sec",
    "south_wait_sec",
    "east_wait_sec",
    "west_wait_sec",
}


def row_to_scene(row: pd.Series) -> SceneState:
    def approach(prefix: str) -> ApproachState:
        return ApproachState(
            queue_length=int(row[f"{prefix}_queue"]),
            avg_wait_sec=float(row[f"{prefix}_wait_sec"]),
            moving_count=int(row.get(f"{prefix}_moving", 0)),
            stopped_count=int(row.get(f"{prefix}_stopped", row[f"{prefix}_queue"])),
        )

    class_counts = {
        key.replace("count_", ""): int(value)
        for key, value in row.items()
        if str(key).startswith("count_") and pd.notna(value)
    }

    emergency_approach = str(row.get("emergency_approach", "none")).strip().lower()
    return SceneState(
        scene_id=str(row["scene_id"]),
        timestamp=str(row["timestamp"]),
        source_dataset=str(row["source_dataset"]),
        location=str(row["location"]),
        current_phase=normalize_phase_label(str(row["current_phase"])),
        phase_elapsed_sec=float(row["phase_elapsed_sec"]),
        north=approach("north"),
        south=approach("south"),
        east=approach("east"),
        west=approach("west"),
        emergency_present=bool(row.get("emergency_present", False)),
        emergency_approach=normalize_phase_label(emergency_approach) if emergency_approach != "none" else "none",
        pedestrian_demand=str(row.get("pedestrian_demand", "low")),
        detector_confidence=float(row.get("detector_confidence", 1.0)),
        class_counts=class_counts,
    )


def build_samples(frame_table: pd.DataFrame) -> List[ReasoningSample]:
    missing = REQUIRED_COLUMNS - set(frame_table.columns)
    if missing:
        raise ValueError(f"Missing required columns: {sorted(missing)}")

    samples: List[ReasoningSample] = []
    for _, row in frame_table.iterrows():
        scene = row_to_scene(row)
        label = derive_policy_label(scene)
        samples.append(
            ReasoningSample(
                sample_id=scene.scene_id,
                input_text=scene_to_text(scene),
                action_label=label.action_label,
                explanation_label=label.explanation_label,
                metadata=scene.to_dict(),
            )
        )
    return samples


def write_jsonl(samples: Iterable[ReasoningSample], output_path: str | Path) -> None:
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as handle:
        for sample in samples:
            handle.write(json.dumps(sample.to_dict(), ensure_ascii=True) + "\n")
