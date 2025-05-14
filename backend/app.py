from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
import os
import bcrypt
from datetime import datetime

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

@app.route('/submit', methods=['POST'])
def submit_report():
    data = request.json
    submitted_by = data.get('submitted_by')
    org_id = data.get('organization_id')

    # Verify user belongs to org
    if submitted_by:
        user = db.users.find_one({"_id": ObjectId(submitted_by)})
        if not user or str(user['organization_id']) != org_id:
            return jsonify({"error": "User not in organization"}), 403

    report = {
        "content": data['content'],
        "submitted_by": ObjectId(submitted_by) if submitted_by else None,
        "organization_id": ObjectId(org_id)
    }
    result = db.reports.insert_one(report)
    return jsonify({"report_id": str(result.inserted_id)})

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


# ---------- Run App ----------
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
