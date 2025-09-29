from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os
import traceback
import json

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ✅ Load model
MODEL_PATH = os.path.join("model", "trained_model.h5")
print(f"🔄 Loading model from {MODEL_PATH}")
model = load_model(MODEL_PATH)
print("✅ Model loaded successfully.")
print("📐 Model input shape:", model.input_shape)

# ✅ Load class names
CLASS_NAMES_PATH = os.path.join("model", "class_names.json")
with open(CLASS_NAMES_PATH, "r") as f:
    class_names = json.load(f)
print(f"✅ Loaded class names: {len(class_names)} classes")

# ✅ Load disease info
DISEASE_INFO_PATH = os.path.join("model", "disease_info.json")
with open(DISEASE_INFO_PATH, "r") as f:
    disease_info = json.load(f)
print(f"✅ Loaded disease info for {len(disease_info)} diseases")

# 🔄 Image Preprocessing
def prepare_image(file_path):
    img = image.load_img(file_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0
    return img_array

# 🔍 Prediction Endpoint
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({
            "error": True,
            "message": "No file uploaded",
            "prediction": None
        }), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({
            "error": True,
            "message": "Empty filename",
            "prediction": None
        }), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    print(f"📥 File saved to {file_path}")

    try:
        img = prepare_image(file_path)
        print("✅ Image preprocessed")

        predictions = model.predict(img)[0]
        class_id = int(np.argmax(predictions))
        confidence = float(np.max(predictions))

        predicted_class = class_names[class_id]
        print(f"🎯 Predicted: {predicted_class} ({confidence*100:.2f}%)")

        disease_details = disease_info.get(predicted_class, {})
        print(f"🩺 Disease info: {bool(disease_details)}")

        return jsonify({
            "prediction": predicted_class,
            "confidence": round(confidence * 100, 2),
            "treatment": disease_details.get("treatment", []),
            "firstAid": disease_details.get("firstAid", []),
            "prevention": disease_details.get("prevention", [])
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "error": True,
            "message": "Prediction failed",
            "prediction": None
        }), 500

    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"🗑️ Removed uploaded file: {file_path}")


# 🟢 Start Server (Render requires host=0.0.0.0, port=$PORT)
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=True)
