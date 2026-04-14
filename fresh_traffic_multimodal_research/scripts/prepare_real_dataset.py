from __future__ import annotations

import json
from pathlib import Path

from multimodal_traffic.data.catalog import load_dataset_catalog


def main() -> None:
    catalog = load_dataset_catalog("configs/datasets.yaml")
    summary = []

    for name, entry in catalog.items():
        summary.append(
            {
                "dataset": name,
                "enabled": entry.enabled,
                "local_path": str(entry.local_path),
                "exists": entry.local_path.exists(),
                "classes": entry.classes,
                "license_note": entry.license_note,
                "country": entry.country,
                "city": entry.city,
            }
        )

    output_path = Path("artifacts/dataset_inventory.json")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print(f"Wrote dataset inventory to {output_path}")


if __name__ == "__main__":
    main()
