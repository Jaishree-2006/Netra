# Netra AI — State Crime Intelligence Analytics Platform

> **Netra** (नेत्र — *"The Eye"*) is a full-scale AI-Driven Crime Analytics & Predictive Policing Command Platform for State Law Enforcement agencies.

---

## 🌐 Platform Architecture

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Aurora FX | Canvas API + requestAnimationFrame |
| Backend | Python FastAPI |
| AI/ML | XGBoost + scikit-learn + spaCy (design spec) |
| Graph DB | Neo4j (design spec) |
| GIS | PostGIS + Mapbox GL (design spec) |

---

## 🎯 Key Features

- 🌌 **Aurora Gradient Hero** — 60 FPS canvas WebGL-style interactive gradient with spring cursor glow
- 🔐 **Multi-role RBAC** — District SP, SHO, Analyst, Auditor, DGP, Public Citizen
- 🗺️ **Geospatial Hotspot Map** — Time slider, crime type filters, incident inspector
- 🕸️ **Link & Network Analysis** — Multi-hop entity graph (suspects, FIRs, vehicles, SIMs)
- 🧠 **Explainable Predictive Risk** — SHAP factor attribution transparency + ethics audit
- 🎛️ **What-If Resource Simulator** — Patrol allocation sandbox with live risk forecasting
- 🤖 **AI Co-pilot** — Natural language query engine (RAG + LLM query parsing)
- 📋 **WORM Audit Trail** — Cryptographic immutable audit log for oversight compliance
- 👁️ **Public Transparency Portal** — Anonymized 1km² aggregated safety heatmaps

---

## 🚀 Run Locally

### Frontend

```bash
npm install
npm run dev
```

### Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend API docs: `http://localhost:8000/docs`

---

## 🔒 Security & Ethics

This platform is designed with **ethical AI first principles**:

- All AI risk scores include SHAP-based human-readable explanation panels
- Human-in-the-loop review required before patrol dispatch
- Independent Oversight Board auditor role with read-only cryptographic log access
- Disparate Impact (DI) metric fairness auditing built into the model pipeline

---

*© 2026 State Police Cyber Cell & Intelligence Analytics Wing*
