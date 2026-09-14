# 🧬 PharmaBrain

> **AI-Assisted Patient-Centric Digital Medical Record and Longitudinal Health History Analysis System**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.2-646cff.svg?logo=vite)
![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini_2.5-4285F4.svg?logo=google)

---

## 📌 Executive Summary

**PharmaBrain** is an **AI-Assisted Patient-Centric Digital Medical Record and Longitudinal Health History Analysis System** designed to empower patients to aggregate, understand, and securely share their complete medical history while providing clinicians with instant, evidence-backed summaries and temporal health timelines.

In contemporary healthcare, a patient's medical information is frequently fragmented across paper prescriptions, diagnostic lab reports, discharge summaries, and isolated hospital databases. When consulting a new doctor, patients often struggle to recall their comprehensive medical history accurately, while clinicians are forced to spend valuable consultation time manually parsing disparate documents.

PharmaBrain solves this fragmentation by providing a unified digital health repository. Patients can upload medical documents from **any hospital or diagnostic facility**. The platform utilizes Google Gemini multimodal AI to perform OCR, document understanding, and structured data extraction—identifying prescribed medications, dosages, lab values, vitals, clinical findings, and medical conditions. Extracted data undergoes a **Human-in-the-Loop review process** where patients verify details before committing them to their permanent record.

The system synthesizes this data into a **chronological medical timeline** and **longitudinal trends dashboard**, enabling both patients and doctors to trace health evolution over time. It highlights recurring symptom patterns, medication changes, and temporal correlations (e.g., symptom onset relative to drug initiation) without automated diagnostic bias.

Patients maintain 100% control over their medical record, securely sharing access with authorized physicians via temporary access codes or QR links. Clinicians receive an AI-synthesized, provenance-tracked summary alongside original raw documents, accelerating decision-making while ensuring **the clinician remains the sole decision-maker**.

---

## ✨ Key Features

### 👨‍⚕️ Patient Portal
- **Multimodal Document Upload**: Upload prescriptions, lab reports, and imaging summaries in image or PDF formats.
- **AI OCR & Extraction**: Automatic extraction of doctor names, healthcare facilities, drug names, dosages, frequencies, and precautions using Gemini 2.5 Flash / Pro.
- **Human-in-the-Loop Verification**: Review and edit extracted AI fields before saving to ensure data fidelity.
- **Longitudinal Medical Timeline**: Chronological interactive timeline tracing prescriptions, hospital visits, lab test results, and clinical milestones.
- **Vitals & Lab Trends Dashboard**: Interactive charts (Recharts) mapping vital metrics (Blood Pressure, Blood Glucose, Cholesterol, HbA1c) over time.
- **Symptom & Medication Correlation**: Log recurring symptoms and track temporal overlaps with medication start/stop dates.
- **HMS & Facility Sync Simulation**: Import external records or connect simulated Hospital Management System (HMS) feeds.
- **Secure Doctor Share Center**: Generate time-bound access tokens or QR links to grant doctors instant view permissions.

### 👩‍⚕️ Doctor / Clinician Portal
- **AI Longitudinal Patient Summary**: Comprehensive clinical overview highlighting active medications, key findings, and potential risk factors.
- **Doctor Natural Language Assistant (RAG Query)**: Ask clinical questions directly about the patient's history (e.g., *"What antihypertensives has this patient taken in the last 6 months?"*).
- **Clinical Verification & Sign-Off**: Verification tool for clinicians to endorse, flag, or modify extracted clinical parameters.
- **Data Provenance & Reliability Badges**: Full transparency with original document overlays, confidence badges, and audit trails.

---

## 🛠️ Architecture & Tech Stack

```
                                  +---------------------------------------+
                                  |            Patient / Doctor           |
                                  |              User Interface           |
                                  +-------------------+-------------------+
                                                      |
                                                      v
                                  +-------------------+-------------------+
                                  |     React 19 + Vite + TypeScript      |
                                  |    Tailwind CSS v4 + Framer Motion    |
                                  +-------------------+-------------------+
                                                      |
                                                      v
                                  +-------------------+-------------------+
                                  |      Health Store Context (State)     |
                                  |      LocalStorage Persistence         |
                                  +-------------------+-------------------+
                                                      |
                                                      v
                                  +-------------------+-------------------+
                                  |       Google Gemini AI Engine         |
                                  |   (Gemini 2.5 Flash / 2.5 Pro OCR)   |
                                  +---------------------------------------+
```

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/) |
| **Styling & Motion** | [Tailwind CSS v4](https://tailwindcss.com/), [Motion (Framer Motion)](https://motion.dev/) |
| **Data Visualization** | [Recharts](https://recharts.org/) |
| **Icons & UI** | [Lucide React](https://lucide.dev/) |
| **AI / OCR Integration** | [@google/genai](https://www.npmjs.com/package/@google/genai) (Google Gemini 2.5 Flash / Pro) |
| **State Management** | React Context API with Local Storage Persistence (`health-store.tsx`) |

---

## 📂 Repository Structure

```
PharmaBrain/
├── public/                     # Static assets
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── charts/             # Recharts components (TrendChart)
│   │   ├── common/             # Badges (Provenance, Reliability, Verification)
│   │   ├── layout/             # Patient & Doctor navbar/layout wrappers
│   │   └── modals/             # Document preview & detail view modals
│   ├── data/                   # Initial mock patient & doctor dataset
│   ├── lib/
│   │   ├── gemini-analysis.ts  # Gemini AI multimodal OCR & extraction logic
│   │   ├── health-store.tsx    # Global health record state & local persistence
│   │   └── router.tsx          # Client-side routing engine
│   ├── pages/                  # Page components
│   │   ├── LandingPage.tsx     # Hero landing page & role switcher
│   │   ├── OnboardingPage.tsx  # User onboarding flow
│   │   ├── doctor/             # Doctor portal (Dashboard, Query Assistant, Verification)
│   │   └── patient/            # Patient portal (Overview, Timeline, Docs, Medicines, Vitals, Add)
│   ├── types/                  # TypeScript interfaces for health records
│   ├── App.tsx                 # Root application wrapper
│   ├── index.css               # Design system tokens & Tailwind CSS imports
│   └── main.tsx                # Application entry point
├── .env.example                # Sample environment configuration template
├── package.json                # Project dependencies and script commands
├── tsconfig.json               # TypeScript compiler config
└── vite.config.ts              # Vite bundler configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local environment:
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **bun** / **yarn**

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Aryan22N/PharmaBrain-prototype_1.git
   cd PharmaBrain
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory (you can copy `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Add your Google Gemini API key to `.env`:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_GEMINI_MODEL=gemini-2.5-flash
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

5. **Build for Production**
   ```bash
   npm run build
   ```

---

## ⚖️ Clinical Safety & Legal Disclaimer

> **IMPORTANT**: PharmaBrain is an **informational research prototype** designed to assist patients and clinicians in organizing and reviewing medical records.
> 
> - **Non-Diagnostic**: The platform **does not** provide automated clinical diagnoses, medical advice, or independent treatment recommendations.
> - **Human-in-the-Loop**: All AI-extracted information must be reviewed and verified by human users (patients and qualified healthcare professionals).
> - **Clinician Authority**: All medical decisions, drug prescriptions, and diagnostic evaluations remain strictly the responsibility of the attending licensed physician.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
