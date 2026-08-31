from flask import Flask, request, jsonify, send_from_directory
import os
import uuid

from utils.model_loader import load_hybrid_models
from utils.inference import predict_image

# Custom env variable loader
def load_env():
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                parts = line.split("=", 1)
                if len(parts) == 2:
                    key = parts[0].strip()
                    val = parts[1].strip()
                    if val.startswith('"') and val.endswith('"'):
                        val = val[1:-1]
                    elif val.startswith("'") and val.endswith("'"):
                        val = val[1:-1]
                    os.environ[key] = val

load_env()

# Database imports
from database import (
    init_db,
    create_user,
    get_user_by_email,
    create_session,
    delete_session,
    get_user_by_token,
    add_credits,
    deduct_credits
)
from werkzeug.security import generate_password_hash, check_password_hash
from mailer import send_contact_email

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize Database
print("Initializing SQLite database...")
init_db()
print("Database initialized.")

print("Loading hybrid ensemble models (CNN + EfficientNet-B0 + ViT-Base)...")
models, ensemble_weights = load_hybrid_models()
print("Hybrid ensemble loaded:", ensemble_weights)

# CORS Handling and Preflight Options
@app.before_request
def before_request():
    if request.method == "OPTIONS":
        return app.make_response("")

@app.after_request
def after_request(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization,X-Session-Token'
    response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
    return response

# Get current logged in user from headers
def get_current_user():
    auth_header = request.headers.get("Authorization") or request.headers.get("X-Session-Token")
    if not auth_header:
        return None
    
    token = auth_header
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
    
    return get_user_by_token(token)

@app.route("/")
def home():
    return "Tea Disease Hybrid Ensemble API Running (CNN + EfficientNet-B0 + ViT-Base)"


@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# --- Authentication Routes ---

@app.route("/api/register", methods=["POST"])
def register():
    data = request.json or {}
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
        
    if "@" not in email or "." not in email:
        return jsonify({"error": "Please enter a valid email address"}), 400
        
    password_hash = generate_password_hash(password)
    user_id = create_user(email, password_hash)
    if not user_id:
        return jsonify({"error": "This email address is already registered"}), 400
        
    # Auto-login after registration
    token = uuid.uuid4().hex
    create_session(user_id, token)
    
    return jsonify({
        "message": "User registered successfully",
        "token": token,
        "user": {
            "email": email,
            "credits": 100
        }
    }), 201

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json or {}
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
        
    user = get_user_by_email(email)
    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Invalid email or password"}), 401
        
    token = uuid.uuid4().hex
    create_session(user["id"], token)
    
    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {
            "email": user["email"],
            "credits": user["credits"]
        }
    }), 200

@app.route("/api/logout", methods=["POST"])
def logout():
    auth_header = request.headers.get("Authorization") or request.headers.get("X-Session-Token")
    if auth_header:
        token = auth_header
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
        delete_session(token)
    return jsonify({"message": "Logout successful"}), 200

@app.route("/api/user/profile", methods=["GET"])
def profile():
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized. Access Denied."}), 401
    return jsonify({
        "email": user["email"],
        "credits": user["credits"]
    }), 200

# --- Credits Management ---

@app.route("/api/user/add-credits", methods=["POST"])
def purchase_credits():
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized. Access Denied."}), 401
        
    data = request.json or {}
    credits_to_add = data.get("credits")
    if not credits_to_add or credits_to_add not in [100, 1000, 10000]:
        return jsonify({"error": "Invalid credit package. Select 100, 1000, or 10000."}), 400
        
    new_credits = add_credits(user["id"], credits_to_add, f"Purchased {credits_to_add} credit package")
    
    return jsonify({
        "message": f"Successfully activated {credits_to_add} credits!",
        "credits": new_credits
    }), 200

# --- Contact Form ---

@app.route("/api/contact", methods=["POST"])
def contact():
    data = request.json or {}
    name = data.get("name")
    email = data.get("email")
    estate = data.get("estate", "")
    message = data.get("message")
    
    if not name or not email or not message:
        return jsonify({"error": "Name, email, and message are required"}), 400
        
    success, info = send_contact_email(name, email, estate, message)
    if success:
        return jsonify({"message": "Message sent successfully!", "info": info}), 200
    else:
        return jsonify({"error": f"Email gateway issues: {info}."}), 500

# --- Diagnostics Inference (Authenticated & Credits-aware) ---

@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    if request.method == "OPTIONS":
        return "", 200
        
    # Require authorization for prediction
    user = get_current_user()
    if not user:
        return jsonify({"error": "Authentication required. Please sign in to run diagnostics."}), 401
        
    if user["credits"] < 20:
        return jsonify({
            "error": "Insufficient credits. Leaf analysis requires 20 credits, but your balance is {} credits.".format(user["credits"]),
            "credits": user["credits"]
        }), 403
        
    # Save file
    uploaded_file = request.files.get("file") or request.files.get("image")

    if uploaded_file is None:
        return jsonify({"error": "No file uploaded. Use key 'file' or 'image'."}), 400

    if uploaded_file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    # Deduct 20 credits
    success, new_credits = deduct_credits(user["id"], 20, "Leaf disease analysis deduction")
    if not success:
         return jsonify({
            "error": "Insufficient credits. Deduction failed.",
            "credits": new_credits
        }), 403

    file_ext = os.path.splitext(uploaded_file.filename)[1]
    unique_name = f"{uuid.uuid4()}{file_ext}"

    file_path = os.path.join(UPLOAD_FOLDER, unique_name)
    uploaded_file.save(file_path)

    result = predict_image(
        models,
        file_path,
        upload_folder=UPLOAD_FOLDER,
        base_url=request.host_url,
        ensemble_weights=ensemble_weights,
    )

    result["credits"] = new_credits

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)