from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Dict


@dataclass
class ApproachState:
    queue_length: int
    avg_wait_sec: float
    moving_count: int
    stopped_count: int


@dataclass
class SceneState:
    scene_id: str
    timestamp: str
    source_dataset: str
    location: str
    current_phase: str
    phase_elapsed_sec: float
    north: ApproachState
    south: ApproachState
    east: ApproachState
    west: ApproachState
    emergency_present: bool = False
    emergency_approach: str = "none"
    pedestrian_demand: str = "low"
    detector_confidence: float = 1.0
    class_counts: Dict[str, int] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, object]:
        return asdict(self)


@dataclass
class ReasoningSample:
    sample_id: str
    input_text: str
    action_label: str
    explanation_label: str
    metadata: Dict[str, object]

    def to_dict(self) -> Dict[str, object]:
        return asdict(self)
