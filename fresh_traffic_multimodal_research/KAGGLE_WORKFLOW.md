# Kaggle Workflow

Use Kaggle only for the heavy training stages. Keep preprocessing, inspection, and paper generation local.

## 1. Local Preparation

- set dataset paths in `configs/datasets.yaml`
- inspect availability with `python scripts/prepare_real_dataset.py`
- normalize scene metadata into `data/processed/scene_state_table.csv`
- generate reasoning samples with `python scripts/build_reasoning_dataset.py`

## 2. Kaggle YOLO Training

Generate the command locally:

```bash
python scripts/train_yolo.py --dry-run --remote --data-yaml configs/yolo_data_kaggle.yaml
```

If your images are already under `/kaggle/working/images`, you can train directly from there without using `/kaggle/input`.

Expected structure:

```text
/kaggle/working/
  images/
    train/
    val/
  labels/
    train/
    val/
```

Then run YOLO with:

```bash
yolo detect train data=configs/yolo_data_kaggle.yaml model=yolov8n.pt imgsz=640 epochs=40 batch=16 project=artifacts/yolo name=india_traffic
```

## 3. Kaggle Reasoning Training

Generate the training plan locally:

```bash
python scripts/train_reasoner.py --dry-run --remote
```

Use the saved JSON in `artifacts/reasoner_training_plan.json` to configure a HuggingFace Trainer job on Kaggle.

## 4. Bring Results Back

After Kaggle training, copy back:

- YOLO metrics
- confusion matrix and mAP values
- best checkpoint metadata
- reasoning metrics
- latency or inference measurements
- baseline comparison CSV

## 5. Export Paper Assets

```bash
python scripts/export_paper_assets.py
```

This creates `paper/paper_assets.json` for the research paper workflow.
