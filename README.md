# TEAM BAITBUSTERS

## 👥 Team Members
- Fadeyi David  
- Ndujekwu Ugochukwu  
- Adelaja Oluwasemilore  
- Sadiq Adetola

---

## 🚀 Demos & Docs

* **Mobile App (APK / Play Link):**   
* **SMS Gateway:**    
* **Recorded Demo:**   

---

## 🎯 The Problem

Mobile money has revolutionized financial inclusion across Africa, with over 600 million users conducting $1.4 trillion in annual transactions.  
However, sophisticated phishing attacks exploit local languages, cultural cues, and trust dynamics to deceive users.  

Traditional cybersecurity solutions fail because they:
- Lack understanding of African languages and cultural nuances  
- Require strong devices or consistent internet connectivity  
- Often depend on centralized storage, raising privacy concerns  

This leaves millions vulnerable — particularly rural and elderly users — to phishing scams that steal critical information and wipe out months of income.

---

## ✨ Our Solution: **BaitBusters**

**BaitBusters** is a hybrid, AI-powered mobile security system designed to detect phishing messages across SMS, notifications, and messaging platforms — optimized for Africa’s mobile-first and low-connectivity environments.

### 🧠 How It Works
1. The **mobile app** runs a **local AI model** that listens to incoming SMS and notifications in real time.  
2. For every new message, the local model decides one of three outcomes:
   - **Sure-Phish:** confidently malicious → immediate user alert  
   - **Sure-Safe:** confidently safe → silently ignored  
   - **Unsure:** uncertain → requests user consent for verification
3. When **unsure**, the app prompts the user to manually send the message to our **SMS Gateway** (consent-first approach; *no automatic sending*).  
4. The **SMS Gateway** receives the message, forwards it to our **FastAPI AI backend**, and then receives a verdict.
5. The gateway sends the verdict back to the user’s app via SMS.  
6. The app parses that response, updates the UI, and alerts the user accordingly.

### ⚙️ Why This Design?
- **Ethical by Design:** user consent before message forwarding; no silent data transmission.  
- **Privacy-Preserving:** messages are not stored; no database or persistent storage.  
- **Lightweight:** runs effectively on basic Android devices with 1–2GB RAM.  
- **Offline Ready:** local detection works even without internet access.  

### 🔒 Key Features
- Instant alerts for confirmed phishing attempts  
- Explainable verdicts from backend model (educational for users)  
- Notification-level scanning to catch spoofing and impersonation attempts  
- Culturally aware model trained to understand local linguistic cues  

---

## 🛠️ Tech Stack

| Component | Technology |
|------------|-------------|
| **Mobile App** | React Native + Native Modules (Java/Kotlin) |
| **SMS Gateway** | React Native / Native Android service |
| **Backend (AI Model)** | FastAPI (Python) |
| **Database / Storage** | None (ephemeral processing only) |
| **Deployment** | Render (for AI backend) |

---

## ⚙️ Setup & Installation

### 📱 Mobile App / SMS Gateway
```bash
# Clone the repository
git clone 

# Navigate into the project folder
cd [project-directory]

# Install dependencies
npm install

# Start Metro bundler (optional)
npx react-native start --reset-cache

# Run on an Android device or emulator
npx react-native run-android
````

### 🧠 Backend / AI Model

```bash
# Create and activate a virtual environment (recommended)
python -m venv venv
source venv/bin/activate    # macOS/Linux
# .\venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
# Open docs at http://localhost:8000/docs
```

---

## ⚖️ Ethics & Privacy

* **No automatic forwarding:** user must explicitly approve before any data is sent.
* **No data storage:** messages are analyzed in-memory and immediately discarded.
* **Transparency:** backend verdicts are shared with explanations to educate users.
* **User-first:** full control, privacy, and consent at every step.

---

## 💡 TL;DR

**BaitBusters** is an AI-powered mobile app that detects and blocks phishing attacks across SMS and notifications.
It runs locally on users’ devices, alerts them instantly when danger is detected, and uses an opt-in SMS gateway + backend AI model to verify uncertain messages — all while maintaining strict privacy and ethical standards.

---

## 🧩 Architecture Overview

```
Incoming Message / Notification
           │
           ▼
 ┌────────────────────┐
 │ Local Model (App)  │
 │  - Sure-Phish → Alert User
 │  - Sure-Safe → Ignore
 │  - Unsure → Ask Consent
 └────────────────────┘
           │
           ▼
  (User sends to Gateway)
           │
           ▼
 ┌────────────────────┐
 │ SMS Gateway        │
 │  - Forwards to API │
 │  - Receives Verdict│
 │  - Sends SMS Reply │
 └────────────────────┘
           │
           ▼
 ┌────────────────────┐
 │ Backend (FastAPI)  │
 │  - AI Inference    │
 │  - Returns Verdict │
 └────────────────────┘
           │
           ▼
     App Receives Verdict → Display Result
```

---


