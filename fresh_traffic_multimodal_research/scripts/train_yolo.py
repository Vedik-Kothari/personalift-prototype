from __future__ import annotations

import argparse
from pathlib import Path

import yaml


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default="configs/experiment.yaml")
    parser.add_argument("--data-yaml", default="configs/yolo_data_india.yaml")
    parser.add_argument("--dataset-root", default=None, help="Override dataset root, e.g. /kaggle/working")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--remote", action="store_true")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    with Path(args.config).open("r", encoding="utf-8") as handle:
        config = yaml.safe_load(handle)

    vision = config["vision"]
    batch_size = vision["batch_size_kaggle"] if args.remote else vision["batch_size_local"]
    data_arg = args.data_yaml
    if args.dataset_root:
        data_arg = f"{args.data_yaml} dataset_root={args.dataset_root}"
    command = (
        f"yolo detect train data={data_arg} model={vision['model_name']}.pt "
        f"imgsz={vision['image_size']} epochs={vision['epochs']} batch={batch_size} "
        f"project=artifacts/yolo name=india_traffic"
    )

    if args.dry_run:
        print(command)
        return

    raise SystemExit("Training is not launched automatically. Run the printed command in a prepared environment.")


if __name__ == "__main__":
    main()
