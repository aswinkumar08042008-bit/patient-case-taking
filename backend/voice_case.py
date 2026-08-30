import time
import pyttsx3
import speech_recognition as sr

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from database import DATABASE_URL, VoiceResponse


# ============================================================
# DATABASE
# ============================================================

db_engine = create_engine(DATABASE_URL)


# ============================================================
# TEXT TO SPEECH
# ============================================================

def speak(text):
    print("\nComputer:", text)

    try:
        engine = pyttsx3.init()

        # Slow and clear for elderly patients
        engine.setProperty("rate", 105)

        # Maximum software volume
        engine.setProperty("volume", 1.0)

        engine.say(text)
        engine.runAndWait()
        engine.stop()

        # Give patient time after computer finishes speaking
        time.sleep(3)

    except Exception as e:
        print("Voice output error:", type(e).__name__, e)


# ============================================================
# LISTEN TO PATIENT
# ============================================================

def listen_to_patient():
    recognizer = sr.Recognizer()

    recognizer.energy_threshold = 300
    recognizer.dynamic_energy_threshold = True

    # Allows patient to pause naturally while speaking
    recognizer.pause_threshold = 1.0

    try:

        # Device 1 worked during our PyAudio test
        with sr.Microphone(
            device_index=1,
            sample_rate=16000,
            chunk_size=1024
        ) as source:

            print("\n🎤 YOUR TURN!")
            print("Please speak now...")
            print("Listening...")

            # Short adjustment for background noise
            recognizer.adjust_for_ambient_noise(
                source,
                duration=0.5
            )

            # Give patient enough time to answer
            audio = recognizer.listen(
                source,
                timeout=15,
                phrase_time_limit=15
            )

        print("\nProcessing your answer...")

        # English-India recognition works well with Tanglish
        text = recognizer.recognize_google(
            audio,
            language="en-IN"
        )

        print("\nPatient said:")
        print(text)

        return text

    except sr.WaitTimeoutError:

        print("\n❌ No response detected.")
        return None

    except sr.UnknownValueError:

        print("\n❌ Sorry, I couldn't understand the response.")
        return None

    except sr.RequestError as e:

        print("\n❌ Speech recognition service error:")
        print(e)

        return None

    except Exception as e:

        print("\n❌ Error:")
        print(type(e).__name__, e)

        return None


# ============================================================
# SAVE RESPONSE TO DATABASE
# ============================================================

def save_response(visit_id, question, response):

    try:

        with Session(db_engine) as db:

            new_response = VoiceResponse(
                visit_id=visit_id,
                question=question,
                response=response,
                language="Tanglish"
            )

            db.add(new_response)

            db.commit()

            db.refresh(new_response)

            print("\n✅ Voice response saved successfully!")

            print(
                "Response ID:",
                new_response.response_id
            )

    except Exception as e:

        print("\n❌ Database error:")
        print(type(e).__name__, e)


# ============================================================
# ASK ONE QUESTION
# ============================================================

def ask_question(visit_id, question):

    print("\n")
    print("=" * 70)
    print("PATIENT QUESTION")
    print("=" * 70)

    print("\nQUESTION:")
    print()

    # Large/clear text for elderly patients
    print(">>>", question.upper())

    print()
    print("=" * 70)

    # Speak the question
    speak(question)

    # Listen to patient
    response = listen_to_patient()

    # If response wasn't understood, give one more chance
    if response is None:

        print("\nLet's try once more.")

        speak(
            "Sorry, enakku unnga response puriyala. "
            "Please once again sollunga."
        )

        response = listen_to_patient()

    # Still no response
    if response is None:

        print("\n⚠️ Response was not saved.")

        return False

    # Save patient's actual spoken response
    save_response(
        visit_id,
        question,
        response
    )

    # Pause before next question
    time.sleep(3)

    return True


# ============================================================
# MAIN PROGRAM
# ============================================================

def main(visit_id=None):

    print("\n")
    print("=" * 70)
    print("       PATIENT VOICE CASE-TAKING SYSTEM")
    print("=" * 70)

    # --------------------------------------------------------
    # TEMPORARY TEST VISIT
    # --------------------------------------------------------
    if visit_id is None:
         visit_id = int(input("\nEnter the visit ID: "))

    print("\nVisit ID:", visit_id)

    # ========================================================
    # 1. WHEELCHAIR
    # ========================================================

    question1 = (
        "Ungalukku wheelchair venum ah?"
    )

    if not ask_question(visit_id, question1):
        return

    # ========================================================
    # 2. ASSISTANT
    # ========================================================

    question2 = (
        "Ungalukku assistant help venum ah?"
    )

    if not ask_question(visit_id, question2):
        return

    # ========================================================
    # 3. MAIN PROBLEM
    # ========================================================

    question3 = (
        "Ungalukku enna problem irukku?"
    )

    if not ask_question(visit_id, question3):
        return

    # ========================================================
    # 4. DURATION
    # ========================================================

    question4 = (
        "Indha problem ungalukku evlo naala ah irukku?"
    )

    if not ask_question(visit_id, question4):
        return

    # ========================================================
    # 5. HOW IT STARTED
    # ========================================================

    question5 = (
        "Indha problem eppadi start aachu?"
    )

    if not ask_question(visit_id, question5):
        return

    # ========================================================
    # 6. SEVERITY
    # ========================================================

    question6 = (
        "Indha problem evlo severe-aa irukku?"
    )

    if not ask_question(visit_id, question6):
        return

    # ========================================================
    # 7. ASSOCIATED SYMPTOMS
    # ========================================================

    question7 = (
        "Indha problem-oda vera edhaavadhu symptoms irukka?"
    )

    if not ask_question(visit_id, question7):
        return

    # ========================================================
    # 8. MEDICAL HISTORY
    # ========================================================

    question8 = (
        "Ungalukku ithuku munnaadi edhaavadhu medical problem irundhucha?"
    )

    if not ask_question(visit_id, question8):
        return

    # ========================================================
    # 9. SURGICAL HISTORY
    # ========================================================

    question9 = (
        "Ungalukku edhaavadhu surgery nadandhirukka?"
    )

    if not ask_question(visit_id, question9):
        return

    # ========================================================
    # 10. DRUG / MEDICATION HISTORY
    # ========================================================

    question10 = (
        "Neenga regular-aa edhaavadhu medicine eduthuttu irukkeengala?"
    )

    if not ask_question(visit_id, question10):
        return

    # ========================================================
    # 11. ALLERGY HISTORY
    # ========================================================

    question11 = (
        "Ungalukku edhaavadhu medicine illa food allergy irukka?"
    )

    if not ask_question(visit_id, question11):
        return

    # ========================================================
    # 12. FAMILY HISTORY
    # ========================================================

    question12 = (
        "Ungal family-la yaarukkavadhu important medical problem irukka?"
    )

    if not ask_question(visit_id, question12):
        return

    # ========================================================
    # 13. PERSONAL HISTORY
    # ========================================================

    question13 = (
        "Ungaloda daily habits pathi konjam sollunga."
    )

    if not ask_question(visit_id, question13):
        return

    # ========================================================
    # 14. REVIEW OF SYSTEMS
    # ========================================================

    question14 = (
        "Ippo ungalukku vera edhaavadhu symptoms irukka?"
    )

    if not ask_question(visit_id, question14):
        return

    # ========================================================
    # COMPLETED
    # ========================================================

    print("\n")
    print("=" * 70)
    print("       VOICE CASE TAKING COMPLETED")
    print("=" * 70)

    speak(
        "Voice case taking completed. Thank you."
    )


# ============================================================
# START PROGRAM
# ============================================================

def start_voice_case(visit_id):
    print("\nStarting voice case-taking...")
    print("Visit ID:", visit_id)
    return main(visit_id)


if __name__ == "__main__":
    visit_id = int(input("Enter the visit ID: "))
    main(visit_id)