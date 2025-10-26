# 🛡️ TEAM BAITBUSTERS

## 👥 Team Members
- Fadeyi David  
- Ndujekwu Ugochukwu  
- Adelaja Oluwasemilore  
- Sadiq Adetola

---

## 🚀 Demos & Docs

* **Mobile App (APK / Play Link):** [First version v1.0.0](https://github.com/ndujesco/baitbusters/releases/download/v1.0.0/app-release.apk) 
* **SMS Gateway:**[First Version v1.0.0](https://github.com/ndujesco/baitbusters/releases/download/v1.0.0/gateway.apk)    
* **Recorded Demo:**   

---

## 🎯 The Problem

Mobile money has revolutionized financial inclusion across Africa, with over 600 million users conducting $1.4 trillion in annual transactions.  
However, sophisticated phishing attacks exploit local languages, cultural cues, and trust dynamics to deceive users.

Traditional cybersecurity solutions fail because they:
- Lack understanding of African languages and cultural nuances  
- Require strong devices or consistent internet connectivity  
- Depend on centralized storage, raising privacy concerns  

This leaves millions vulnerable — particularly rural and elderly users — to phishing scams that steal critical information and wipe out months of income.

---

## ✨ Our Solution: **Aegis**

**Aegis** is a hybrid, AI-powered mobile security system that detects phishing messages across SMS, notifications, and messaging platforms — optimized for Africa’s mobile-first and low-connectivity environments.

### 🧠 How It Works
1. The **mobile app** runs a **local AI model** that listens to incoming SMS and notifications in real time.  
2. For every new message, the local model decides one of three outcomes:
   - **Sure-Phish:** confidently malicious → immediate user alert  
   - **Sure-Safe:** confidently safe → silently ignored  
   - **Unsure:** uncertain → automatically sent to the **SMS Gateway** for verification  
3. The **SMS Gateway** receives the message, forwards it to our **FastAPI AI backend**, and then receives a verdict.  
4. The gateway sends the verdict back to the user’s app via SMS.  
5. The app parses that response, updates the UI, and alerts the user accordingly.

---

## 🌍 Multilingual Intelligence

Users can interact with the app — and the AI can detect phishing — in the following languages:

```ts
export type LangKey = 'english' | 'french' | 'hausa' | 'yoruba' | 'swahili' | 'amharic' | 'igbo';
```

## ⚙️ Why This Design?

- **Automatic Verification:** suspicious messages are forwarded automatically — no user action needed.  
- **Offline Payment Support:** DCB ensures users can subscribe without internet.  
- **Privacy-Preserving:** messages are analyzed in-memory and never stored.  
- **Lightweight:** runs smoothly on low-end Android devices (1–2 GB RAM).  
- **Offline Ready:** local detection works even without internet access.  
- **Culturally Aware:** understands and flags phishing attempts in African languages.  

## 🔒 Key Features

- Real-time phishing detection and instant alerts  
- Explainable verdicts from backend model (educational for users)  
- Multilingual support for African users  
- Notification-level scanning for spoofing and impersonation  
- **Offline DCB-based payment system** for seamless access  
- Ethical AI that prioritizes privacy and transparency  

---

## 🛠️ Tech Stack

| Component | Technology |
|------------|-------------|
| **Mobile App** | React Native + Native Modules (Java/Kotlin) |
| **SMS Gateway** | React Native / Native Android service |
| **Backend (AI Model)** | FastAPI (Python) |
| **Database / Storage** | Offline Direct Carrier Billing (DCB) |
| **Payment System** | Render (for AI backend) |

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

To build a release APK
```bash
cd android
./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

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

* **Automatic but Anonymous:** messages are forwarded automatically for uncertain detections, but never stored or linked to personal data.
* **No Persistent Storage:** all processing is in-memory and ephemeral.all processing is in-memory and ephemeral.
* **Offline Accessibility:** DCB-based payments and local inference empower users without data or smartphones.
* **User-first:** full control, privacy, and consent at every step.

---

## 💡 TL;DR

**Aegis** is an AI-powered mobile app that detects and blocks phishing attacks across SMS and notifications.
It runs locally on users’ devices, automatically verifies uncertain messages via an SMS gateway + backend AI model, and integrates an **offline DCB payment system** to enable easy access to premium protection — all while maintaining strict privacy and ethical standards.
It’s multilingual, lightweight, and built for Africa’s mobile-first world.

---

## 🧩 Architecture Overview

```pgsql
Incoming Message / Notification
           │
           ▼
 ┌────────────────────┐
 │ Local Model (App)  │
 │  - Sure-Phish → Alert User
 │  - Sure-Safe → Ignore
 │  - Unsure → Auto-forward to Gateway
 └────────────────────┘
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
           │
           ▼
 ┌────────────────────┐
 │ Offline DCB System │
 │  - Handles Payment │
 │  - No Internet Req │
 └────────────────────┘

```



