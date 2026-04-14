from __future__ import annotations

import json
from pathlib import Path

import pandas as pd

from multimodal_traffic.evaluation.metrics import summarize_control_metrics


def main() -> None:
    input_path = Path("data/processed/policy_comparison.csv")
    if not input_path.exists():
        raise SystemExit("Expected data/processed/policy_comparison.csv with baseline and multimodal results.")

    table = pd.read_csv(input_path)
    results = {}
    for method, group in table.groupby("method"):
        results[method] = summarize_control_metrics(group["wait_time_sec"], group["throughput"])
        results[method]["emergency_delay_sec"] = float(group["emergency_delay_sec"].mean())

    output_path = Path("artifacts/control_metrics.json")
    output_path.write_text(json.dumps(results, indent=2), encoding="utf-8")
    print(f"Wrote evaluation summary to {output_path}")


if __name__ == "__main__":
    main()
