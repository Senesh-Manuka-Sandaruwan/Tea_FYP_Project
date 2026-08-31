import os
import uuid

import cv2
import numpy as np
import torch
import torch.nn.functional as F
from PIL import Image
from torchvision import transforms
from torchvision.models import mobilenet_v3_small, MobileNet_V3_Small_Weights

from utils.model_loader import CLASS_NAMES
from utils.model_loadertwo import classify_tea_leaf

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# -----------------------------
# Pretrained leaf / plant gate
# -----------------------------
leaf_detector_weights = MobileNet_V3_Small_Weights.DEFAULT
leaf_detector = mobilenet_v3_small(weights=leaf_detector_weights)
leaf_detector.to(device)
leaf_detector.eval()

leaf_detector_transform = leaf_detector_weights.transforms()
imagenet_categories = leaf_detector_weights.meta["categories"]

LEAF_RELATED_KEYWORDS = [
    # Direct leaf / plant terms
    "leaf", "plant", "tree", "flower", "garden", "greenhouse",

    # Common plant / crop / vegetation ImageNet terms
    "banana", "fig", "orange", "lemon", "pineapple", "pomegranate",
    "acorn", "corn", "ear", "buckeye", "hip", "cardoon",
    "daisy", "rapeseed",

    # Tea leaf images may sometimes be classified as these due to texture/background
    "cabbage", "broccoli", "cauliflower", "zucchini", "cucumber",
    "mushroom", "hay"
]

NON_LEAF_STRONG_KEYWORDS = [
    # furniture / objects
    "chair", "table", "desk", "sofa", "couch", "bed", "wardrobe",
    "bench", "stool", "cabinet", "bookcase",

    # vehicles
    "car", "bus", "truck", "bicycle", "motorcycle", "airplane",
    "train", "boat", "ship", "scooter",

    # electronics
    "keyboard", "mouse", "laptop", "monitor", "screen", "phone",
    "cellular telephone", "computer", "television", "remote control",

    # kitchen / household
    "cup", "bottle", "plate", "spoon", "fork", "knife", "mug",
    "bucket", "vase", "lamp", "clock",

    # humans / clothes / accessories
    "person", "man", "woman", "boy", "girl", "groom", "bride",
    "suit", "jersey", "sweatshirt", "cardigan", "coat", "trench coat",
    "bow tie", "tie", "wig", "mask", "sunglasses", "hat", "cap",
    "shirt", "jean", "shoe", "sandal", "backpack", "bag",

    # animals
    "dog", "cat", "bird", "horse", "cow", "sheep", "monkey",
    "bear", "elephant", "zebra", "lion", "tiger"
]

def check_leaf_or_plant_image(image_path, top_k=5):
    """
    Uses a pretrained ImageNet MobileNet model as an input gate.
    If the image does not look plant/leaf-like, it is rejected before disease classification.
    """
    image = Image.open(image_path).convert("RGB")
    input_tensor = leaf_detector_transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = leaf_detector(input_tensor)
        probabilities = F.softmax(outputs, dim=1)

    top_probs, top_indices = torch.topk(probabilities, top_k)
    top_predictions = []

    for prob, idx in zip(top_probs[0], top_indices[0]):
        label = imagenet_categories[idx.item()]
        confidence = prob.item()
        top_predictions.append({
            "label": label,
            "confidence": round(confidence * 100, 2)
        })

    leaf_score = 0.0
    non_leaf_score = 0.0

    for item in top_predictions:
        label = item["label"].lower()
        confidence = item["confidence"] / 100

        if any(keyword in label for keyword in LEAF_RELATED_KEYWORDS):
            leaf_score += confidence

        if any(keyword in label for keyword in NON_LEAF_STRONG_KEYWORDS):
            non_leaf_score += confidence

    print("Leaf detector top predictions:", top_predictions)
    print("Leaf score:", round(leaf_score * 100, 2))
    print("Non-leaf score:", round(non_leaf_score * 100, 2))

    if leaf_score >= 0.10:
        return {
            "is_leaf": True,
            "confidence": round(leaf_score * 100, 2),
            "reason": "The pretrained model detected plant-like visual content.",
            "top_predictions": top_predictions
        }

    if non_leaf_score >= 0.10:
        return {
            "is_leaf": False,
            "confidence": round(non_leaf_score * 100, 2),
            "reason": "The pretrained model detected non-leaf visual content.",
            "top_predictions": top_predictions
        }

    return {
        "is_leaf": False,
        "confidence": round((1 - leaf_score) * 100, 2),
        "reason": "The image was not confidently detected as leaf or plant-like, so disease classification was skipped.",
        "top_predictions": top_predictions
    }

image_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225],
    ),
])


class GradCAM:
    def __init__(self, model, target_layer):
        self.model = model
        self.target_layer = target_layer
        self.gradients = None
        self.activations = None

        self.target_layer.register_forward_hook(self.save_activation)
        self.target_layer.register_full_backward_hook(self.save_gradient)

    def save_activation(self, module, input, output):
        self.activations = output.detach()

    def save_gradient(self, module, grad_input, grad_output):
        self.gradients = grad_output[0].detach()

    def generate(self, input_tensor, class_index):
        self.model.zero_grad()

        output = self.model(input_tensor)
        score = output[:, class_index]
        score.backward()

        weights = torch.mean(self.gradients, dim=(2, 3), keepdim=True)
        cam = torch.sum(weights * self.activations, dim=1)
        cam = F.relu(cam)
        cam = cam.squeeze().cpu().numpy()
        cam = cv2.resize(cam, (224, 224))

        cam_min = np.min(cam)
        cam_max = np.max(cam)

        if cam_max - cam_min != 0:
            cam = (cam - cam_min) / (cam_max - cam_min)
        else:
            cam = np.zeros_like(cam)

        return cam


def get_gradcam_target(models):
    """Prefer EfficientNet conv features; fall back to the CNN last conv layer."""
    if "efficientnet" in models:
        return models["efficientnet"], models["efficientnet"].conv_head, "efficientnet"
    if "cnn" in models:
        return models["cnn"], models["cnn"].features[12], "cnn"
    return None, None, None


def create_gradcam_images(model, target_layer, image_path, input_tensor, predicted_index, upload_folder):
    gradcam = GradCAM(model, target_layer)
    cam = gradcam.generate(input_tensor, predicted_index)

    original_image = Image.open(image_path).convert("RGB")
    original_image = original_image.resize((224, 224))
    original_np = np.array(original_image)

    heatmap = np.uint8(255 * cam)
    heatmap_color = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
    heatmap_color = cv2.cvtColor(heatmap_color, cv2.COLOR_BGR2RGB)
    overlay = cv2.addWeighted(original_np, 0.6, heatmap_color, 0.4, 0)

    unique_id = uuid.uuid4().hex
    heatmap_filename = f"gradcam_{unique_id}_heatmap.jpg"
    overlay_filename = f"gradcam_{unique_id}_overlay.jpg"

    heatmap_path = os.path.join(upload_folder, heatmap_filename)
    overlay_path = os.path.join(upload_folder, overlay_filename)

    cv2.imwrite(heatmap_path, cv2.cvtColor(heatmap_color, cv2.COLOR_RGB2BGR))
    cv2.imwrite(overlay_path, cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR))

    return heatmap_filename, overlay_filename


def get_image_observation(predicted_class, confidence):
    if predicted_class == "healthy":
        return (
            "The model predicted healthy because the image does not show strong disease-like "
            "visual patterns in the regions it focused on. The leaf area appears more consistent "
            "and less affected by visible blight-like damage."
        )

    if predicted_class == "brown_blight":
        return (
            "The model predicted brown blight because the highlighted regions likely contain "
            "dark or brownish damaged areas, irregular spots, or discolored patches that are "
            "visually associated with brown blight symptoms."
        )

    if predicted_class == "gray_blight":
        return (
            "The model predicted gray blight because the highlighted regions likely contain "
            "grayish or pale damaged areas, irregular lesions, or texture changes that are "
            "visually associated with gray blight symptoms."
        )
    if predicted_class == "red_rust":
        return (
            "The model predicted red rust because the highlighted regions likely contain "
            "reddish-orange or rust-colored spots, small raised patches, or discolored areas "
            "that are visually associated with red rust symptoms."
        )

    return (
        "The model made this prediction based on the highlighted visual regions in the image."
    )


def format_explanation_text(explanation):
    return " ".join([
        explanation["summary"],
        explanation["image_observation"],
        explanation["gradcam_note"],
    ])


def build_explanation(predicted_class, confidence, heatmap_url, overlay_url):
    if predicted_class == "unknown_or_unsupported":
        return {
            "summary": (
                "The model could not confidently match this image to one of the supported classes."
            ),
            "image_observation": (
                "The image may be unclear, outside the trained disease categories, "
                "or may not be a supported tea leaf image."
            ),
            "gradcam_note": (
                "The heatmap still shows where the model focused, but the confidence "
                "was below the accepted threshold."
            ),
            "heatmap_url": heatmap_url,
            "overlay_url": overlay_url,
        }

    return {
        "summary": (
            f"The hybrid ensemble predicted {predicted_class} with {confidence:.2f}% confidence "
            "by combining CNN, EfficientNet-B0, and ViT-Base. "
            "The highlighted areas in the Grad-CAM image had the strongest influence "
            "on this prediction."
        ),
        "image_observation": get_image_observation(predicted_class, confidence),
        "gradcam_note": (
            "Red and yellow areas in the Grad-CAM overlay show the image regions that "
            "contributed most strongly to the model's decision. Blue or darker areas "
            "contributed less."
        ),
        "heatmap_url": heatmap_url,
        "overlay_url": overlay_url,
    }


def _probs_to_dict(probabilities):
    return {
        CLASS_NAMES[i]: round(float(probabilities[0][i].item()), 4)
        for i in range(len(CLASS_NAMES))
    }


def predict_image(models, image_path, upload_folder, base_url, ensemble_weights=None, threshold=0.70):
    if not isinstance(models, dict):
        models = {"cnn": models}

    if ensemble_weights is None:
        equal_weight = 1.0 / len(models)
        ensemble_weights = {key: equal_weight for key in models}

    api_result = classify_tea_leaf(image_path)
    if api_result and api_result["prediction"] == "not_a_leaf":
        return {
            "prediction": "not_a_leaf",
            "confidence": api_result["confidence"],
            "explanation_text": "This image does not appear to contain a tea leaf.",
            "all_probs": {class_name: 0.0 for class_name in CLASS_NAMES},
            "model_probs": {},
            "ensemble_weights": ensemble_weights,
            "gradcam_image": None,
        }

    image = Image.open(image_path).convert("RGB")
    input_tensor = image_transform(image)
    input_tensor = input_tensor.unsqueeze(0).to(device)

    model_probs = {}
    ensemble_probabilities = None

    with torch.no_grad():
        for key, model in models.items():
            outputs = model(input_tensor)
            probabilities = F.softmax(outputs, dim=1)
            model_probs[key] = _probs_to_dict(probabilities)

            weighted = probabilities * ensemble_weights.get(key, 0.0)
            if ensemble_probabilities is None:
                ensemble_probabilities = weighted
            else:
                ensemble_probabilities = ensemble_probabilities + weighted

    confidence_tensor, predicted_index_tensor = torch.max(ensemble_probabilities, dim=1)
    confidence = confidence_tensor.item()
    predicted_index = predicted_index_tensor.item()
    predicted_class = CLASS_NAMES[predicted_index]
    all_probs = _probs_to_dict(ensemble_probabilities)

    if api_result and api_result["prediction"] in CLASS_NAMES:
        predicted_class = api_result["prediction"]
        confidence = api_result["confidence"]
        all_probs = api_result["all_probs"]
        predicted_index = CLASS_NAMES.index(predicted_class)

    overlay_url = None
    heatmap_url = None
    cam_model, target_layer, _cam_key = get_gradcam_target(models)
    if cam_model is not None and target_layer is not None:
        heatmap_filename, overlay_filename = create_gradcam_images(
            model=cam_model,
            target_layer=target_layer,
            image_path=image_path,
            input_tensor=input_tensor,
            predicted_index=predicted_index,
            upload_folder=upload_folder,
        )
        base_url = base_url.rstrip("/")
        heatmap_url = f"{base_url}/uploads/{heatmap_filename}"
        overlay_url = f"{base_url}/uploads/{overlay_filename}"

    used_api = bool(api_result and api_result["prediction"] in CLASS_NAMES)
    if confidence < threshold and not used_api:
        explanation = build_explanation(
            predicted_class="unknown_or_unsupported",
            confidence=confidence * 100,
            heatmap_url=heatmap_url,
            overlay_url=overlay_url,
        )
        explanation_text = (
            "The hybrid ensemble is not confident enough. This may not be a supported tea leaf class. "
            + format_explanation_text(explanation)
        )

        return {
            "prediction": predicted_class,
            "confidence": round(confidence, 4),
            "explanation_text": explanation_text,
            "all_probs": all_probs,
            "model_probs": model_probs,
            "ensemble_weights": ensemble_weights,
            "gradcam_image": overlay_url,
        }

    explanation = build_explanation(
        predicted_class=predicted_class,
        confidence=confidence * 100,
        heatmap_url=heatmap_url,
        overlay_url=overlay_url,
    )

    return {
        "prediction": predicted_class,
        "confidence": round(confidence, 4),
        "explanation_text": format_explanation_text(explanation),
        "all_probs": all_probs,
        "model_probs": model_probs,
        "ensemble_weights": ensemble_weights,
        "gradcam_image": overlay_url,
    }
