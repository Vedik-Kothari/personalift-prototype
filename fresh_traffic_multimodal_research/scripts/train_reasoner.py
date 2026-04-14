from __future__ import annotations

import argparse
import json
from pathlib import Path

from multimodal_traffic.models.reasoning import build_huggingface_training_args, load_reasoning_plan


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default="configs/experiment.yaml")
    parser.add_argument("--output-json", default="artifacts/reasoner_training_plan.json")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--remote", action="store_true")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    plan = load_reasoning_plan(args.config)
    training_args = build_huggingface_training_args(plan, "artifacts/reasoner_checkpoints", args.remote)
    payload = {
        "model_name": plan.model_name,
        "max_length": plan.max_length,
        "freeze_encoder_layers": plan.freeze_encoder_layers,
        "training_args": training_args,
    }

    output_path = Path(args.output_json)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")

    if args.dry_run:
        print(json.dumps(payload, indent=2))
        return

    raise SystemExit("Training launcher stub created. Integrate this with a HuggingFace Trainer job.")


if __name__ == "__main__":
    main()
