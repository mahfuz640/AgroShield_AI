# AgroShield AI: Intelligent Agricultural Diagnostic System
**Project Report & System Documentation**

---

## Page 1: Executive Summary & Vision

### 1.1 Project Overview
**AgroShield AI** is a state-of-the-art diagnostic platform designed to bridge the gap between advanced artificial intelligence and practical field agriculture. By leveraging the **Google Gemini 3** multimodal engine, the system provides real-time identification of diseases in both crops (leaf analysis) and poultry (avian health).

### 1.2 The Problem Statement
Agricultural productivity is frequently threatened by pathogens that go unnoticed until they reach a critical state.
*   **For Farmers:** Professional consultation is often expensive or geographically inaccessible.
*   **For Poultry Owners:** Early detection of diseases like Newcastle or Coccidiosis is the only way to prevent total flock loss.
*   **The Delay:** Traditional lab testing takes days; AgroShield AI takes seconds.

### 1.3 The AgroShield Solution
The application transforms any smartphone into a professional-grade diagnostic tool. It utilizes the device's camera to capture visual data, which is then analyzed by a specialized AI model trained on vast agricultural datasets.

---

## Page 2: Technical Architecture & Methodology

### 2.1 The Tech Stack
*   **Frontend:** React 19 with TypeScript for robust, type-safe state management.
*   **Styling:** Tailwind CSS for a modern, responsive, and high-performance UI.
*   **AI Engine:** Google Gemini API (`gemini-3-flash-preview`) for low-latency multimodal reasoning.
*   **Grounding:** Integrated Google Search tool to ensure treatment protocols are current and scientifically verified.
*   **Storage:** LocalStorage for persistent user history without requiring a backend database (privacy-first).

### 2.2 AI Diagnostic Logic
The system uses a custom system instruction set to switch "personalities" based on the selected mode:
1.  **Agronomist Mode:** Focuses on chlorophyll patterns, necrotic spots, and fungal growth on leaf surfaces.
2.  **Veterinary Mode:** Focuses on avian posture, feather condition, and visible respiratory signs.

### 2.3 Data Flow
1.  **Capture:** Image captured via `navigator.mediaDevices` or uploaded as Base64.
2.  **Processing:** Image + Contextual Prompt sent to Gemini.
3.  **Grounding:** Gemini performs a real-time web search for the latest agricultural bulletins.
4.  **Parsing:** Response returned in a strict JSON schema for UI rendering.

---

## Page 3: Features & User Operations

### 3.1 Core Features
*   **Dual-Mode Toggle:** Seamless switching between plant and poultry diagnostics.
*   **Real-time Camera View:** Optimized for field use with environment-facing camera support.
*   **Intelligent History:** Tracks the last 10 assessments locally for quick comparison.
*   **Treatment Grounding:** Provides clickable "Expert Resource" links directly to the source of the medical/botanical advice.

### 3.2 Operating Instructions
1.  **Selection:** Choose the "Plant" or "Poultry" tab.
2.  **Observation:** Capture a clear, well-lit photo of the affected area.
3.  **Analysis:** Wait 3-5 seconds for the AI to "Scan for pathogenic signatures."
4.  **Implementation:** Review the Symptoms, Treatment, and Prevention sections. Use the external links for purchasing specific medicines or deeper reading.

### 3.3 Safety & Biosecurity Disclaimer
AgroShield AI is an advisory tool. While it uses the latest AI models, users are encouraged to:
*   Consult a certified veterinarian for flock-wide outbreaks.
*   Follow local agricultural department guidelines for quarantined pests.
*   Practice biosecurity by cleaning phones/tools after inspecting sick specimens.

---
**Project Status:** Production Ready (v1.0.0)
**Developed by:** World-Class Senior AI Engineer
