# changeup/app.py
from flask import Flask, render_template, request, jsonify
import pandas as pd, joblib, logging, pathlib

ROOT = pathlib.Path(__file__).parent
MODEL_PATH = ROOT / "model.joblib"

app = Flask(__name__)

# ──────────────────────────────────────────────────────────────────
# Load model once at start-up
# ──────────────────────────────────────────────────────────────────
try:
    model = joblib.load(MODEL_PATH)
except Exception:
    logging.exception("❌  Could not load model.joblib")
    raise

# Exact column order the model was trained on
EXPECTED_COLS = list(model.feature_names_in_)

# ──────────────────────────────────────────────────────────────────
# Routes
# ──────────────────────────────────────────────────────────────────
@app.get("/")
def index():
    return render_template("index.html")


@app.post("/predict")
def predict():
    """
    Returns
        { "prediction": <float> }           # probability of class 1
    or  { "error": "<message>" }            # with 4xx / 5xx code
    """
    payload = request.get_json(silent=True)
    if payload is None:
        return jsonify(error="Request body must be JSON"), 400

    # 1 · Build DataFrame in the expected column order
    try:
        X = pd.DataFrame([payload])[EXPECTED_COLS]
    except KeyError as missing:
        return jsonify(error=f"Missing or mis-named field(s): {missing}"), 400

    # 2 · Predict probability of the positive class (index 1)
    try:
        if hasattr(model, "predict_proba"):
            prob = float(model.predict_proba(X)[0, 1])     # 0-1 range
            return jsonify(prediction=prob)
        else:
            pred = float(model.predict(X)[0])              # fallback
            return jsonify(prediction=pred)
    except Exception as exc:
        logging.exception("Model prediction failed")
        return jsonify(error=str(exc)), 500


if __name__ == "__main__":
    # Debug=True is fine for local dev; switch off in prod
    app.run(host="0.0.0.0", port=5000, debug=True)
