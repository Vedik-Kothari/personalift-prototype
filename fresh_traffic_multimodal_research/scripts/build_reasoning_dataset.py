from __future__ import annotations

import argparse

import pandas as pd

from multimodal_traffic.pipelines.build_reasoning_dataset import build_samples, write_jsonl


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input-csv", default="data/processed/scene_state_table.csv")
    parser.add_argument("--output-jsonl", default="data/processed/reasoning_dataset.jsonl")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    frame_table = pd.read_csv(args.input_csv)
    samples = build_samples(frame_table)
    write_jsonl(samples, args.output_jsonl)
    print(f"Wrote {len(samples)} reasoning samples to {args.output_jsonl}")


if __name__ == "__main__":
    main()
