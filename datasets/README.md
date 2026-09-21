# PestShield Datasets

This folder contains information about the datasets used for the PestShield plant disease detection module.

## Crops Covered

The current project uses datasets for the following crops:

* Groundnut
* Chilli
* Potato

## Dataset Structure

The datasets are organized according to crop:

```text
datasets/
├── groundnut/
├── chilli/
└── potato/
```

Each crop dataset contains images used for training and evaluating the plant disease detection models.

## Purpose

These datasets are used to train and evaluate deep learning models for identifying diseases affecting the selected crops. The trained model will be integrated into the PestShield application to support crop disease detection.

## Dataset Source

The original datasets were obtained from publicly available agricultural/plant disease datasets. The exact source and dataset citation should be added here based on the dataset actually used by the project.
groundnut: https://data.mendeley.com/datasets/x6x5jkk873/1
chilli:https://data.mendeley.com/datasets/ptz377bwb8/1
potato: https://www.kaggle.com/datasets/ravindubandara3002/chilli-plant-diseases-dataset?resource=download


## Important Note

The complete image datasets are not intended to be uploaded to the GitHub repository because of their large size.

Team members should obtain the datasets separately and place them inside the corresponding crop folders.

Expected local structure:

```text
PestShield/
│
├── pestshield-app/
│
└── datasets/
    ├── groundnut/
    │   └── <groundnut dataset files>
    │
    ├── chilli/
    │   └── <chilli dataset files>
    │
    └── potato/
        └── <potato dataset files>
```

## Usage

The datasets are primarily used during the AI model training and evaluation phase. The trained model files used by the PestShield application are maintained separately from the raw datasets.
