from __future__ import annotations

import json
from pathlib import Path


def main() -> None:
    inventory_path = Path("artifacts/dataset_inventory.json")
    control_metrics_path = Path("artifacts/control_metrics.json")
    training_plan_path = Path("artifacts/reasoner_training_plan.json")

    payload = {
        "dataset_inventory": json.loads(inventory_path.read_text(encoding="utf-8")) if inventory_path.exists() else [],
        "control_metrics": json.loads(control_metrics_path.read_text(encoding="utf-8")) if control_metrics_path.exists() else {},
        "reasoner_training_plan": json.loads(training_plan_path.read_text(encoding="utf-8")) if training_plan_path.exists() else {},
    }

    output_path = Path("paper/paper_assets.json")
    output_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"Wrote paper assets to {output_path}")


if __name__ == "__main__":
    main()
