import base64
from fastapi import FastAPI, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import Base, engine, SessionLocal
from models import Patient, MedicalHistory, DoctorNote
from voice import (
    get_first_question,
    process_patient_answer,
    transcribe_audio,
    text_to_speech,
)


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


# Home
@app.get("/")
def home():
    return {
        "message": "MediVoice backend is running"
    }


# Health check
@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# -------------------------
# Patient
# -------------------------

class PatientDetails(BaseModel):
    fullName: str
    age: int
    gender: str
    phoneNumber: str


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


# Get all patients
@app.get("/patients")
def get_patients(db: Session = Depends(get_db)):
    patients = db.query(Patient).all()

    return [
        {
            "id": patient.id,
            "fullName": patient.fullName,
            "age": patient.age,
            "gender": patient.gender,
            "phoneNumber": patient.phoneNumber
        }
        for patient in patients
    ]


# -------------------------
# Medical History
# -------------------------

class MedicalHistoryDetails(BaseModel):
    patient_id: int
    previousConditions: str = ""
    currentMedicines: str = ""
    allergies: str = ""
    previousSurgeries: str = ""

class DoctorNoteDetails(BaseModel):
    patient_id: int
    note: str
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

# Get doctor notes for a patient
# Get doctor notes for a patient
@app.get("/patients/{patient_id}/notes")

def get_doctor_notes(
    patient_id: int,
    db: Session = Depends(get_db)
):
    notes = db.query(DoctorNote).filter(
        DoctorNote.patient_id == patient_id
    ).all()

    return [
        {
            "id": note.id,
            "patient_id": note.patient_id,
            "note": note.note,
            "created_at": note.created_at.isoformat() 
                 if note.created_at else None
        }
        for note in notes
    ]
# Save a doctor note for a patient
@app.post("/patients/{patient_id}/notes")
def create_doctor_note(
    patient_id: int,
    note_data: DoctorNoteDetails,
    db: Session = Depends(get_db)
):
    # Check whether patient exists
    patient = db.query(Patient).filter(
        Patient.id == patient_id
    ).first()

    if not patient:
        return {
            "success": False,
            "message": "Patient not found"
        }

    new_note = DoctorNote(
        patient_id=patient_id,
        note=note_data.note
    )

    db.add(new_note)
    db.commit()
    db.refresh(new_note)

    return {
        "success": True,
        "message": "Doctor note saved successfully",
        "note": {
            "id": new_note.id,
            "patient_id": new_note.patient_id,
            "note": new_note.note,
            "created_at": (
                new_note.created_at.isoformat()
                if new_note.created_at
                else None
            )
        }
    }
# Get medical history for one patient
@app.get("/patients/{patient_id}/history")
def get_patient_history(
    patient_id: int,
    db: Session = Depends(get_db)
):
    history = db.query(MedicalHistory).filter(
        MedicalHistory.patient_id == patient_id
    ).first()

    if not history:
        return {
            "message": "No medical history found"
        }

    return {
        "previousConditions": history.previousConditions,
        "currentMedicines": history.currentMedicines,
        "allergies": history.allergies,
        "previousSurgeries": history.previousSurgeries
    }

# -------------------------
# AI Voice Case Taking
# -------------------------

@app.post("/voice/start")
def start_voice_case():
    """
    Start a new AI voice medical interview.
    """

    question = get_first_question()

    audio = text_to_speech(question)

    audio_base64 = None

    if audio:
        audio_base64 = base64.b64encode(audio).decode("utf-8")

    conversation = f"AI: {question}\n\n"

    return {
        "question": question,
        "audio": audio_base64,
        "conversation": conversation,
        "completed": False,
    }

@app.post("/voice/transcribe")
async def voice_transcribe(
    audio: UploadFile = File(...)
):
    try:
        audio_bytes = await audio.read()

        mime_type = audio.content_type or "audio/webm"

        transcript = transcribe_audio(
            audio_bytes,
            mime_type
        )

        if not transcript:
            return {
                "success": False,
                "message": "Could not understand the patient's voice."
            }

        return {
            "success": True,
            "text": transcript
        }

    except Exception as e:
        print(
            "Transcription API error:",
            type(e).__name__,
            e
        )

        return {
            "success": False,
            "message": "Speech transcription failed."
        }
@app.post("/voice/respond")
async def voice_respond(
    patient_answer: str = Form(...),
    conversation: str = Form("")
):
    try:
        print("PATIENT ANSWER:", patient_answer)

        if not patient_answer.strip():
            return {
                "success": False,
                "message": "Patient answer is empty."
            }

        result = process_patient_answer(
            conversation,
            patient_answer
        )

        question = result["question"]

        return {
            "success": True,
            "patient_answer": patient_answer,
            "question": question,
            "conversation": result["conversation"],
            "completed": result["completed"],
        }

    except Exception as e:
        print(
            "Voice API error:",
            type(e).__name__,
            e
        )

        return {
            "success": False,
            "message": "Voice processing failed."
        }