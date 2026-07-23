from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(
    title="Netra AI Crime Analytics Engine",
    description="State Police Crime Intelligence API & Predictive Risk Model Serving",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RiskPredictionRequest(BaseModel):
    district: str
    station: str
    patrol_units: int
    cctv_coverage_pct: float
    street_lighting_pct: float

class RiskPredictionResponse(BaseModel):
    baseline_risk_score: float
    simulated_risk_score: float
    risk_reduction_pct: float
    primary_threat: str
    shap_factors: List[dict]

@app.get("/")
def read_root():
    return {"system": "Netra AI Crime Analytics Platform", "status": "ONLINE", "security_level": "LEVEL-4"}

@app.get("/api/v1/incidents")
def get_incidents(severity: Optional[str] = None):
    incidents = [
        {
            "id": "inc-101",
            "firNumber": "FIR-2026-8819",
            "crimeType": "Armed Robbery",
            "date": "2026-07-22",
            "time": "23:45",
            "district": "Metro Central",
            "station": "Sector 18 PS",
            "severity": "Critical",
            "riskScore": 92
        },
        {
            "id": "inc-102",
            "firNumber": "FIR-2026-8820",
            "crimeType": "Vehicle Theft",
            "date": "2026-07-23",
            "time": "02:15",
            "district": "Metro Central",
            "station": "Sector 18 PS",
            "severity": "High",
            "riskScore": 78
        }
    ]
    if severity:
        incidents = [i for i in incidents if i["severity"].lower() == severity.lower()]
    return {"count": len(incidents), "incidents": incidents}

@app.post("/api/v1/predict-risk", response_model=RiskPredictionResponse)
def predict_risk(req: RiskPredictionRequest):
    baseline = 88.4
    reduction = (req.patrol_units * 4.2) + ((req.cctv_coverage_pct - 50) * 0.3) + ((req.street_lighting_pct - 50) * 0.2)
    simulated = max(12.0, round(baseline - reduction, 1))
    
    return {
        "baseline_risk_score": baseline,
        "simulated_risk_score": simulated,
        "risk_reduction_pct": round(baseline - simulated, 1),
        "primary_threat": "Nocturnal Commercial Burglary & Armed Robbery",
        "shap_factors": [
            {"factor": "Proximity to Historical Hotspot (Sector 18)", "impact": 32},
            {"factor": "Active Repeat Offender Cell Ping", "impact": 28},
            {"factor": "Time Window Vulnerability (01:00-04:00)", "impact": 18},
        ]
    }

@app.get("/api/v1/copilot-query")
def copilot_query(q: str = Query(..., description="Natural language query from officer")):
    return {
        "query": q,
        "parsed_intent": {
            "jurisdiction": "Sector 18 PS",
            "offense": "Vehicle Theft",
            "timeframe": "Last 6 Months",
            "repeatOffenders": ["Rashid Khan (Shadow)", "Vikram Tyagi"]
        },
        "response_summary": "Extracted SQL/PostGIS Intent: Filtered 2 repeat offenders matched to Sector 18 PS vehicle theft FIRs (FIR-2026-8820)."
    }
