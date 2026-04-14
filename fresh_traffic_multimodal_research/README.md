# Multimodal Intelligent Traffic Signal Control for Indian Roads

This project builds an India-specific multimodal traffic signal control research pipeline using real traffic datasets, YOLO-based visual detection, and BERT-style semantic reasoning.

## Research Goal

Develop a publishable traffic-control system that:

- uses Indian traffic datasets instead of generic Western-only road data,
- detects heterogeneous road users such as two-wheelers and auto-rickshaws,
- converts visual scene state into structured natural language,
- reasons about signal timing with an interpretable language model,
- and produces reproducible artifacts for a personalized IEEE-style research paper.

## Project Layout

- `configs/`: dataset and experiment configuration
- `scripts/`: executable entrypoints for dataset preparation, training, and evaluation
- `src/multimodal_traffic/`: reusable Python package
- `paper/`: LaTeX paper workspace
- `artifacts/`: generated outputs, metrics, and tables

## Real Dataset Strategy

The project is designed around India-relevant public datasets:

- UVH-26
- DriveIndia
- DATS_2022
- Indian Road Driving Dataset
- emergency-vehicle support datasets where licensing permits

Because different sources expose different formats and labels, the pipeline normalizes them into a common scene schema before creating the reasoning dataset.

## CPU-First / Kaggle-Ready Design

Local laptop workflow:

- inspect datasets
- generate scene summaries
- build the text reasoning dataset
- run lightweight evaluation and paper generation

Kaggle GPU workflow:

- fine-tune YOLO on selected Indian subsets
- export detections or train checkpoints
- fine-tune DistilBERT on generated reasoning samples

## Suggested Workflow

1. Configure dataset locations in `configs/datasets.yaml`.
2. Prepare normalized scene metadata with `python scripts/prepare_real_dataset.py`.
3. Build text reasoning data with `python scripts/build_reasoning_dataset.py`.
4. Generate YOLO training command with `python scripts/train_yolo.py --dry-run`.
5. Generate reasoning plan with `python scripts/train_reasoner.py --dry-run`.
6. Evaluate baseline and multimodal policies with `python scripts/evaluate_system.py`.
7. Export paper assets with `python scripts/export_paper_assets.py`.
