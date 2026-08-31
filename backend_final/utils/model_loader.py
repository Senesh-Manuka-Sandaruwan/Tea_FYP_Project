import json
import os

import timm
import torch

from model import SimpleCNN

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

MODELS_DIR = "models"
CONFIG_PATH = os.path.join(MODELS_DIR, "hybrid_ensemble_config.json")


def load_ensemble_config():
    with open(CONFIG_PATH, "r", encoding="utf-8") as config_file:
        return json.load(config_file)


ENSEMBLE_CONFIG = load_ensemble_config()
CLASS_NAMES = ENSEMBLE_CONFIG["classes"]
NUM_CLASSES = len(CLASS_NAMES)


def _load_state_dict(path):
    state_dict = torch.load(path, map_location=device)
    if not isinstance(state_dict, dict):
        raise ValueError(f"Unexpected checkpoint format in {path}")

    if any(key.startswith("module.") for key in state_dict.keys()):
        state_dict = {
            key.replace("module.", "", 1): value
            for key, value in state_dict.items()
        }

    return state_dict


def _load_cnn(path, num_classes):
    model = SimpleCNN(num_classes=num_classes)
    model.load_state_dict(_load_state_dict(path))
    model.to(device)
    model.eval()
    return model


def _load_efficientnet(path, num_classes):
    model = timm.create_model(
        "efficientnet_b0",
        pretrained=False,
        num_classes=num_classes,
    )
    model.load_state_dict(_load_state_dict(path))
    model.to(device)
    model.eval()
    return model


def _load_vit(path, num_classes):
    model = timm.create_model(
        "vit_base_patch16_224",
        pretrained=False,
        num_classes=num_classes,
    )
    model.load_state_dict(_load_state_dict(path))
    model.to(device)
    model.eval()
    return model


MODEL_BUILDERS = {
    "cnn": _load_cnn,
    "efficientnet": _load_efficientnet,
    "vit": _load_vit,
}


def load_hybrid_models():
    """
    Load CNN, EfficientNet-B0, and ViT-Base with ensemble weights
    from models/hybrid_ensemble_config.json.
    """
    models = {}
    weights = {}

    for key, filename, weight in zip(
        ENSEMBLE_CONFIG["model_keys"],
        ENSEMBLE_CONFIG["models"],
        ENSEMBLE_CONFIG["weights"],
    ):
        if key not in MODEL_BUILDERS:
            raise ValueError(f"Unsupported ensemble model key: {key}")

        path = os.path.join(MODELS_DIR, filename)
        if not os.path.exists(path):
            raise FileNotFoundError(f"Missing model weights: {path}")

        print(f"Loading {key} from {path} ...")
        models[key] = MODEL_BUILDERS[key](path, NUM_CLASSES)
        weights[key] = float(weight)
        print(f"{key} loaded.")

    weight_total = sum(weights.values())
    if weight_total <= 0:
        raise ValueError("Ensemble weights must sum to a positive value.")

    weights = {key: value / weight_total for key, value in weights.items()}
    return models, weights


def load_model():
    """Backward-compatible helper that returns only the CNN model."""
    models, _weights = load_hybrid_models()
    return models["cnn"]
