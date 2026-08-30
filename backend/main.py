from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import Base, engine, SessionLocal
from models import Patient,MedicalHistory


app = FastAPI(title="MediVoice API")


# Create database tables
Base.metadata.create_all(bind=engine)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


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
class MedicalHistoryDetails(BaseModel):
    patient_id: int
    previousConditions: str = ""
    currentMedicines: str = ""
    allergies: str = ""
    previousSurgeries: str = ""

# Create patient
@app.post("/patients")
def create_patient(
    patient: PatientDetails,
    db: Session = Depends(get_db)
):
    new_patient = Patient(
        fullName=patient.fullName,
        age=patient.age,
        gender=patient.gender,
        phoneNumber=patient.phoneNumber
    )

    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)

    return {
        "message": "Patient saved successfully",
        "patient": {
            "id": new_patient.id,
            "fullName": new_patient.fullName,
            "age": new_patient.age,
            "gender": new_patient.gender,
            "phoneNumber": new_patient.phoneNumber
        }
    }
@app.post("/medical-history")
def create_medical_history(
    history: MedicalHistoryDetails,
    db: Session = Depends(get_db)
):
    new_history = MedicalHistory(
        patient_id=history.patient_id,
        previousConditions=history.previousConditions,
        currentMedicines=history.currentMedicines,
        allergies=history.allergies,
        previousSurgeries=history.previousSurgeries
    )

    db.add(new_history)
    db.commit()
    db.refresh(new_history)

    return {
        "message": "Medical history saved successfully",
        "medical_history": {
            "id": new_history.id,
            "patient_id": new_history.patient_id,
            "previousConditions": new_history.previousConditions,
            "currentMedicines": new_history.currentMedicines,
            "allergies": new_history.allergies,
            "previousSurgeries": new_history.previousSurgeries
        }
    }