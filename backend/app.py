from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
import os
import bcrypt
from datetime import datetime
import requests

load_dotenv()

# Setup Flask app
app = Flask(__name__)
CORS(app)

# Connect to MongoDB Atlas
client = MongoClient(os.getenv("MONGO_URI"))
db = client['clearwhistle']    # Database name

# ---------- Utility Functions ----------

def hash_password(password):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt())

def verify_password(password, hashed):
    return bcrypt.checkpw(password.encode(), hashed)

def serialize_id(doc):
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc

# ---------- Routes ----------

@app.route('/')
def home():
    return jsonify({"message": "ClearWhistle backend is running with MongoDB Atlas!"})

@app.route('/admin/create-org', methods=['POST'])
def create_org():
    name = request.json.get('name')
    if db.organizations.find_one({'name': name}):
        return jsonify({"error": "Organization already exists"}), 400
    org = {"name": name}
    result = db.organizations.insert_one(org)
    return jsonify({"org_id": str(result.inserted_id)})

@app.route('/admin/create-user', methods=['POST'])
def create_user():
    data = request.json
    if not all(k in data for k in ("email", "password", "is_admin", "organization_name")):
        return jsonify({"error": "Missing required fields"}), 400

    if db.users.find_one({'email': data['email']}):
        return jsonify({"error": "User already exists"}), 400

    # 🔍 Lookup org by name
    org = db.organizations.find_one({"name": data["organization_name"]})
    if not org:
        return jsonify({"error": "Organization not found"}), 404

    hashed_pw = hash_password(data['password'])
    user = {
        "email": data['email'],
        "password_hash": hashed_pw,
        "is_admin": data['is_admin'],
        "organization_id": org['_id']
    }

    result = db.users.insert_one(user)
    return jsonify({"user_id": str(result.inserted_id)})


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = db.users.find_one({'email': data['email']})
    if not user or not verify_password(data['password'], user['password_hash']):
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({
        "message": "Login successful",
        "user_id": str(user['_id']),
        "organization_id": str(user['organization_id']),
        "is_admin": user['is_admin']
    })



@app.route('/admin/org-users/<org_id>', methods=['GET'])
def list_users(org_id):
    users = db.users.find({"organization_id": ObjectId(org_id)})
    result = []
    for user in users:
        result.append({
            "id": str(user["_id"]),
            "email": user["email"],
            "is_admin": user["is_admin"]
        })
    return jsonify(result)


@app.route('/apply-admin', methods=['POST'])
def apply_admin():
    data = request.json
    if not data.get("email") or not data.get("password") or not data.get("organization"):
        return jsonify({"error": "Missing required fields"}), 400

    if db.pending_admins.find_one({"email": data["email"]}):
        return jsonify({"error": "Application with this email already exists"}), 400

    new_application = {
        "email": data["email"],
        "password_hash": hash_password(data["password"]),
        "organization_name": data["organization"],
        "status": "pending",
        "created_at": datetime.utcnow()
    }

    db.pending_admins.insert_one(new_application)
    return jsonify({"message": "Application received"})

@app.route('/admin/pending-applications', methods=['GET'])
def list_pending_admins():
    pending = db.pending_admins.find({"status": "pending"})
    return jsonify([
        {
            "id": str(app["_id"]),
            "email": app["email"],
            "organization_name": app["organization_name"],
            "created_at": app["created_at"]
        }
        for app in pending
    ])


PINATA_API_KEY = os.getenv("PINATA_API_KEY")
PINATA_SECRET_API_KEY = os.getenv("PINATA_SECRET_API_KEY")

def upload_to_pinata(content: dict):
    headers = {
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_SECRET_API_KEY,
        "Content-Type": "application/json"
    }

    payload = {
        "pinataContent": content
    }

    res = requests.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", json=payload, headers=headers)
    if res.status_code != 200:
        raise Exception("Pinata upload failed: " + res.text)

    return res.json()["IpfsHash"]

from datetime import datetime
from flask import request, jsonify
from bson import ObjectId

@app.route('/submit', methods=['POST'])
def submit_report():
    data = request.json
    text = data.get("report_text")

    if not text:
        return jsonify({"error": "Missing report text"}), 400

    try:
        ipfs_hash = upload_to_pinata({
            "text": text,
            "timestamp": datetime.utcnow().isoformat()
        })

        report = {
            "content": ipfs_hash,
            "timestamp": datetime.utcnow()
        }

        db.reports.insert_one(report)

        return jsonify({"message": "Report submitted", "ipfs_hash": ipfs_hash})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/store-hash', methods=['POST'])
def store_hash():
    data = request.json
    ipfs_hash = data.get("ipfs_hash")

    if not ipfs_hash:
        return jsonify({"error": "Missing IPFS hash"}), 400

    try:
        db.reports.insert_one({
            "content": ipfs_hash,
            "timestamp": datetime.utcnow()
        })
        return jsonify({"message": "Hash stored in MongoDB"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/admin/reports', methods=['GET'])
def list_all_reports():
    reports = db.reports.find().sort("timestamp", -1)
    return jsonify([
        {
            "_id": str(r["_id"]),
            "content": r["content"],  # IPFS hash
            "timestamp": r["timestamp"]
        }
        for r in reports
    ])
@app.route('/report/<report_id>', methods=['GET'])
def get_report_by_id(report_id):
    try:
        report = db.reports.find_one({"_id": ObjectId(report_id)})
        if not report:
            return jsonify({"error": "Report not found"}), 404
        return jsonify({
            "content": report["content"],
            "timestamp": report["timestamp"]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/submit_org', methods=['POST'])
def submit_report_with_org():
    data = request.json
    text = data.get("report_text")
    org_name = data.get("organization_name")

    if not text or not org_name:
        return jsonify({"error": "Missing report or organization"}), 400

    try:
        ipfs_hash = upload_to_pinata({
            "text": text,
            "organization": org_name,
            "timestamp": datetime.utcnow().isoformat()
        })

        report = {
            "content": ipfs_hash,
            "organization_name": org_name,
            "timestamp": datetime.utcnow()
        }

        db.reports.insert_one(report)

        return jsonify({"message": "Report submitted with organization", "ipfs_hash": ipfs_hash})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------- Run App ----------
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
