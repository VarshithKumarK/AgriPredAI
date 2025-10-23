# ML/app/main_api.py

from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
import tensorflow as tf
import json
import os
from io import BytesIO
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow requests from frontend

# Load model and class indices once
working_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(working_dir, "trained_model", "plant_disease_prediction_model.h5")
class_indices_path = os.path.join(working_dir, "trained_model", "class_indices.json")

model = tf.keras.models.load_model(model_path)
class_indices = json.load(open(class_indices_path))


def preprocess_image(image_bytes, target_size=(224, 224)):
    img = Image.open(BytesIO(image_bytes)).convert("RGB")
    img = img.resize(target_size)
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array.astype("float32") / 255.0
    return img_array


@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]
    image_bytes = file.read()
    img = preprocess_image(image_bytes)

    preds = model.predict(img)
    predicted_idx = np.argmax(preds, axis=1)[0]
    predicted_label = class_indices[str(predicted_idx)]

    return jsonify({"prediction": predicted_label})


if __name__ == "__main__":
    # Run Flask app
    app.run(host="0.0.0.0", port=5000, debug=True)
