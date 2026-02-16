# Elite Placement: Explainable Recruitment System

A modular, rule-driven system designed for campus placements with a focus on **transparency** and **explainability**. This platform bridges the gap between recruiters and students by providing clear logic for every selection decision.

## 🚀 Overview
Elite Placement allows companies to define dynamic eligibility criteria and multi-round selection workflows. Students benefit from real-time eligibility checks with human-readable explanations, ensuring a fair and transparent recruitment process.

## ✨ Key Features
- **Dynamic Rule Engine**: Configure eligibility rules (CGPA, Branch, Skills, etc.) via visual builder or JSON.
- **Explainable Decisions**: Every automated evaluation generates a detailed explanation for students and recruiters.
- **Multi-Round Workflow**: End-to-end candidate management through customizable selection rounds.
- **Premium UI**: Modern, glassmorphic dashboard designed for a superior user experience.

## 🛠 Tech Stack
- **Frontend**: React, Vite, TypeScript, Vanilla CSS (Glassmorphism)
- **Backend Service**: TypeScript Logic (Domain-Driven Design)
- **State Management**: Shared Service Architecture

## 📂 Project Structure
```text
frontend/
├── src/
│   ├── components/    # Student Dashboard & Recruiter Hub
│   ├── engines/       # Core Rule Evaluation Logic
│   └── services/      # Placement Lifecycle Management
src/                   # Shared Domain Logic & Engine Types
```

## 🚦 Getting Started
1. **Initialize Project**:
   ```bash
   cd frontend
   npm install
   ```
2. **Launch Application**:
   ```bash
   npm run dev
   ```
3. **Access Portal**: Open `http://localhost:5173` in your browser.

## 📄 License
MIT
