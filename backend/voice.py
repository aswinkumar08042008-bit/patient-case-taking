import os
import base64
import io
import wave

from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

# ============================================================
# GEMINI SETUP
# ============================================================



AI_MODEL = "gemini-3.5-flash-lite"
TRANSCRIBE_MODEL = "gemini-3.5-transcribe"
TTS_MODEL = "gemini-3.1-flash-tts-preview"


# ============================================================
# SETTINGS
# ============================================================

MAX_QUESTIONS = 15


# ============================================================
# SPEECH TO TEXT
# ============================================================

def transcribe_audio(audio_bytes: bytes, mime_type: str = "audio/webm"):
    """
    Convert patient's browser voice recording into text.
    Supports Tamil, Tanglish and English.
    """

    try:
        response = client.models.generate_content(
            model=TRANSCRIBE_MODEL,
            contents=[
                {
                    "inline_data": {
                        "mime_type": mime_type,
                        "data": audio_bytes,
                    }
                },
                {
                    "text": """
Transcribe exactly what the patient said.

The patient may speak:
- Tamil
- Tanglish
- English

Rules:
- Do not translate.
- Do not summarize.
- Do not diagnose.
- Do not add information.
- Return only the patient's spoken words.
"""
                },
            ],
        )
        print("TRANSCRIPTION PARTS:", response.candidates[0].content.parts)
        text=None

        for part in response.candidates[0].content.parts:
            transcription = getattr(part, "audio_transcription", None)

            if transcription:
                text = getattr(transcription, "text", None)
                if text:
                    break

                
        if not text:
            return None

        return text.strip()
       

    except Exception as e:
        print(
            "Speech recognition error:",
            type(e).__name__,
            e
        )
        return None

# ============================================================
# GENERATE NEXT MEDICAL QUESTION
# ============================================================
def generate_next_question(conversation: str):

    prompt = f"""
You are MediVoice.

You are talking to an Indian patient.

Your job is to ask ONE question at a time to collect medical history.

VERY IMPORTANT LANGUAGE RULE:

Always ask the question in CASUAL SPOKEN TANGLISH.

Tanglish = Tamil spoken naturally using English letters.

Examples of the EXACT style you should use:

Ungalukku enna problem irukku?
Idhu eppo lendhu irukku?
Pain enga irukku?
Pain evlo jaasthi-a irukku?
Idhu sudden-a start aacha?
Vomiting edhavadhu irukka?
Fever irukka?
Idhukku munnadi ippadi problem vandhurukka?

NEVER use formal English.

NEVER ask questions like:

Can you describe how you are feeling?
How long have you been experiencing this?
Are you experiencing any symptoms?
Could you tell me more about your condition?

If you create a formal English question, STOP and rewrite it in casual Tanglish.

For example:

Can you describe how you are feeling?
MUST become:
Ungalukku epdi feel aagudhu?

How long have you been experiencing this?
MUST become:
Idhu eppo lendhu irukku?

Where is the pain?
MUST become:
Pain enga irukku?

Rules:

- Ask ONLY ONE question.
- Keep it SHORT.
- Use casual spoken Tanglish.
- Use simple English medical words when natural.
- Do not diagnose.
- Do not give advice.
- Do not suggest medicines.
- Do not repeat an already answered question.
- Use the patient's previous answer to decide the next question.
- Return ONLY the question.
- No "Question:".
- No numbering.
- No explanation.
- No Markdown.

Previous conversation:

{conversation}

Now ask the next question in casual spoken Tanglish.

If enough information has been collected, return exactly:

END_INTERVIEW

Otherwise return ONLY ONE short Tanglish question.
"""

    try:
        response = client.models.generate_content(
            model=AI_MODEL,
            contents=prompt,
        )

        question = response.text.strip()

        if not question:
            return None

        return question

    except Exception as e:
        print(
            "Gemini question error:",
            type(e).__name__,
            e
        )
        return None

# ============================================================
# TEXT TO SPEECH
# ============================================================

def text_to_speech(text: str):
    """
    Convert AI question into audio that can be played
    by the patient's browser.
    """

    try:

        tts_prompt = f"""
Speak this question to a patient.

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
        print("TTS RESPONSE:", response)
        audio_data = response.output_audio.data

        if isinstance(audio_data, str):
            pcm_bytes = base64.b64decode(audio_data)
        else:
            pcm_bytes = audio_data

        # Gemini TTS returns PCM audio.
        # Convert it to WAV so the browser can play it.
        wav_buffer = io.BytesIO()

        with wave.open(wav_buffer, "wb") as wav_file:
            wav_file.setnchannels(1)
            wav_file.setsampwidth(2)
            wav_file.setframerate(24000)
            wav_file.writeframes(pcm_bytes)

        wav_buffer.seek(0)

        return wav_buffer.read()

    except Exception as e:
        print("TTS error:", type(e).__name__, e)
        return None


# ============================================================
# FIRST QUESTION
# ============================================================

def get_first_question():
    """
    First question shown when voice case-taking starts.
    """

    return "Ungalukku enna problem irukku?"


# ============================================================
# COMPLETE VOICE CASE LOGIC
# ============================================================

def process_patient_answer(
    conversation: str,
    patient_answer: str,
):
    """
    Add patient's answer and ask Gemini for the next question.
    """

    conversation += (
        f"Patient: {patient_answer}\n\n"
    )

    question = generate_next_question(conversation)

    if question is None:
        return {
            "conversation": conversation,
            "question": None,
            "completed": False,
        }

    if question.strip().upper() == "END_INTERVIEW":
        return {
            "conversation": conversation,
            "question": None,
            "completed": True,
        }

    conversation += (
        f"AI: {question}\n\n"
    )

    return {
        "conversation": conversation,
        "question": question,
        "completed": False,
    }