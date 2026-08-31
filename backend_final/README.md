# 🍵 Tea Disease Hybrid Model API

[![Python](https://img.shields.io/badge/Python-3.10-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.x-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.x-EE4C2C?logo=pytorch&logoColor=white)](https://pytorch.org/)

An advanced AI-powered Flask backend API designed for the detection and diagnosis of tea leaf diseases. The application employs a **Hybrid Deep Learning Ensemble Model** combining **EfficientNet-B0** and **Vision Transformer (ViT-Base)** to make highly accurate predictions. It also integrates **Grad-CAM (Gradient-weighted Class Activation Mapping)** to provide visual explanations of its predictions by generating heatmaps on the diseased leaf areas.

---

## 🌟 Key Features

* **Hybrid Ensemble Inference**: Combines predictions from a Vision Transformer (weight `0.4`) and EfficientNet-B0 (weight `0.6`) for maximum precision and robust generalization.
* **Explainable AI (Grad-CAM)**: Highlights the specific spatial features (such as rust spots, lesions, blister patches, or discoloration) on the leaf surface that influenced the prediction.
* **4-Class Diagnosis**: Capable of detecting the following leaf conditions:
  * `blister_blight`
  * `brown_blight`
  * `healthy`
  * `red_rust`
* **Real-time API Endpoints**: Accepts file uploads via standard HTTP POST, outputs detailed diagnosis, all class confidence scores, explanation texts, and public URLs to the heatmaps.

---

## 📂 Project Directory Structure

```text
backend/
├── .venv/                     # Python 3.10 virtual environment
├── models/                    # trained deep learning weights (.pth)
│   ├── efficientnet_b0_best.pth
│   ├── simple_cnn_best.pth
│   ├── vit_base_patch16_224_best.pth
│   └── tea_leaf_model_results.json
├── static/
│   └── explanations/          # Generated Grad-CAM heatmap visualization files
├── uploads/                   # Uploaded source tea leaf images
├── utils/
│   ├── __init__.py
│   ├── inference.py           # Image preprocessing, ensemble inference & Grad-CAM generator
│   └── model_loader.py        # Helper to load models into GPU/CPU
├── app.py                     # Main Flask entry point containing API routes
├── requirements.txt           # Package dependencies
└── README.md                  # Project documentation (this file)
```

---

## 📊 Model Performance Comparison

Below are the evaluation metrics for the individual models trained on the tea leaf disease dataset (from [models/tea_leaf_model_results.json](file:///e:/Sysconex/research_projects/tea_apit/backend/models/tea_leaf_model_results.json)):

| Model | Accuracy | Precision | Recall | F1-Score |
| :--- | :---: | :---: | :---: | :---: |
| **EfficientNet-B0** | **99.93%** | **99.93%** | **99.93%** | **99.93%** |
| **Simple CNN** | 99.76% | 99.76% | 99.76% | 99.76% |
| **ViT-Base** | 95.03% | 95.12% | 95.03% | 95.03% |

*The backend ensembles **EfficientNet-B0** and **ViT-Base** to produce highly stabilized inference output.*

---

## 🚀 Step-by-Step Setup Guide

Follow these steps to set up and run the Flask API locally on your Windows machine:

### 1. Locate the Virtual Environment
   py -3.10 -m venv .venv --clear

### 2. Activate the Virtual Environment
Open your terminal (CMD or PowerShell) in the `backend/` directory and activate the environment:

* **Windows PowerShell**:
  ```powershell
  .venv\Scripts\Activate.ps1
  ```
  *(If you face execution policy issues in PowerShell, run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process` first)*


  ```

### 3. Install Dependencies
Once the virtual environment is activated, install all required dependencies:
```bash
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

### 4. Run the API Server
Start the Flask web application using:
```bash
python app.py
```
By default, the server runs in debug mode at:  
👉 **`http://127.0.0.1:5000`**

---

## 🔌 API Endpoints Documentation

### 1. Health Check
Checks if the Flask API server is up and running.

* **URL**: `/`
* **Method**: `GET`
* **Response**: `Tea Disease Hybrid Model API Running`

---

### 2. Predict & Diagnose Tea Disease
Uploads a tea leaf image, runs ensemble prediction, generates a Grad-CAM explanation heatmap, and returns a JSON payload.

* **URL**: `/predict`
* **Method**: `POST`
* **Headers**: `Content-Type: multipart/form-data`
* **Body / Parameters**:
  * `file` or `image` (binary file): The tea leaf image in JPEG or PNG format.

#### Example Request (using Curl)
```bash
curl -X POST -F "file=@tea_leaf_rust.jpg" http://127.0.0.1:5000/predict
```

#### Example Response
```json
{
  "prediction": "red_rust",
  "confidence": 0.9984,
  "explanation_text": "The prediction is mainly influenced by highlighted rust-coloured or reddish-brown regions that resemble red rust symptoms.",
  "all_probs": {
    "blister_blight": 0.0003,
    "brown_blight": 0.0012,
    "healthy": 0.0001,
    "red_rust": 0.9984
  },
  "gradcam_image": "http://127.0.0.1:5000/static/explanations/gradcam_8bb7621c-99d7-466d-88f5-4702a4bf7453.jpg"
}
```

---

## 🛠 Troubleshooting

* **CUDA Out of Memory / Fallback to CPU**:  
  The code automatically detects if a compatible NVIDIA GPU (CUDA) is available. If none is found, it falls back seamlessly to the CPU.
* **Weights Missing**:  
  Ensure that the `.pth` files are present in the `models/` directory before running `app.py`.
