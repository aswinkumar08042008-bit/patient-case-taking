from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    fullName = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    phoneNumber = Column(String, nullable=False)

    medical_history = relationship(
        "MedicalHistory",
        back_populates="patient",
        uselist=False
    )


class MedicalHistory(Base):
    __tablename__ = "medical_history"

    id = Column(Integer, primary_key=True, index=True)

    patient_id = Column(
        Integer,
        ForeignKey("patients.id"),
        nullable=False
    )

    previousConditions = Column(String, nullable=True)
    currentMedicines = Column(String, nullable=True)
    allergies = Column(String, nullable=True)
    previousSurgeries = Column(String, nullable=True)

    patient = relationship(
        "Patient",
        back_populates="medical_history"
    )
class VoiceResponse(Base):
    __tablename__ = "voice_responses"

    response_id = Column(Integer, primary_key=True, index=True)
    visit_id = Column(Integer, nullable=False)
    question = Column(String, nullable=False)
    response = Column(String, nullable=False)
    language = Column(String, nullable=True)