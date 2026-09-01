import os
import time
import wave
import base64
import winsound
import tempfile

import numpy as np
import sounddevice as sd
from google import genai


# ============================================================
# GEMINI SETUP
# ============================================================

client = genai.Client()

AI_MODEL = "gemini-3.6-flash"
TTS_MODEL = "gemini-3.1-flash-tts-preview"


# ============================================================
# SETTINGS
# ============================================================

SAMPLE_RATE = 16000
CHANNELS = 1

# Elderly-friendly recording time
RECORDING_TIME = 20

# Maximum AI follow-up questions
MAX_QUESTIONS = 15


# ============================================================
# TEXT TO SPEECH
# ============================================================

def speak(text):

    print("\nComputer:")
    print(text)

    temp_filename = None

    try:

        tts_prompt = f"""
Speak this question to an elderly patient.

Use natural conversational Tanglish.

Speak slowly, clearly and gently.

Do not sound robotic.

Question:

{text}
"""

        response = client.interactions.create(
            model=TTS_MODEL,
            input=tts_prompt,
            response_format={
                "type": "audio"
            },
            generation_config={
                "speech_config": [
                    {
                        "voice": "Kore"
                    }
                ]
            }
        )

        audio_data = response.output_audio.data

        if isinstance(audio_data, str):
            audio_bytes = base64.b64decode(audio_data)
        else:
            audio_bytes = audio_data

        temp_file = tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".wav"
        )

        temp_filename = temp_file.name
        temp_file.close()

        # Gemini TTS PCM → WAV
        with wave.open(
            temp_filename,
            "wb"
        ) as wf:

            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(24000)
            wf.writeframes(audio_bytes)

        print("🔊 Speaking...")

        # Windows built-in audio
        winsound.PlaySound(
            temp_filename,
            winsound.SND_FILENAME
        )

        time.sleep(0.2)

    except Exception as e:

        print("\n❌ Voice error:")
        print(type(e).__name__, e)

    finally:

        if temp_filename:

            try:
                os.remove(temp_filename)
            except Exception:
                pass


# ============================================================
# RECORD PATIENT
# ============================================================

def record_patient():

    print("\n🎤 YOUR TURN!")
    print("Please speak now...")
    print("Listening...")

    try:

        recording = sd.rec(
            int(
                RECORDING_TIME *
                SAMPLE_RATE
            ),
            samplerate=SAMPLE_RATE,
            channels=CHANNELS,
            dtype="int16"
        )

        sd.wait()

        print("\nRecording finished.")

        temp_file = tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".wav"
        )

        filename = temp_file.name
        temp_file.close()

        with wave.open(
            filename,
            "wb"
        ) as wf:

            wf.setnchannels(CHANNELS)
            wf.setsampwidth(2)
            wf.setframerate(SAMPLE_RATE)

            wf.writeframes(
                recording.tobytes()
            )

        return filename

    except Exception as e:

        print("\n❌ Microphone error:")
        print(type(e).__name__, e)

        return None


# ============================================================
# GEMINI SPEECH TO TEXT
# ============================================================

def transcribe_patient(audio_file):

    try:

        print("\n🤖 Gemini is understanding your answer...")

        with open(
            audio_file,
            "rb"
        ) as audio:

            audio_bytes = audio.read()

        response = client.models.generate_content(
            model=AI_MODEL,
            contents=[
                {
                    "role": "user",
                    "parts": [
                        {
                            "text": """
Listen to the patient's recording.

The patient may speak Tamil,
Tanglish or English.

Write what the patient said.

Do not diagnose.

Do not translate.

Do not summarize.

Return only the patient's spoken response.
"""
                        },
                        {
                            "inline_data": {
                                "mime_type": "audio/wav",
                                "data": audio_bytes
                            }
                        }
                    ]
                }
            ]
        )

        text = response.text.strip()

        if not text:
            return None

        print("\nPatient said:")
        print(text)

        return text

    except Exception as e:

        print("\n❌ Speech recognition error:")
        print(type(e).__name__, e)

        return None

    finally:

        try:
            os.remove(audio_file)
        except Exception:
            pass


# ============================================================
# LISTEN
# ============================================================

def listen_to_patient():

    filename = record_patient()

    if filename is None:
        return None

    return transcribe_patient(filename)


# ============================================================
# ASK QUESTION
# ============================================================

def ask_question(question):

    print("\n")
    print("=" * 65)
    print("PATIENT QUESTION")
    print("=" * 65)

    print(question)

    print("=" * 65)

    # Speak question
    speak(question)

    # Small pause
    time.sleep(0.2)

    # Patient answers
    answer = listen_to_patient()

    # Retry once
    if answer is None:

        speak(
            "Sorry, enakku unga response "
            "clear-aa kekkala. "
            "Konjam slow-aa once again sollunga."
        )

        answer = listen_to_patient()

    return answer


# ============================================================
# GEMINI GENERATES RELEVANT QUESTION
# ============================================================

def generate_next_question(conversation):

    print("\n🤖 Gemini is thinking...")

    prompt = f"""
You are a compassionate healthcare
history-taking assistant.

You are interviewing an elderly patient.

The patient can speak Tamil,
Tanglish or English.

Your job is to ask the NEXT
most relevant medical-history question.

IMPORTANT:

Ask questions like a human healthcare worker.

Do not follow a fixed questionnaire.

Use the patient's previous answers
to decide what to ask next.

================================================
LANGUAGE
================================================

Use simple natural spoken Tanglish.

Avoid difficult medical terminology.

Keep the question short.

Ask ONLY ONE question.

Examples:

"Indha problem eppo start aachu?"

"Evlo naala indha problem irukku?"

"Pain exact-aa enga irukku?"

"Pain continuous-aa irukka?"

"Pain evlo severe-aa irukku?"

"Fever irukka?"

"Vomiting illa nausea edhaavadhu irukka?"

"Breathing-la edhaavadhu kashtam irukka?"

"Already doctor-a paatheengala?"

"Edhaavadhu medicine eduthuteengala?"

================================================
IMPORTANT
================================================

First understand the patient's
main complaint.

Then ask relevant questions.

For stomach pain, ask relevant
questions about things such as:

location,
duration,
severity,
relation to food,
vomiting,
nausea,
bowel changes,
urinary symptoms,
fever,
previous episodes.

For cough, ask relevant questions about:

duration,
fever,
phlegm,
breathing difficulty,
chest discomfort,
wheezing,
previous respiratory problems.

For headache, ask relevant questions about:

location,
duration,
severity,
sudden or gradual onset,
vomiting,
vision problems,
dizziness,
fever,
previous headaches.

For chest discomfort, ask relevant
questions about:

location,
duration,
severity,
breathing difficulty,
dizziness,
sweating,
and other associated symptoms.

Do NOT ask irrelevant questions.

Do NOT diagnose.

Do NOT prescribe medicine.

Do NOT recommend treatment.

Only collect medical history.

================================================
ENDING
================================================

When enough relevant history has
been collected, return exactly:

END_INTERVIEW

Otherwise return ONE question.

================================================
PREVIOUS CONVERSATION
================================================

{conversation}

================================================
OUTPUT
================================================

Return ONLY:

ONE natural Tanglish question

OR

END_INTERVIEW
"""

    try:

        response = client.models.generate_content(
            model=AI_MODEL,
            contents=prompt
        )

        question = response.text.strip()

        print("\n🤖 Gemini:")
        print(question)

        return question

    except Exception as e:

        print("\n❌ Gemini AI error:")
        print(type(e).__name__, e)

        return None


# ============================================================
# MAIN CASE TAKING
# ============================================================

def start_voice_case():

    print("\n")
    print("=" * 65)
    print("       AI VOICE PATIENT CASE TAKING")
    print("=" * 65)

    conversation = ""

    # --------------------------------------------------------
    # QUESTION 1
    # --------------------------------------------------------

    question = (
        "Ungalukku wheelchair facility thevaiya?"
    )

    answer = ask_question(question)

    if answer is None:
        return

    conversation += (
        f"Question: {question}\n"
        f"Patient: {answer}\n\n"
    )

    # --------------------------------------------------------
    # QUESTION 2
    # --------------------------------------------------------

    question = (
        "Ungalukku assistant help venum ah?"
    )

    answer = ask_question(question)

    if answer is None:
        return

    conversation += (
        f"Question: {question}\n"
        f"Patient: {answer}\n\n"
    )

    # --------------------------------------------------------
    # QUESTION 3
    # --------------------------------------------------------

    question = (
        "Ungalukku enna problem irukku?"
    )

    answer = ask_question(question)

    if answer is None:
        return

    conversation += (
        f"Question: {question}\n"
        f"Patient: {answer}\n\n"
    )

    # --------------------------------------------------------
    # AI FOLLOW-UP QUESTIONS
    # --------------------------------------------------------

    for number in range(
        1,
        MAX_QUESTIONS + 1
    ):

        print("\n")
        print("=" * 65)

        print(
            f"AI FOLLOW-UP "
            f"{number}/{MAX_QUESTIONS}"
        )

        print("=" * 65)

        question = generate_next_question(
            conversation
        )

        if question is None:

            print(
                "\n⚠️ Interview stopped."
            )

            break

        if question.strip().upper() == "END_INTERVIEW":

            print(
                "\n✅ Gemini has collected "
                "enough relevant history."
            )

            break

        answer = ask_question(question)

        if answer is None:

            print(
                "\n⚠️ Interview stopped."
            )

            break

        conversation += (
            f"Question: {question}\n"
            f"Patient: {answer}\n\n"
        )

    # --------------------------------------------------------
    # COMPLETED
    # --------------------------------------------------------

    print("\n")
    print("=" * 65)
    print("       CASE TAKING COMPLETED")
    print("=" * 65)

    print("\nComplete conversation:")
    print(conversation)

    speak(
        "Seri, unga case taking "
        "mudinjiduchu. Thank you."
    )


# ============================================================
# START
# ============================================================

if __name__ == "__main__":

    try:

        start_voice_case()

    except KeyboardInterrupt:

        print(
            "\nInterview stopped."
        )

    except Exception as e:

        print(
            "\n❌ Program error:"
        )

        print(
            type(e).__name__,
            e
        )