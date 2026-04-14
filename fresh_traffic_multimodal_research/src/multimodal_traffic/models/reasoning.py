from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Dict

import yaml


@dataclass
class ReasoningTrainingPlan:
    model_name: str
    max_length: int
    epochs: int
    batch_size_local: int
    batch_size_kaggle: int
    learning_rate: float
    freeze_encoder_layers: int


def load_reasoning_plan(config_path: str | Path) -> ReasoningTrainingPlan:
    config_path = Path(config_path)
    with config_path.open("r", encoding="utf-8") as handle:
        config = yaml.safe_load(handle)

    raw = config["reasoning"]
    return ReasoningTrainingPlan(
        model_name=raw["model_name"],
        max_length=int(raw["max_length"]),
        epochs=int(raw["epochs"]),
        batch_size_local=int(raw["batch_size_local"]),
        batch_size_kaggle=int(raw["batch_size_kaggle"]),
        learning_rate=float(raw["learning_rate"]),
        freeze_encoder_layers=int(raw["freeze_encoder_layers"]),
    )


def build_huggingface_training_args(plan: ReasoningTrainingPlan, output_dir: str, remote: bool) -> Dict[str, object]:
    batch_size = plan.batch_size_kaggle if remote else plan.batch_size_local
    return {
        "output_dir": output_dir,
        "num_train_epochs": plan.epochs,
        "per_device_train_batch_size": batch_size,
        "per_device_eval_batch_size": batch_size,
        "learning_rate": plan.learning_rate,
        "evaluation_strategy": "epoch",
        "save_strategy": "epoch",
        "logging_steps": 25,
        "load_best_model_at_end": True,
        "metric_for_best_model": "f1_macro",
        "greater_is_better": True,
        "report_to": "none",
    }
