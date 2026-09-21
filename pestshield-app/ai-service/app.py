import io
import json
import logging
from pathlib import Path

import torch
import torch.nn.functional as F
from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from torchvision import transforms

from models import ARCH_BUILDERS
from class_names import FALLBACK_CLASSES

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("pestshield-ai")

MODELS_DIR = Path(__file__).parent / "models"
CROPS = ["groundnut", "potato", "chilli"]
CONFIDENCE_THRESHOLD = 0.60  # below this, the app should ask the farmer to pick manually

IMG_SIZE = 224
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]
transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
])

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

app = FastAPI(title="PestShield AI Detection Service")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

_loaded = {}  # crop -> (model, class_names, detected_format)


def find_model_file(crop):
    """Accept a few common naming patterns so one naming mismatch doesn't
    take down the whole service."""
    candidates = [
        MODELS_DIR / f"{crop}.pt",
        MODELS_DIR / f"best_{crop}.pt",
        MODELS_DIR / f"best_{crop}_resnet18.pt",
        MODELS_DIR / f"best_{crop}_mobilenet_v2.pt",
    ]
    for c in candidates:
        if c.exists():
            return c
    matches = list(MODELS_DIR.glob(f"*{crop}*.pt"))
    return matches[0] if matches else None


def load_class_names(crop, model_path):
    """Look for a class_indices.json (or similarly named file) next to the
    model. Falls back to the hardcoded lists in class_names.py."""
    for name in (f"{crop}_classes.json", "class_indices.json", f"{model_path.stem}_classes.json"):
        candidate = model_path.parent / name
        if candidate.exists():
            with open(candidate) as f:
                data = json.load(f)
            if isinstance(data, dict):
                return [data[str(i)] for i in range(len(data))]
            return data
    log.warning(
        f"No class_indices.json found for '{crop}' next to {model_path.name} — "
        f"using FALLBACK_CLASSES from class_names.py. Double check these are "
        f"correct, especially for chilli, before the demo!"
    )
    return FALLBACK_CLASSES[crop]


def try_load_model(path, num_classes):
    """Try TorchScript first (self-contained — works regardless of which
    architecture was used). If that fails, fall back to loading a raw
    state_dict against each known architecture until one matches."""
    try:
        model = torch.jit.load(str(path), map_location=device)
        model.eval()
        return model, "torchscript"
    except Exception:
        pass

    raw = torch.load(str(path), map_location=device)
    state_dict = raw.get("state_dict", raw) if isinstance(raw, dict) else raw

    for arch_name, builder in ARCH_BUILDERS.items():
        try:
            model = builder(num_classes)
            model.load_state_dict(state_dict)
            model.eval()
            model.to(device)
            return model, arch_name
        except Exception:
            continue

    raise RuntimeError(
        f"Could not load '{path.name}' as TorchScript or as a resnet18/"
        f"mobilenet_v2 state_dict. Open it in a Python shell yourself: "
        f"`torch.load('{path}')` and check what type comes back."
    )


def get_model(crop):
    if crop in _loaded:
        return _loaded[crop]

    model_path = find_model_file(crop)
    if model_path is None:
        raise HTTPException(
            status_code=500,
            detail=f"No model file found for '{crop}' in {MODELS_DIR}. "
                   f"Drop it in as '{crop}.pt' (e.g. groundnut.pt) and restart the service.",
        )

    class_names = load_class_names(crop, model_path)
    model, fmt = try_load_model(model_path, len(class_names))
    log.info(f"Loaded {crop} model from {model_path.name} as {fmt} ({len(class_names)} classes)")
    _loaded[crop] = (model, class_names, fmt)
    return _loaded[crop]


@app.get("/health")
def health():
    return {"status": "ok", "device": str(device)}


@app.post("/predict")
async def predict(crop: str = Form(...), image: UploadFile = File(...)):
    crop = crop.strip().lower()
    if crop not in CROPS:
        raise HTTPException(status_code=400, detail=f"crop must be one of {CROPS}")

    model, class_names, fmt = get_model(crop)

    try:
        img_bytes = await image.read()
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Uploaded file is not a readable image.")

    tensor = transform(img).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(tensor)
        probs = F.softmax(outputs, dim=1)[0]
        conf, idx = torch.max(probs, dim=0)

    idx = idx.item()
    confidence = round(conf.item(), 4)
    predicted_class = class_names[idx] if idx < len(class_names) else f"class_{idx}"

    return {
        "crop": crop,
        "predicted_class": predicted_class,
        "confidence": confidence,
        "confident": confidence >= CONFIDENCE_THRESHOLD,
        "model_format_detected": fmt,
    }
