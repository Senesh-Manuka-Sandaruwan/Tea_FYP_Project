import base64
import io
import json
import os
import urllib.error
import urllib.request

from PIL import Image

from utils.model_loader import CLASS_NAMES

OPENAI_URL = "https://api.openai.com/v1/chat/completions"
OPENAI_MODEL = "gpt-4.1"
ALLOWED = set(CLASS_NAMES) | {"not_a_leaf"}


def _encode_image(image_path):
    # Send the original image bytes when possible (no resize / re-encode).
    # Fall back to lossless PNG only if the file cannot be read as-is.
    with open(image_path, "rb") as image_file:
        raw = image_file.read()

    lower = image_path.lower()
    if lower.endswith((".jpg", ".jpeg")):
        mime = "image/jpeg"
        encoded = base64.b64encode(raw).decode("utf-8")
    elif lower.endswith(".png"):
        mime = "image/png"
        encoded = base64.b64encode(raw).decode("utf-8")
    elif lower.endswith(".webp"):
        mime = "image/webp"
        encoded = base64.b64encode(raw).decode("utf-8")
    else:
        image = Image.open(image_path).convert("RGB")
        buffer = io.BytesIO()
        image.save(buffer, format="PNG")
        mime = "image/png"
        encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")

    return mime, encoded


def _normalize_probs(raw_probs):
    probs = {
        class_name: float(raw_probs.get(class_name, 0.0))
        for class_name in CLASS_NAMES
    }
    total = sum(probs.values())
    if total <= 0:
        return {class_name: 0.0 for class_name in CLASS_NAMES}
    return {
        class_name: round(value / total, 4)
        for class_name, value in probs.items()
    }


def classify_tea_leaf(image_path):
    api_key = os.environ.get("OPENAI_API_KEY", "").strip()
    if not api_key:
        print("PREDICTION is missing; skipping remote classification.")
        return None

    mime, encoded_image = _encode_image(image_path)

    payload = {
        "model": OPENAI_MODEL,
        "temperature": 0,
        "top_p": 1,
        "seed": 42,
        "max_tokens": 150,
        "response_format": {"type": "json_object"},
        "messages": [
            {
                "role": "system",
                "content": (
                    "Look at the image and choose exactly one class. "
                    "Allowed values for prediction: "
                    "gray_blight, brown_blight, red_rust, healthy, not_a_leaf. "
                    "Use not_a_leaf if it is not a tea leaf or not a leaf image. "
                    "Reply with JSON only: "
                    "{\"prediction\": \"...\", \"confidence\": 0.0, "
                    "\"all_probs\": {\"brown_blight\": 0, \"gray_blight\": 0, "
                    "\"healthy\": 0, \"red_rust\": 0}}"
                ),
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": (
                            "Which class does this leaf belong to? "
                            "gray_blight, brown_blight, red_rust, healthy, or not_a_leaf."
                        ),
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:{mime};base64,{encoded_image}",
                            "detail": "high",
                        },
                    },
                ],
            },
        ],
    }

    request = urllib.request.Request(
        OPENAI_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            body = json.loads(response.read().decode("utf-8"))
        content = body["choices"][0]["message"]["content"]
        result = json.loads(content)
    except (urllib.error.URLError, urllib.error.HTTPError, KeyError, json.JSONDecodeError, TimeoutError) as error:
        print(f" classification failed: {error}")
        return None

    prediction = str(result.get("prediction", "")).strip().lower().replace(" ", "_").replace("-", "_")
    if prediction in {"not_a_tea_leaf", "not_tea_leaf", "other_plant", "non_tea_leaf"}:
        prediction = "not_a_leaf"
    if prediction not in ALLOWED:
        print(f" returned unsupported prediction: {prediction!r}")
        return None

    print(f"Prediction: {prediction} (confidence={result.get('confidence')})")
    confidence = float(result.get("confidence", 0.0))
    confidence = max(0.0, min(confidence, 1.0))
    all_probs = _normalize_probs(result.get("all_probs") or {})
    if prediction == "not_a_leaf":
        all_probs = {class_name: 0.0 for class_name in CLASS_NAMES}

    return {
        "prediction": prediction,
        "confidence": round(confidence, 4),
        "all_probs": all_probs,
    }
