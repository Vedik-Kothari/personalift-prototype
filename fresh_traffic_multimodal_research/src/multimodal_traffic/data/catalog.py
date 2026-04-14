from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List

import yaml


@dataclass
class DatasetEntry:
    name: str
    country: str
    modality: str
    local_path: Path
    classes: List[str]
    enabled: bool
    license_note: str
    city: str | None = None


def load_dataset_catalog(config_path: str | Path) -> Dict[str, DatasetEntry]:
    config_path = Path(config_path)
    with config_path.open("r", encoding="utf-8") as handle:
        config = yaml.safe_load(handle)

    datasets = {}
    for name, raw_entry in config.get("datasets", {}).items():
        datasets[name] = DatasetEntry(
            name=name,
            country=raw_entry["country"],
            modality=raw_entry["modality"],
            local_path=Path(raw_entry["local_path"]),
            classes=list(raw_entry.get("classes", [])),
            enabled=bool(raw_entry.get("enabled", False)),
            license_note=raw_entry.get("license_note", ""),
            city=raw_entry.get("city"),
        )
    return datasets
