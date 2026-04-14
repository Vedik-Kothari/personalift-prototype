from __future__ import annotations

from dataclasses import dataclass

from multimodal_traffic.data.schemas import SceneState


@dataclass
class PolicyDecision:
    action_label: str
    explanation_label: str


def derive_policy_label(scene: SceneState, min_green_sec: int = 12, max_green_sec: int = 45) -> PolicyDecision:
    queues = {
        "north": scene.north.queue_length,
        "south": scene.south.queue_length,
        "east": scene.east.queue_length,
        "west": scene.west.queue_length,
    }
    waits = {
        "north": scene.north.avg_wait_sec,
        "south": scene.south.avg_wait_sec,
        "east": scene.east.avg_wait_sec,
        "west": scene.west.avg_wait_sec,
    }

    if scene.emergency_present:
        if scene.current_phase == scene.emergency_approach:
            return PolicyDecision("extend_current_green", "emergency_aligned_with_current_phase")
        return PolicyDecision(f"switch_to_{scene.emergency_approach}", "emergency_priority")

    dominant_approach = max(queues, key=queues.get)
    dominant_queue = queues[dominant_approach]
    dominant_wait = waits[dominant_approach]

    if scene.phase_elapsed_sec < min_green_sec:
        return PolicyDecision("hold_current_phase", "minimum_green_constraint")

    if dominant_approach == scene.current_phase and dominant_queue >= 8 and scene.phase_elapsed_sec < max_green_sec:
        return PolicyDecision("extend_current_green", "queue_pressure_same_phase")

    if dominant_approach != scene.current_phase and (dominant_queue >= 8 or dominant_wait >= 20):
        return PolicyDecision(f"switch_to_{dominant_approach}", "queue_imbalance")

    if max(queues.values()) <= 3:
        return PolicyDecision("hold_current_phase", "balanced_low_traffic")

    return PolicyDecision("hold_current_phase", "steady_state_balancing")


def normalize_phase_label(raw_phase: str) -> str:
    raw_phase = raw_phase.lower().strip()
    mapping = {
        "n": "north",
        "s": "south",
        "e": "east",
        "w": "west",
        "north_south": "north",
        "east_west": "east",
    }
    return mapping.get(raw_phase, raw_phase)
