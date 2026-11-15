"""
ANTHARIKSH – Python Flask REST API Backend (Drop-in Reference Implementation)
Provides the identical REST contract consumed by src/services/api.ts when
setting VITE_API_BASE_URL=http://localhost:5000.
"""

import os
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

LOCATIONS_INDEX = [
    {"id": "hyderabad", "name": "Hyderabad", "region": "Telangana Plateau", "country": "India", "lat": 17.3850, "lng": 78.4867},
    {"id": "bengaluru", "name": "Bengaluru", "region": "Karnataka", "country": "India", "lat": 12.9716, "lng": 77.5946},
    {"id": "godavari", "name": "Godavari Basin", "region": "Andhra Pradesh", "country": "India", "lat": 16.7500, "lng": 81.8200},
    {"id": "western-ghats", "name": "Western Ghats", "region": "Karnataka / Kerala", "country": "India", "lat": 13.4500, "lng": 75.3500},
    {"id": "sundarbans", "name": "Sundarbans Delta", "region": "West Bengal", "country": "India", "lat": 21.9500, "lng": 88.8800},
    {"id": "mumbai", "name": "Mumbai Coastline", "region": "Maharashtra", "country": "India", "lat": 19.0760, "lng": 72.8777},
]


@app.get("/api/health")
def health():
    return jsonify({
        "status": "online",
        "service": "ANTHARIKSH Flask API",
        "geminiConfigured": bool(os.getenv("GEMINI_API_KEY")),
    })


@app.get("/api/locations")
def get_locations():
    q = request.args.get("q", "").strip().lower()
    if not q:
        return jsonify({"locations": LOCATIONS_INDEX})
    filtered = [
        loc for loc in LOCATIONS_INDEX
        if q in loc["name"].lower() or q in loc["region"].lower()
    ]
    return jsonify({"locations": filtered})


@app.post("/api/sar/analyze")
def analyze_sar():
    payload = request.get_json(silent=True) or {}
    region_id = payload.get("regionId", "india")
    date_range = payload.get("dateRange", "Last 6 Months")
    dataset = payload.get("dataset", "NISAR L-Band Calibration Model (VV/VH)")
    tool = payload.get("tool", "backscatter")

    region_names = {
        "india": "India",
        "godavari": "Godavari Basin",
        "sundarbans": "Sundarbans Delta",
        "western-ghats": "Western Ghats",
        "mumbai": "Mumbai Coastline",
        "bengaluru": "Bengaluru Corridor",
    }
    region_name = region_names.get(region_id, "India")

    return jsonify({
        "regionId": region_id,
        "regionName": region_name,
        "dataset": dataset,
        "dateRange": date_range,
        "tool": tool,
        "isDemonstrationModel": True,
        "sourceNotice": "Reference Demonstration Model — calibrated radar simulation values; not live operational NISAR telemetry.",
        "meanBackscatterDb": -11.4,
        "coherenceScore": 0.78,
        "affectedAreaKm2": 264.8,
        "peakDisplacementMm": 4.2,
        "interpretationTitle": f"SAR {tool.title()} Calibration — {region_name}",
        "interpretationBody": f"Python Flask calibration pipeline evaluated {region_name} across {date_range}.",
        "physicalBasis": "L-band (~24 cm) radar penetrates light vegetation canopies and isolates specular calm water surfaces.",
        "series": [
            {"band": "Urban Grid", "vvDb": -4.2, "vhDb": -11.5, "coherence": 0.91},
            {"band": "Dense Canopy", "vvDb": -9.6, "vhDb": -14.8, "coherence": 0.58},
            {"band": "Cropland", "vvDb": -12.4, "vhDb": -18.2, "coherence": 0.67},
            {"band": "Wet Soil", "vvDb": -14.1, "vhDb": -20.6, "coherence": 0.52},
            {"band": "Calm Water", "vvDb": -21.8, "vhDb": -27.4, "coherence": 0.24},
        ],
    })


@app.post("/api/ai/scientist")
def ai_scientist():
    payload = request.get_json(silent=True) or {}
    question = payload.get("question", "").strip()
    region_name = payload.get("regionName", "Western Ghats Canopy")
    if not question:
        return jsonify({"error": "Question is required."}), 400

    return jsonify({
        "mode": "demonstration",
        "answer": (
            f"Reference Earth observation note for {region_name}: SAR L-band backscatter "
            "and optical indices are combined to assess canopy health, flood extent, and surface change."
        ),
        "observations": [
            f"Active context: {region_name}",
            "Specular low-backscatter signatures delineate open water beneath cloud cover",
            "Demonstration Mode active in Flask reference backend",
        ],
        "datasetCitation": "ANTHARIKSH Flask Reference Service",
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)), debug=True)
