from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="MediVoice API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "MediVoice backend is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


class PatientDetails(BaseModel):
    fullName: str
    age: int
    gender: str
    phoneNumber: str


@app.post("/patients")
def create_patient(patient: PatientDetails):
    return {
        "message": "Patient details received",
        "patient": patient
    }