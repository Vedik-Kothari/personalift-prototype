from __future__ import annotations

from typing import Dict

from .schemas import ApproachState, SceneState


def _describe_approach(name: str, state: ApproachState) -> str:
    if state.queue_length >= 15:
        density = "very heavy"
    elif state.queue_length >= 9:
        density = "heavy"
    elif state.queue_length >= 4:
        density = "moderate"
    else:
        density = "light"

    return (
        f"{name} approach has {density} traffic with queue length {state.queue_length}, "
        f"average waiting time {state.avg_wait_sec:.1f} seconds, "
        f"{state.stopped_count} stopped vehicles, and {state.moving_count} moving vehicles"
    )


def scene_to_text(scene: SceneState) -> str:
    sections = [
        _describe_approach("North", scene.north),
        _describe_approach("South", scene.south),
        _describe_approach("East", scene.east),
        _describe_approach("West", scene.west),
        f"Current signal phase is {scene.current_phase} and has been active for {scene.phase_elapsed_sec:.1f} seconds",
        f"Pedestrian demand is {scene.pedestrian_demand}",
        f"Detector confidence is {scene.detector_confidence:.2f}",
    ]

    if scene.emergency_present:
        sections.append(
            f"Emergency vehicle detected on the {scene.emergency_approach} approach and should receive priority"
        )
    else:
        sections.append("No emergency vehicle is detected")

    if scene.class_counts:
        ordered_counts = ", ".join(
            f"{key.replace('_', ' ')}: {value}" for key, value in sorted(scene.class_counts.items())
        )
        sections.append(f"Observed object counts are {ordered_counts}")

    return ". ".join(sections) + "."


def scene_summary_features(scene: SceneState) -> Dict[str, float]:
    waits = {
        "north_wait": scene.north.avg_wait_sec,
        "south_wait": scene.south.avg_wait_sec,
        "east_wait": scene.east.avg_wait_sec,
        "west_wait": scene.west.avg_wait_sec,
        "north_queue": float(scene.north.queue_length),
        "south_queue": float(scene.south.queue_length),
        "east_queue": float(scene.east.queue_length),
        "west_queue": float(scene.west.queue_length),
    }
    waits["max_queue"] = max(
        waits["north_queue"], waits["south_queue"], waits["east_queue"], waits["west_queue"]
    )
    waits["max_wait"] = max(
        waits["north_wait"], waits["south_wait"], waits["east_wait"], waits["west_wait"]
    )
    waits["emergency_present"] = float(scene.emergency_present)
    return waits
