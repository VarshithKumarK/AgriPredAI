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
model_path = os.path.join(
    working_dir, "trained_model", "plant_disease_prediction_model.h5"
)
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


import requests


def get_cure_from_ollama(disease_name):
    """
    Queries Ollama (Llama3) to get a cure, symptoms, and prevention tips for the given disease.
    """
    if "healthy" in disease_name.lower():
        return {
            "symptoms": "None",
            "cure": "Your plant looks healthy! Keep up the good work.",
            "prevention": "Continue regular care.",
        }

    prompt = f"""
    The plant disease is '{disease_name}'. 
    Provide a JSON response with exactly these keys:
    1. 'symptoms': brief list of symptoms
    2. 'cure': step-by-step simple treatment
    3. 'prevention': how to prevent it next time
    
    Keep the advice simple and actionable for a farmer.
    Ensure the output is valid JSON.
    """

    try:
        # Calling local Ollama instance
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3.2",
                "prompt": prompt,
                "stream": False,
                "format": "json",
            },
            timeout=30,
        )  # Add timeout to prevent hanging forever

        if response.status_code == 200:
            return response.json().get("response", {})
        else:
            print(f"Ollama Error: {response.status_code} - {response.text}")
            return "Could not fetch AI cure. AI service might be down."

    except Exception as e:
        print(f"Exception calling Ollama: {e}")
        return "Could not fetch AI cure. Please consult an expert."


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

    # NEW: Get AI Cure from Ollama
    # Note: This might block for a few seconds. For production, use async or background tasks.
    cure_info = get_cure_from_ollama(predicted_label)

    # If Ollama returns a JSON string, we might need to parse it if it wasn't parsed strictly by requests
    # But get_cure_from_ollama returns the 'response' field, which is a string stringified JSON if format='json' is used?
    # Actually, Ollama with format='json' returns a string in 'response' which IS the JSON object.
    # We should try to parse it into a dict if it is a string, so frontend gets a proper object.

    if isinstance(cure_info, str):
        try:
            cure_info = json.loads(cure_info)
        except:
            pass  # Keep as string if parsing fails

    return jsonify({"prediction": predicted_label, "cure_info": cure_info})


@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        # Construct a better prompt with system context
        full_prompt = f"""
        System: You are a helpful expert agricultural assistant. Provide clear, accurate advice about crops, diseases, and farming. 
        User: {user_message}
        """

        response = requests.post(
            "http://localhost:11434/api/generate",
            json={"model": "llama3.2", "prompt": full_prompt, "stream": False},
            timeout=60,
        )

        if response.status_code == 200:
            return jsonify({"response": response.json().get("response", "")})
        else:
            return jsonify({"error": "Ollama error"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    # Run Flask app
    app.run(host="0.0.0.0", port=8000, debug=True)
