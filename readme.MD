# 🛡️ ClearWhistle

> **A decentralized, anonymous reporting platform for workplace and school abuse.**

ClearWhistle empowers whistleblowers to safely report misconduct without fear of retaliation. By using IPFS and zero-knowledge proofs, we provide privacy, transparency, and immutability — all in a clean, user-friendly interface.

---

## 🧠 Inspiration

Whistleblowers often hesitate to come forward due to the risk of exposure, especially in corporate and school environments:

- In companies, intranet systems can track who filed an internal report.
- In schools, students fear retaliation from bullies or even corrupt teachers.

We created ClearWhistle to protect these vulnerable voices through decentralized, trustless technology.

---

## 🚀 What It Does

ClearWhistle enables anonymous submission and secure storage of whistleblower reports:

- 📝 Users submit reports via a web form.
- 📦 The report is uploaded to **IPFS** using **Pinata**.
- 🧾 An **IPFS hash** is returned as a permanent reference.
- 🕵️‍♀️ Admins can view or download reports from IPFS — without access to reporter identity.

Optional features include **zero-knowledge proof (ZK) verification** to validate organizational affiliation without deanonymization.

---

## 🛠️ Tech Stack

### 🧩 Frontend
- **Next.js 14** with App Router
- **Tailwind CSS** for styling
- **ShadCN/UI** for clean components

### 🔧 Backend
- **Flask** REST API
- **MongoDB Atlas** for storing report metadata
- **Pinata** for uploading JSON to IPFS

### 🌐 Web3 Integration
- **IPFS** for decentralized storage
- *(Optional)* ZK Identity (e.g., Semaphore)

---

## 🔒 Privacy & Security

- No account or login required for submission
- Reports are stored on IPFS — no centralized control
- IPFS hash can be used to verify authenticity of reports
- Optional: Add ZK login for authenticated but anonymous users

---

## 📸 Screenshots

| User Submission | Admin Dashboard |
|------------------|------------------|
| ![Submit Report](./screenshots/submit-report.png) | ![Admin Dashboard](./screenshots/admin-dashboard.png) |

---

## 🚦 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/hlee18lee46/clearwhistle.git
cd clearwhistle

cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create a .env file
touch .env

MONGO_URI=mongodb+srv://...
PINATA_API_KEY=...
PINATA_SECRET_API_KEY=...

python app.py

3. Setup Frontend (Next.js)

cd ../frontend
npm install
npm run dev
