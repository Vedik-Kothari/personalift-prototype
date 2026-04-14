# Real Dataset Acquisition Guide

This project is designed around real Indian traffic datasets.

## Recommended Primary Dataset

### UVH-26

- Focus: Bengaluru CCTV traffic images
- Use in this project: primary perception dataset for Indian urban traffic detection
- Best fit: roadside or CCTV-style vehicle detection

Official sources:

- IISc announcement: https://iisc.ac.in/events/aim-iisc-announces-public-release-of-uvh-26-dataset-and-vision-models-for-indian-urban-traffic/
- Hugging Face dataset: https://huggingface.co/datasets/iisc-aim/UVH-26

## Recommended Secondary Dataset

### Indian Road Driving Dataset

- Focus: Delhi NCR dashcam driving scenes
- Use in this project: improve class diversity and robustness for Indian road users
- Best fit: heterogeneous Indian traffic objects and scene variation

Official source:

- Hugging Face dataset: https://huggingface.co/datasets/thirdeyelabs/indian-road-dataset

## Optional Supporting Datasets

### DriveIndia

- Focus: Indian traffic object detection
- Use in this project: additional class coverage and cross-dataset validation

Reference:

- Paper summary: https://papers.cool/arxiv/2507.19912

### DATS_2022

- Focus: Indian unstructured traffic
- Use in this project: robustness under non-lane-disciplined conditions

Reference:

- PubMed record: https://pubmed.ncbi.nlm.nih.gov/35898859/

## Practical Recommendation

For the first credible research iteration:

1. Train YOLO on UVH-26.
2. Add a sampled subset of the Indian Road Driving Dataset for robustness.
3. Reserve a held-out subset for evaluation only.
4. Use real detections and normalized scene metadata to build the reasoning dataset.

## Licensing Note

Before training or redistribution, verify each dataset license and citation requirement.
