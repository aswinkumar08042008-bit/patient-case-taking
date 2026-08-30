import { useState ,useRef,useEffect} from "react";
import {
  Stethoscope,
  ArrowRight,
  HeartPulse,
  ShieldCheck,
  ArrowLeft,
  Check,
  Bot,
  Send,
  Mic,
  User,
  X,
} from "lucide-react";

import "./App.css";

function PatientInterface() {


  const [page, setPage] = useState("welcome");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [patientDetails, setPatientDetails] = useState({
  fullName: "",
  age: "",
  gender: "",
  phoneNumber: "",
});

  const [messages, setMessages] = useState([]);
  const [documents, setDocuments] = useState({
  prescription: null,
  labReports: null,
  dischargeSummary: null,
  otherDocuments: null,
});
const handleDocumentUpload = (type, file) => {
  setDocuments((prev) => ({
    ...prev,
    [type]: file,
  }));
};
const translations = {
  English: {
    getStarted: "Get Started",
    login: "Log In",
    continue: "Continue",
    back: "Back",

    chooseLanguage: "Choose Your Language",
    selectLanguage:
      "Select your preferred language to continue your health assessment.",

    patientDetails: "Tell Us About Yourself",
    patientDetailsDesc:
      "Please provide your basic details before starting your health assessment.",
    fullName: "Full Name",
    enterFullName: "Enter your full name",
    age: "Age",
    enterAge: "Enter age",
    gender: "Gender",
    selectGender: "Select",
    male: "Male",
    female: "Female",
    preferNotToSay: "Prefer not to say",
    phoneNumber: "Phone Number",
    enterPhone: "Enter your phone number",

    privacyTitle: "Your Privacy Matters",
    privacyDesc:
      "Before starting your health assessment, please review and provide your consent.",
    agreeContinue: "I Agree & Continue",

    medicalHistory: "Medical History",
    uploadDocuments: "Upload Medical Documents",
    skipForNow: "Skip for now",

    review: "Review Your Health Information",
    submitCase: "Submit Case",
    caseSubmitted: "Case Submitted Successfully!",
    aiAssistantOnline: "AI Assistant Online",
exit: "Exit",
send: "Send",
aiGreeting: "Hello! I'm MediVoice, your AI health assistant.",
firstQuestion: "What brings you to the hospital today?",
question1: "When did this problem start?",
question2: "Can you describe how you are feeling?",
question3: "Do you have any other symptoms?",
question4: "Have you taken any medicine for this problem?",
caseCollected: "Thank you. I have collected the initial information.",
continueMedicalHistory: "Continue to Medical History",
medicalHistoryDesc:
  "Please provide any previous medical information you know.",
previousConditions: "Previous Medical Conditions",
previousConditionsPlaceholder:
  "For example: Diabetes, asthma, blood pressure, or leave blank if none",

currentMedicines: "Current Medicines",
currentMedicinesPlaceholder:
  "Enter any medicines you are currently taking, or leave blank if none",

allergies: "Allergies",
allergiesPlaceholder:
  "Enter any known allergies, or leave blank if none",

previousSurgeries: "Previous Surgeries or Hospitalizations",
surgeriesPlaceholder:
  "Enter details, or leave blank if none",
  uploadDocumentsTitle: "Upload Medical Documents",
uploadDocumentsDesc:
  "You can upload any medical documents that may help your doctor understand your health history.",

prescription: "Prescription",
prescriptionDesc: "Upload previous prescriptions",

labReports: "Lab Reports",
labReportsDesc: "Blood tests, scans or other reports",

dischargeSummary: "Discharge Summary",
dischargeSummaryDesc: "Upload previous hospital records",

otherDocuments: "Other Documents",
otherDocumentsDesc: "Any other relevant medical documents",

uploadSkipText:
  "You can skip this step if you don't have any documents.",
  reviewTitle: "Review Your Health Information",
reviewDesc:
  "Please review the information collected before submitting your case.",

currentHealthConcern: "Current Health Concern",
healthConcernText:
  "Information collected during the AI case-taking conversation will appear here.",

reviewMedicalHistory: "Medical History",
medicalHistoryReviewText:
  "Previous medical conditions, medicines, allergies and surgery information will appear here.",

medicalDocuments: "Medical Documents",
medicalDocumentsText:
  "Uploaded prescriptions, lab reports and other medical documents will be listed here.",

reviewNote:
  "Your information will be organized into a structured summary for the doctor.",

caseReady: "Case Ready",
caseReadyDesc:
  "Your case summary is ready for the doctor.",

secureInformation: "Secure Information",
secureInformationDesc:
  "Your medical information is handled securely.",

structuredSummary: "Structured Summary",
structuredSummaryDesc:
  "Your responses have been organized for review.",

submittedDesc:
  "Your health information has been collected and organized into a structured case summary.",

backToHome: "Back to Home",
chatDescription: "I'm here to understand your health concern.",
typeAnswer: "Type your answer...",
voiceInput: "Voice input",
casePrivacyNote:
  "Your responses will be used only to prepare your medical case summary.",
  },

  "தமிழ்": {
    getStarted: "தொடங்குங்கள்",
    login: "உள்நுழைக",
    continue: "தொடரவும்",
    back: "பின்செல்",

    chooseLanguage: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
    selectLanguage:
      "உங்கள் உடல்நல மதிப்பீட்டைத் தொடர விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்.",

    patientDetails: "உங்களைப் பற்றி கூறுங்கள்",
    patientDetailsDesc:
      "உங்கள் உடல்நல மதிப்பீட்டைத் தொடங்குவதற்கு முன் அடிப்படை விவரங்களை வழங்கவும்.",
    fullName: "முழு பெயர்",
    enterFullName: "உங்கள் முழு பெயரை உள்ளிடவும்",
    age: "வயது",
    enterAge: "வயதை உள்ளிடவும்",
    gender: "பாலினம்",
    selectGender: "தேர்ந்தெடுக்கவும்",
    male: "ஆண்",
    female: "பெண்",
    preferNotToSay: "கூற விரும்பவில்லை",
    phoneNumber: "தொலைபேசி எண்",
    enterPhone: "உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்",

    privacyTitle: "உங்கள் தனியுரிமை முக்கியமானது",
    privacyDesc:
      "உங்கள் உடல்நல மதிப்பீட்டைத் தொடங்குவதற்கு முன் தகவல்களைப் படித்து உங்கள் ஒப்புதலை வழங்கவும்.",
    agreeContinue: "ஒப்புக்கொண்டு தொடரவும்",

    medicalHistory: "மருத்துவ வரலாறு",
    uploadDocuments: "மருத்துவ ஆவணங்களை பதிவேற்றவும்",
    skipForNow: "இப்போது தவிர்க்கவும்",

    review: "உங்கள் உடல்நல தகவலை சரிபார்க்கவும்",
    submitCase: "வழக்கை சமர்ப்பிக்கவும்",
    caseSubmitted: "வழக்கு வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!",
    aiAssistantOnline: "AI உதவியாளர் ஆன்லைனில் உள்ளார்",
exit: "வெளியேறு",
send: "அனுப்பு",
aiGreeting: "வணக்கம்! நான் உங்கள் MediVoice AI உடல்நல உதவியாளர்.",
firstQuestion: "இன்று உங்களை மருத்துவமனைக்கு வரச் செய்த பிரச்சனை என்ன?",
question1: "இந்த பிரச்சனை எப்போது தொடங்கியது?",
question2: "நீங்கள் எப்படி உணர்கிறீர்கள் என்பதை விவரிக்க முடியுமா?",
question3: "உங்களுக்கு வேறு ஏதேனும் அறிகுறிகள் உள்ளதா?",
question4: "இந்த பிரச்சனைக்காக ஏதேனும் மருந்து எடுத்துள்ளீர்களா?",
caseCollected: "நன்றி. ஆரம்ப தகவல்கள் சேகரிக்கப்பட்டுள்ளன.",
continueMedicalHistory: "மருத்துவ வரலாற்றிற்கு தொடரவும்",
medicalHistoryDesc:
  "உங்களுக்கு தெரிந்த முந்தைய மருத்துவ தகவல்களை வழங்கவும்.",

previousConditions: "முந்தைய உடல்நல பிரச்சனைகள்",
previousConditionsPlaceholder:
  "உதாரணம்: நீரிழிவு, ஆஸ்துமா, இரத்த அழுத்தம் அல்லது எதுவும் இல்லை என்றால் காலியாக விடவும்",

currentMedicines: "தற்போது எடுத்துக்கொள்ளும் மருந்துகள்",
currentMedicinesPlaceholder:
  "நீங்கள் தற்போது எடுத்துக்கொள்ளும் மருந்துகளை உள்ளிடவும் அல்லது எதுவும் இல்லை என்றால் காலியாக விடவும்",

allergies: "ஒவ்வாமைகள்",
allergiesPlaceholder:
  "உங்களுக்கு தெரிந்த ஒவ்வாமைகளை உள்ளிடவும் அல்லது எதுவும் இல்லை என்றால் காலியாக விடவும்",

previousSurgeries: "முந்தைய அறுவை சிகிச்சைகள் அல்லது மருத்துவமனை அனுமதிகள்",
surgeriesPlaceholder:
  "விவரங்களை உள்ளிடவும் அல்லது எதுவும் இல்லை என்றால் காலியாக விடவும்",
  uploadDocumentsTitle: "மருத்துவ ஆவணங்களை பதிவேற்றவும்",
uploadDocumentsDesc:
  "உங்கள் உடல்நல வரலாற்றைப் புரிந்துகொள்ள மருத்துவருக்கு உதவும் மருத்துவ ஆவணங்களை பதிவேற்றலாம்.",

prescription: "மருந்துச்சீட்டு",
prescriptionDesc: "முந்தைய மருந்துச்சீட்டுகளை பதிவேற்றவும்",

labReports: "ஆய்வக அறிக்கைகள்",
labReportsDesc: "இரத்த பரிசோதனை, ஸ்கேன் அல்லது பிற அறிக்கைகள்",

dischargeSummary: "மருத்துவமனை வெளியேற்ற சுருக்கம்",
dischargeSummaryDesc: "முந்தைய மருத்துவமனை பதிவுகளை பதிவேற்றவும்",

otherDocuments: "பிற ஆவணங்கள்",
otherDocumentsDesc: "பிற தொடர்புடைய மருத்துவ ஆவணங்கள்",

uploadSkipText:
  "உங்களிடம் ஆவணங்கள் இல்லையெனில் இந்த படியை தவிர்க்கலாம்.",
  reviewTitle: "உங்கள் உடல்நல தகவலை சரிபார்க்கவும்",
reviewDesc:
  "உங்கள் வழக்கை சமர்ப்பிப்பதற்கு முன் சேகரிக்கப்பட்ட தகவல்களை சரிபார்க்கவும்.",

currentHealthConcern: "தற்போதைய உடல்நல பிரச்சனை",
healthConcernText:
  "AI மூலம் சேகரிக்கப்பட்ட உங்கள் உடல்நல தகவல்கள் இங்கே காண்பிக்கப்படும்.",

reviewMedicalHistory: "மருத்துவ வரலாறு",
medicalHistoryReviewText:
  "முந்தைய உடல்நல பிரச்சனைகள், மருந்துகள், ஒவ்வாமைகள் மற்றும் அறுவை சிகிச்சை தகவல்கள் இங்கே காண்பிக்கப்படும்.",

medicalDocuments: "மருத்துவ ஆவணங்கள்",
medicalDocumentsText:
  "பதிவேற்றப்பட்ட மருந்துச்சீட்டுகள், ஆய்வக அறிக்கைகள் மற்றும் பிற மருத்துவ ஆவணங்கள் இங்கே பட்டியலிடப்படும்.",

reviewNote:
  "உங்கள் தகவல்கள் மருத்துவருக்காக ஒரு கட்டமைக்கப்பட்ட சுருக்கமாக ஒழுங்குபடுத்தப்படும்.",

caseReady: "வழக்கு தயாராக உள்ளது",
caseReadyDesc:
  "உங்கள் வழக்கு சுருக்கம் மருத்துவருக்காக தயாராக உள்ளது.",

secureInformation: "பாதுகாப்பான தகவல்",
secureInformationDesc:
  "உங்கள் மருத்துவ தகவல்கள் பாதுகாப்பாக கையாளப்படுகின்றன.",

structuredSummary: "கட்டமைக்கப்பட்ட சுருக்கம்",
structuredSummaryDesc:
  "உங்கள் பதில்கள் சரிபார்ப்பதற்காக ஒழுங்குபடுத்தப்பட்டுள்ளன.",

submittedDesc:
  "உங்கள் உடல்நல தகவல்கள் சேகரிக்கப்பட்டு ஒரு கட்டமைக்கப்பட்ட வழக்கு சுருக்கமாக ஒழுங்குபடுத்தப்பட்டுள்ளன.",

backToHome: "முகப்புப் பக்கத்திற்கு திரும்பவும்",
chatDescription: "உங்கள் உடல்நல பிரச்சனையைப் புரிந்துகொள்ள நான் இங்கே இருக்கிறேன்.",
typeAnswer: "உங்கள் பதிலை உள்ளிடவும்...",
voiceInput: "குரல் உள்ளீடு",
casePrivacyNote:
  "உங்கள் பதில்கள் உங்கள் மருத்துவ வழக்கு சுருக்கத்தைத் தயாரிக்க மட்டுமே பயன்படுத்தப்படும்.",
  },

  "हिन्दी": {
    getStarted: "शुरू करें",
    login: "लॉग इन",
    continue: "जारी रखें",
    back: "वापस",

    chooseLanguage: "अपनी भाषा चुनें",
    selectLanguage:
      "अपना स्वास्थ्य मूल्यांकन जारी रखने के लिए अपनी पसंदीदा भाषा चुनें।",

    patientDetails: "अपने बारे में बताएं",
    patientDetailsDesc:
      "स्वास्थ्य मूल्यांकन शुरू करने से पहले अपनी बुनियादी जानकारी दें।",
    fullName: "पूरा नाम",
    enterFullName: "अपना पूरा नाम दर्ज करें",
    age: "उम्र",
    enterAge: "उम्र दर्ज करें",
    gender: "लिंग",
    selectGender: "चुनें",
    male: "पुरुष",
    female: "महिला",
    preferNotToSay: "नहीं बताना चाहते",
    phoneNumber: "फ़ोन नंबर",
    enterPhone: "अपना फ़ोन नंबर दर्ज करें",

    privacyTitle: "आपकी गोपनीयता महत्वपूर्ण है",
    privacyDesc:
      "स्वास्थ्य मूल्यांकन शुरू करने से पहले जानकारी पढ़ें और अपनी सहमति दें।",
    agreeContinue: "सहमत हूं और जारी रखें",

    medicalHistory: "चिकित्सा इतिहास",
    uploadDocuments: "चिकित्सा दस्तावेज़ अपलोड करें",
    skipForNow: "अभी छोड़ें",

    review: "अपनी स्वास्थ्य जानकारी देखें",
    submitCase: "केस जमा करें",
    caseSubmitted: "केस सफलतापूर्वक जमा किया गया!",
    aiAssistantOnline: "AI सहायक ऑनलाइन है",
exit: "बाहर निकलें",
send: "भेजें",
aiGreeting: "नमस्ते! मैं आपका MediVoice AI स्वास्थ्य सहायक हूँ।",
firstQuestion: "आज आपको अस्पताल आने की आवश्यकता क्यों पड़ी?",
question1: "यह समस्या कब शुरू हुई?",
question2: "क्या आप बता सकते हैं कि आप कैसा महसूस कर रहे हैं?",
question3: "क्या आपको कोई अन्य लक्षण हैं?",
question4: "क्या आपने इस समस्या के लिए कोई दवा ली है?",
caseCollected: "धन्यवाद। प्रारंभिक जानकारी एकत्र कर ली गई है।",
continueMedicalHistory: "चिकित्सा इतिहास जारी रखें",
medicalHistoryDesc:
  "कृपया अपनी पिछली चिकित्सा जानकारी प्रदान करें।",

previousConditions: "पिछली स्वास्थ्य समस्याएं",
previousConditionsPlaceholder:
  "उदाहरण: मधुमेह, अस्थमा, रक्तचाप या यदि कुछ नहीं है तो खाली छोड़ दें",

currentMedicines: "वर्तमान दवाएं",
currentMedicinesPlaceholder:
  "जो दवाएं आप वर्तमान में ले रहे हैं उन्हें दर्ज करें, या यदि कोई नहीं है तो खाली छोड़ दें",

allergies: "एलर्जी",
allergiesPlaceholder:
  "किसी ज्ञात एलर्जी की जानकारी दें, या यदि कोई नहीं है तो खाली छोड़ दें",

previousSurgeries: "पिछली सर्जरी या अस्पताल में भर्ती",
surgeriesPlaceholder:
  "विवरण दर्ज करें, या यदि कुछ नहीं है तो खाली छोड़ दें",
  uploadDocumentsTitle: "चिकित्सा दस्तावेज़ अपलोड करें",
uploadDocumentsDesc:
  "आप ऐसे चिकित्सा दस्तावेज़ अपलोड कर सकते हैं जो डॉक्टर को आपके स्वास्थ्य इतिहास को समझने में मदद करें।",

prescription: "दवा पर्ची",
prescriptionDesc: "पुराने दवा पर्चे अपलोड करें",

labReports: "लैब रिपोर्ट",
labReportsDesc: "रक्त परीक्षण, स्कैन या अन्य रिपोर्ट",

dischargeSummary: "डिस्चार्ज सारांश",
dischargeSummaryDesc: "पुराने अस्पताल रिकॉर्ड अपलोड करें",

otherDocuments: "अन्य दस्तावेज़",
otherDocumentsDesc: "कोई अन्य संबंधित चिकित्सा दस्तावेज़",

uploadSkipText:
  "यदि आपके पास कोई दस्तावेज़ नहीं है तो आप इस चरण को छोड़ सकते हैं।",
  reviewTitle: "अपनी स्वास्थ्य जानकारी की समीक्षा करें",
reviewDesc:
  "अपना केस जमा करने से पहले एकत्र की गई जानकारी की समीक्षा करें।",

currentHealthConcern: "वर्तमान स्वास्थ्य समस्या",
healthConcernText:
  "AI केस-टेकिंग बातचीत के दौरान एकत्र की गई जानकारी यहां दिखाई देगी।",

reviewMedicalHistory: "चिकित्सा इतिहास",
medicalHistoryReviewText:
  "पिछली स्वास्थ्य समस्याएं, दवाएं, एलर्जी और सर्जरी की जानकारी यहां दिखाई देगी।",

medicalDocuments: "चिकित्सा दस्तावेज़",
medicalDocumentsText:
  "अपलोड किए गए पर्चे, लैब रिपोर्ट और अन्य चिकित्सा दस्तावेज़ यहां सूचीबद्ध होंगे।",

reviewNote:
  "आपकी जानकारी डॉक्टर के लिए एक संरचित सारांश में व्यवस्थित की जाएगी।",

caseReady: "केस तैयार है",
caseReadyDesc:
  "आपका केस सारांश डॉक्टर के लिए तैयार है।",

secureInformation: "सुरक्षित जानकारी",
secureInformationDesc:
  "आपकी चिकित्सा जानकारी सुरक्षित रूप से संभाली जाती है।",

structuredSummary: "संरचित सारांश",
structuredSummaryDesc:
  "आपके उत्तर समीक्षा के लिए व्यवस्थित किए गए हैं।",

submittedDesc:
  "आपकी स्वास्थ्य जानकारी एकत्र करके एक संरचित केस सारांश में व्यवस्थित की गई है।",

backToHome: "होम पर वापस जाएं",
chatDescription: "मैं आपकी स्वास्थ्य समस्या को समझने में आपकी सहायता करने के लिए यहां हूं।",
typeAnswer: "अपना उत्तर दर्ज करें...",
voiceInput: "आवाज़ इनपुट",
casePrivacyNote:
  "आपके उत्तरों का उपयोग केवल आपके चिकित्सा केस सारांश को तैयार करने के लिए किया जाएगा।",
  },

  "മലയാളം": {
    getStarted: "ആരംഭിക്കുക",
    login: "ലോഗിൻ",
    continue: "തുടരുക",
    back: "തിരികെ",

    chooseLanguage: "നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക",
    selectLanguage:
      "നിങ്ങളുടെ ആരോഗ്യ വിലയിരുത്തൽ തുടരാൻ ഇഷ്ടമുള്ള ഭാഷ തിരഞ്ഞെടുക്കുക.",

    patientDetails: "നിങ്ങളെക്കുറിച്ച് പറയൂ",
    patientDetailsDesc:
      "ആരോഗ്യ വിലയിരുത്തൽ ആരംഭിക്കുന്നതിന് മുമ്പ് അടിസ്ഥാന വിവരങ്ങൾ നൽകുക.",
    fullName: "പൂർണ്ണ പേര്",
    enterFullName: "നിങ്ങളുടെ പൂർണ്ണ പേര് നൽകുക",
    age: "പ്രായം",
    enterAge: "പ്രായം നൽകുക",
    gender: "ലിംഗം",
    selectGender: "തിരഞ്ഞെടുക്കുക",
    male: "പുരുഷൻ",
    female: "സ്ത്രീ",
    preferNotToSay: "പറയാൻ താൽപര്യമില്ല",
    phoneNumber: "ഫോൺ നമ്പർ",
    enterPhone: "നിങ്ങളുടെ ഫോൺ നമ്പർ നൽകുക",

    privacyTitle: "നിങ്ങളുടെ സ്വകാര്യത പ്രധാനമാണ്",
    privacyDesc:
      "ആരോഗ്യ വിലയിരുത്തൽ ആരംഭിക്കുന്നതിന് മുമ്പ് വിവരങ്ങൾ വായിച്ച് സമ്മതം നൽകുക.",
    agreeContinue: "സമ്മതിച്ച് തുടരുക",

    medicalHistory: "മെഡിക്കൽ ചരിത്രം",
    uploadDocuments: "മെഡിക്കൽ രേഖകൾ അപ്‌ലോഡ് ചെയ്യുക",
    skipForNow: "ഇപ്പോൾ ഒഴിവാക്കുക",

    review: "നിങ്ങളുടെ ആരോഗ്യ വിവരങ്ങൾ പരിശോധിക്കുക",
    submitCase: "കേസ് സമർപ്പിക്കുക",
    caseSubmitted: "കേസ് വിജയകരമായി സമർപ്പിച്ചു!",
    aiAssistantOnline: "AI സഹായി ഓൺലൈനിലാണ്",
exit: "പുറത്തുകടക്കുക",
send: "അയയ്ക്കുക",
aiGreeting: "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ MediVoice AI ആരോഗ്യ സഹായി ആണ്.",
firstQuestion: "ഇന്ന് നിങ്ങളെ ആശുപത്രിയിലെത്തിച്ചത് എന്താണ്?",
question1: "ഈ പ്രശ്നം എപ്പോഴാണ് ആരംഭിച്ചത്?",
question2: "നിങ്ങൾക്ക് എങ്ങനെ തോന്നുന്നുവെന്ന് വിവരിക്കാമോ?",
question3: "നിങ്ങൾക്ക് മറ്റേതെങ്കിലും ലക്ഷണങ്ങളുണ്ടോ?",
question4: "ഈ പ്രശ്നത്തിനായി എന്തെങ്കിലും മരുന്ന് കഴിച്ചിട്ടുണ്ടോ?",
caseCollected: "നന്ദി. പ്രാഥമിക വിവരങ്ങൾ ശേഖരിച്ചിട്ടുണ്ട്.",
continueMedicalHistory: "മെഡിക്കൽ ചരിത്രത്തിലേക്ക് തുടരുക",
medicalHistoryDesc:
  "നിങ്ങൾക്ക് അറിയാവുന്ന മുൻകാല മെഡിക്കൽ വിവരങ്ങൾ നൽകുക.",

previousConditions: "മുൻകാല ആരോഗ്യ പ്രശ്നങ്ങൾ",
previousConditionsPlaceholder:
  "ഉദാഹരണം: പ്രമേഹം, ആസ്ത്മ, രക്തസമ്മർദ്ദം അല്ലെങ്കിൽ ഒന്നുമില്ലെങ്കിൽ ഒഴിവാക്കുക",

currentMedicines: "നിലവിൽ കഴിക്കുന്ന മരുന്നുകൾ",
currentMedicinesPlaceholder:
  "നിങ്ങൾ ഇപ്പോൾ കഴിക്കുന്ന മരുന്നുകൾ നൽകുക അല്ലെങ്കിൽ ഒന്നുമില്ലെങ്കിൽ ഒഴിവാക്കുക",

allergies: "അലർജികൾ",
allergiesPlaceholder:
  "അറിയാവുന്ന അലർജികൾ നൽകുക അല്ലെങ്കിൽ ഒന്നുമില്ലെങ്കിൽ ഒഴിവാക്കുക",

previousSurgeries: "മുൻകാല ശസ്ത്രക്രിയകൾ അല്ലെങ്കിൽ ആശുപത്രിവാസം",
surgeriesPlaceholder:
  "വിശദാംശങ്ങൾ നൽകുക അല്ലെങ്കിൽ ഒന്നുമില്ലെങ്കിൽ ഒഴിവാക്കുക",
  uploadDocumentsTitle: "മെഡിക്കൽ രേഖകൾ അപ്‌ലോഡ് ചെയ്യുക",
uploadDocumentsDesc:
  "നിങ്ങളുടെ ആരോഗ്യ ചരിത്രം മനസ്സിലാക്കാൻ ഡോക്ടറെ സഹായിക്കുന്ന മെഡിക്കൽ രേഖകൾ അപ്‌ലോഡ് ചെയ്യാം.",

prescription: "കുറിപ്പടി",
prescriptionDesc: "മുൻകാല കുറിപ്പടികൾ അപ്‌ലോഡ് ചെയ്യുക",

labReports: "ലാബ് റിപ്പോർട്ടുകൾ",
labReportsDesc: "രക്തപരിശോധന, സ്കാൻ അല്ലെങ്കിൽ മറ്റ് റിപ്പോർട്ടുകൾ",

dischargeSummary: "ഡിസ്ചാർജ് സംഗ്രഹം",
dischargeSummaryDesc: "മുൻകാല ആശുപത്രി രേഖകൾ അപ്‌ലോഡ് ചെയ്യുക",

otherDocuments: "മറ്റ് രേഖകൾ",
otherDocumentsDesc: "മറ്റ് ബന്ധപ്പെട്ട മെഡിക്കൽ രേഖകൾ",

uploadSkipText:
  "നിങ്ങളുടെ കൈയിൽ രേഖകളൊന്നുമില്ലെങ്കിൽ ഈ ഘട്ടം ഒഴിവാക്കാം.",
  reviewTitle: "നിങ്ങളുടെ ആരോഗ്യ വിവരങ്ങൾ പരിശോധിക്കുക",
reviewDesc:
  "കേസ് സമർപ്പിക്കുന്നതിന് മുമ്പ് ശേഖരിച്ച വിവരങ്ങൾ പരിശോധിക്കുക.",

currentHealthConcern: "നിലവിലെ ആരോഗ്യ പ്രശ്നം",
healthConcernText:
  "AI കേസ്-ടേക്കിംഗ് സംഭാഷണത്തിലൂടെ ശേഖരിച്ച വിവരങ്ങൾ ഇവിടെ കാണിക്കും.",

reviewMedicalHistory: "മെഡിക്കൽ ചരിത്രം",
medicalHistoryReviewText:
  "മുൻകാല ആരോഗ്യ പ്രശ്നങ്ങൾ, മരുന്നുകൾ, അലർജികൾ, ശസ്ത്രക്രിയ വിവരങ്ങൾ എന്നിവ ഇവിടെ കാണിക്കും.",

medicalDocuments: "മെഡിക്കൽ രേഖകൾ",
medicalDocumentsText:
  "അപ്‌ലോഡ് ചെയ്ത കുറിപ്പടികൾ, ലാബ് റിപ്പോർട്ടുകൾ, മറ്റ് മെഡിക്കൽ രേഖകൾ എന്നിവ ഇവിടെ കാണിക്കും.",

reviewNote:
  "നിങ്ങളുടെ വിവരങ്ങൾ ഡോക്ടർക്കായി ഒരു ക്രമീകരിച്ച സംഗ്രഹമായി തയ്യാറാക്കപ്പെടും.",

caseReady: "കേസ് തയ്യാറാണ്",
caseReadyDesc:
  "നിങ്ങളുടെ കേസ് സംഗ്രഹം ഡോക്ടർക്കായി തയ്യാറാണ്.",

secureInformation: "സുരക്ഷിത വിവരങ്ങൾ",
secureInformationDesc:
  "നിങ്ങളുടെ മെഡിക്കൽ വിവരങ്ങൾ സുരക്ഷിതമായി കൈകാര്യം ചെയ്യപ്പെടുന്നു.",

structuredSummary: "ക്രമീകരിച്ച സംഗ്രഹം",
structuredSummaryDesc:
  "നിങ്ങളുടെ ഉത്തരങ്ങൾ പരിശോധനയ്ക്കായി ക്രമീകരിച്ചിരിക്കുന്നു.",

submittedDesc:
  "നിങ്ങളുടെ ആരോഗ്യ വിവരങ്ങൾ ശേഖരിച്ച് ഒരു ക്രമീകരിച്ച കേസ് സംഗ്രഹമായി തയ്യാറാക്കിയിരിക്കുന്നു.",

backToHome: "ഹോം പേജിലേക്ക് മടങ്ങുക",
chatDescription: "നിങ്ങളുടെ ആരോഗ്യ പ്രശ്നം മനസ്സിലാക്കാൻ ഞാൻ ഇവിടെ ഉണ്ട്.",
typeAnswer: "നിങ്ങളുടെ ഉത്തരം നൽകുക...",
voiceInput: "വോയ്സ് ഇൻപുട്ട്",
casePrivacyNote:
  "നിങ്ങളുടെ മെഡിക്കൽ കേസ് സംഗ്രഹം തയ്യാറാക്കാൻ മാത്രമേ നിങ്ങളുടെ ഉത്തരങ്ങൾ ഉപയോഗിക്കൂ.",
  },
};

const t = translations[selectedLanguage] || translations.English;
useEffect(() => {
  if (selectedLanguage) {
    setMessages([
      {
        sender: "ai",
        text: t.aiGreeting,
      },
      {
        sender: "ai",
        text: t.firstQuestion,
      },
    ]);

    setQuestionStep(0);
    setCaseCompleted(false);
  }
}, [selectedLanguage]);
const [answer, setAnswer] = useState("");
const [isListening, setIsListening] = useState(false);
const [questionStep, setQuestionStep] = useState(0);
const [caseCompleted, setCaseCompleted] = useState(false);
const messagesEndRef = useRef(null);
const [previousConditions, setPreviousConditions] = useState("");
const [currentMedicines, setCurrentMedicines] = useState("");
const [allergies, setAllergies] = useState("");
const [previousSurgeries, setPreviousSurgeries] = useState("");
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages]);
  

  const languages = [
    { name: "தமிழ்", sub: "Tamil" },
    { name: "English", sub: "English" },
    { name: "हिन्दी", sub: "Hindi" },
    { name: "മലയാളം", sub: "Malayalam" },
  ];
const handleSend = () => {
  if (!answer.trim()) return;

  const userAnswer = answer;

  setMessages((prev) => [
    ...prev,
    {
      sender: "user",
      text: userAnswer,
    },
  ]);

  setAnswer("");

 const questions = [
  t.question1,
  t.question2,
  t.question3,
  t.question4,
];

setTimeout(() => {
  const nextQuestion = questions[questionStep];

  if (nextQuestion) {
    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: nextQuestion,
      },
    ]);

    setQuestionStep((prev) => prev + 1);
  } else {
    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: t.caseCollected,
      },
    ]);

    setCaseCompleted(true);
  }
}, 500);
};
const handleVoiceInput = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech recognition is not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();

  const languageCodes = {
  "தமிழ்": "ta-IN",
  English: "en-IN",
  "हिन्दी": "hi-IN",
  "മലയാളം": "ml-IN",
};

recognition.lang = languageCodes[selectedLanguage] || "en-IN";
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onstart = () => {
    setIsListening(true);
  };

  recognition.onresult = (event) => {
    const spokenText = event.results[0][0].transcript;
    setAnswer(spokenText);
  };

  recognition.onerror = () => {
    setIsListening(false);
  };

  recognition.onend = () => {
    setIsListening(false);
  };

  recognition.start();
};
if (page === "case-taking") {
  return (
    <div className="app case-page">
      <nav className="case-navbar">
        <div className="logo">
          <div className="logo-icon">
            <Stethoscope size={25} />
          </div>
          <span>MediVoice</span>
        </div>

        <div className="ai-status">
          <span className="status-dot"></span>
          {t.aiAssistantOnline}        </div>

        <button
          className="exit-btn"
          onClick={() => setPage("welcome")}
        >
          <X size={18} />
          {t.exit}
        </button>
      </nav>

      <main className="chat-container">
        <div className="chat-header">
          <div className="ai-avatar">
            <Bot size={28} />
          </div>

          <div>
            <h2>MediVoice AI</h2>
            <p>{t.chatDescription}</p>
          </div>
        </div>

        <div className="messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message-row ${message.sender}`}
            >
              <div className="message-avatar">
                {message.sender === "ai" ? (
                  <Bot size={18} />
                ) : (
                  <User size={18} />
                )}
              </div>

              <div className="message-bubble">
                {message.text}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef}></div>
        </div>
        {caseCompleted && (
  <button
    className="medical-history-btn"
    onClick={() => setPage("medical-history")}
  >
{t.continueMedicalHistory}    <ArrowRight size={20} />
  </button>
)}
        <div className="chat-input-area">
          
          <input
            type="text"
            placeholder={t.typeAnswer}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={caseCompleted}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />

         <button
  className={`mic-btn ${isListening ? "listening" : ""}`}
  title="Voice input"
  onClick={handleVoiceInput}
>
  <Mic size={21} />
</button>
          <button
  className="send-btn"
  onClick={handleSend}
  disabled={caseCompleted}
>
            <Send size={20} />
          </button>
        </div>

       <p className="chat-note">
  {t.casePrivacyNote}
</p>
      </main>
    </div>
  );
}
  // ---------------- MEDICAL HISTORY PAGE ----------------

if (page === "medical-history") {
  return (
    <div className="app medical-history-page">
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon">
            <Stethoscope size={28} />
          </div>
          <span>MediVoice</span>
        </div>
      </nav>

      <main className="history-container">
        <button
          className="back-btn"
          onClick={() => setPage("case-taking")}
        >
          <ArrowLeft size={20} />
          {t.back}
        </button>

        <div className="history-card">
          <div className="details-icon">📋</div>

          <h1>{t.medicalHistory}</h1>

         <p>{t.medicalHistoryDesc}</p>

          <div className="form-group">
            <label>{t.previousConditions}</label>

<textarea
  placeholder={t.previousConditionsPlaceholder}
  value={previousConditions}
  onChange={(e) => setPreviousConditions(e.target.value)}
/>
          </div>

          <div className="form-group">
            <label>{t.currentMedicines}</label>
<textarea
  placeholder={t.currentMedicinesPlaceholder}
  value={currentMedicines}
  onChange={(e) => setCurrentMedicines(e.target.value)}
/>
          </div>

          <div className="form-group">
            <label>{t.allergies}</label>
<textarea
  placeholder={t.allergiesPlaceholder}
  value={allergies}
  onChange={(e) => setAllergies(e.target.value)}
/>
          </div>

          <div className="form-group">
            <label>{t.previousSurgeries}</label>
<textarea
  placeholder={t.surgeriesPlaceholder}
  value={previousSurgeries}
  onChange={(e) => setPreviousSurgeries(e.target.value)}
/>
          </div>

          <button
            className="continue-btn history-continue"
           onClick={() => setPage("documents")}
          >
            {t.continue}
            <ArrowRight size={20} />
          </button>
        </div>
      </main>
    </div>
  );
}
// ---------------- DOCUMENT UPLOAD PAGE ----------------

if (page === "documents") {
  return (
    <div className="app documents-page">
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon">
            <Stethoscope size={28} />
          </div>
          <span>MediVoice</span>
        </div>
      </nav>

      <main className="documents-container">
        <button
          className="back-btn"
          onClick={() => setPage("medical-history")}
        >
          <ArrowLeft size={20} />
          {t.back}
        </button>

        <div className="documents-card">
          <div className="details-icon">📄</div>

<h1>{t.uploadDocumentsTitle}</h1>
          <p>{t.uploadDocumentsDesc}</p>
          <div className="upload-grid">

            <div className="upload-box">
              <div className="upload-icon">📋</div>
             <h3>{t.prescription}</h3>
<p>{t.prescriptionDesc}</p>

             <input
  type="file"
  onChange={(e) =>
    handleDocumentUpload("prescription", e.target.files[0])
  }
/>
            </div>

            <div className="upload-box">
              <div className="upload-icon">🧪</div>
              <h3>{t.labReports}</h3>
<p>{t.labReportsDesc}</p>

              <input
  type="file"
  onChange={(e) =>
    handleDocumentUpload("labReports", e.target.files[0])
  }
/>
            </div>

            <div className="upload-box">
              <div className="upload-icon">🏥</div>
              <h3>{t.dischargeSummary}</h3>
<p>{t.dischargeSummaryDesc}</p>

             <input
  type="file"
  onChange={(e) =>
    handleDocumentUpload("dischargeSummary", e.target.files[0])
  }
/>
            </div>

            <div className="upload-box">
              <div className="upload-icon">📎</div>
              <h3>{t.otherDocuments}</h3>
<p>{t.otherDocumentsDesc}</p>

              <input
  type="file"
  onChange={(e) =>
    handleDocumentUpload("otherDocuments", e.target.files[0])
  }
/>
            </div>

          </div>
<p className="skip-text">
  {t.uploadSkipText}
</p>
          <button
            className="continue-btn documents-continue"
            onClick={() => setPage("review")}
          >
            {t.continue}
            <ArrowRight size={20} />
          </button>

          <button
            className="skip-btn"
            onClick={() => setPage("review")}
          >
            {t.skipForNow}
          </button>
        </div>
      </main>
    </div>
  );
}
  // ---------------- WELCOME PAGE ----------------

  if (page === "welcome") {
    return (
      <div className="app">
        <nav className="navbar">
          <div className="logo">
            <div className="logo-icon">
              <Stethoscope size={28} />
            </div>
            <span>MediVoice</span>
          </div>

          <button className="login-btn">{t.login}</button>
        </nav>

        <main className="hero">
          <div className="hero-content">
            <div className="badge">
              <HeartPulse size={18} />
              AI-Powered Healthcare
            </div>

            <h1>
              Your Health Story,
              <span> Clearly Understood.</span>
            </h1>

            <p>
              MediVoice helps you share your medical history easily through
              voice or text, creating a structured summary for your doctor.
            </p>

            <button
              className="get-started-btn"
              onClick={() => {
  setAgreed(false);
  setPage("language");
}}
            >
              {t.getStarted}
              <ArrowRight size={20} />
            </button>

            <div className="features">
              <div className="feature">
                <HeartPulse size={22} />
                <span>Easy Case-Taking</span>
              </div>

              <div className="feature">
                <Stethoscope size={22} />
                <span>AI-Guided Questions</span>
              </div>

              <div className="feature">
                <ShieldCheck size={22} />
                <span>Secure & Private</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="medical-card">
              <div className="card-header">
                <div className="doctor-icon">
                  <Stethoscope size={35} />
                </div>

                <div>
                  <h3>MediVoice AI</h3>
                  <p>Ready to listen</p>
                </div>
              </div>

              <div className="conversation">
                <div className="ai-message">
                  Hello! What brings you here today?
                </div>

                <div className="patient-message">
                  I have been feeling unwell.
                </div>
              </div>

              <button className="voice-btn">🎤 Tap to Speak</button>
            </div>
          </div>
        </main>
      </div>
    );
  }
if (page === "details") {
  return (
    <div className="app details-page">
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon">
            <Stethoscope size={28} />
          </div>
          <span>MediVoice</span>
        </div>
      </nav>

      <main className="details-container">
        <button
          className="back-btn"
          onClick={() => setPage("language")}
        >
          <ArrowLeft size={20} />
          {t.back}
        </button>

        <div className="details-card">
          <div className="details-icon">👤</div>

          <h1>{t.patientDetails}</h1>

          <p>{t.patientDetailsDesc}</p>

          <div className="form-group">
            <label>{t.fullName}</label>
           <input
  type="text"
  placeholder={t.enterFullName}
  value={patientDetails.fullName}
  onChange={(e) =>
    setPatientDetails({
      ...patientDetails,
      fullName: e.target.value,
    })
  }
/>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t.age}</label>
              <input
  type="number"
  min="1"
  max="120"
  placeholder={t.enterAge}
  value={patientDetails.age}
  onChange={(e) =>
    setPatientDetails({
      ...patientDetails,
      age: e.target.value,
    })
  }
/>
            </div>

            <div className="form-group">
              <label>{t.gender}</label>
              <select
  value={patientDetails.gender}
  onChange={(e) =>
    setPatientDetails({
      ...patientDetails,
      gender: e.target.value,
    })
  }
>
  <option value="">{t.selectGender}</option>
  <option>{t.male}</option>
  <option>{t.female}</option>
  <option>{t.preferNotToSay}</option>
</select>
            </div>
          </div>

          <div className="form-group">
            <label>{t.phoneNumber}</label>
          <input
  type="tel"
  placeholder={t.enterPhone}
  value={patientDetails.phoneNumber}
  maxLength="10"
  onChange={(e) =>
    setPatientDetails({
      ...patientDetails,
      phoneNumber: e.target.value.replace(/\D/g, ""),
    })
  }
/>
          </div>

          <button
  className="continue-btn details-continue"
  disabled={
  !patientDetails.fullName.trim() ||
  !patientDetails.age ||
  !patientDetails.gender ||
  patientDetails.phoneNumber.length !== 10
}
  onClick={() => setPage("consent")}
>
  {t.continue}
  <ArrowRight size={20} />
</button>
        </div>
      </main>
    </div>
  );
}
// ---------------- CONSENT PAGE ----------------

if (page === "consent") {
  return (
    <div className="app consent-page">
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon">
            <Stethoscope size={28} />
          </div>
          <span>MediVoice</span>
        </div>
      </nav>

      <main className="consent-container">
        <button
          className="back-btn"
          onClick={() => setPage("details")}
        >
          <ArrowLeft size={20} />
          {t.back}
        </button>

        <div className="consent-card">
          <div className="consent-icon">
            <ShieldCheck size={38} />
          </div>

          <h1>{t.privacyTitle}</h1>

          <p className="consent-description">
            {t.privacyDesc}
          </p>

          <div className="consent-points">
            <div className="consent-item">
              <Check size={20} />
              <div>
                <h3>Medical Information</h3>
                <p>
                  Your health information will be collected to create
                  a structured case summary.
                </p>
              </div>
            </div>

            <div className="consent-item">
              <Check size={20} />
              <div>
                <h3>Voice Responses</h3>
                <p>
                  Your voice answers may be converted into text for
                  the health assessment.
                </p>
              </div>
            </div>

            <div className="consent-item">
              <Check size={20} />
              <div>
                <h3>Medical Documents</h3>
                <p>
                  Uploaded prescriptions and reports may be processed
                  to extract relevant information.
                </p>
              </div>
            </div>
          </div>

          <label className="consent-checkbox">
            <input
  type="checkbox"
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
/>
            <span>
              I understand and agree to the collection and processing
              of my information for this assessment.
            </span>
          </label>

         <button
  className="continue-btn consent-continue"
  disabled={!agreed}
  onClick={() => setPage("case-taking")}
>
           {t.agreeContinue}
            <ArrowRight size={20} />
          </button>
        </div>
      </main>
    </div>
  );
}
  // ---------------- LANGUAGE PAGE ----------------

  if (page === "language") {
    return (
      <div className="app language-page">
        <nav className="navbar">
          <div className="logo">
            <div className="logo-icon">
              <Stethoscope size={28} />
            </div>
            <span>MediVoice</span>
          </div>
        </nav>

        <main className="language-container">
          <button
            className="back-btn"
            onClick={() => setPage("welcome")}
          >
            <ArrowLeft size={20} />
            {t.back}
          </button>

          <div className="language-content">
            <div className="language-icon">🌐</div>

            <h1>{t.chooseLanguage}</h1>

           <p>{t.selectLanguage}</p>
            <div className="language-grid">
              {languages.map((language) => (
                <button
                  key={language.name}
                  className={`language-card ${
                    selectedLanguage === language.name ? "selected" : ""
                  }`}
                  onClick={() => setSelectedLanguage(language.name)}
                >
                  <div>
                    <h3>{language.name}</h3>
                    <span>{language.sub}</span>
                  </div>

                  {selectedLanguage === language.name && (
                    <div className="check-icon">
                      <Check size={18} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <button
              className="continue-btn"
              disabled={!selectedLanguage}
              onClick={() => setPage("details")}
            >
              {t.continue}
              <ArrowRight size={20} />
            </button>
          </div>
        </main>
      </div>
    );
  }
  // ---------------- REVIEW & SUMMARY PAGE ----------------

if (page === "review") {
  return (
    <div className="app review-page">
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon">
            <Stethoscope size={28} />
          </div>
          <span>MediVoice</span>
        </div>
      </nav>

      <main className="review-container">
        <button
          className="back-btn"
          onClick={() => setPage("documents")}
        >
          <ArrowLeft size={20} />
          {t.back}
        </button>

        <div className="review-card">
          <div className="details-icon">🩺</div>


          <h1>{t.reviewTitle}</h1>

<p className="review-description">
  {t.reviewDesc}
</p>
<div className="summary-section">
  <h2>👤 {t.patientDetails}</h2>

  <div className="summary-content">
    <p>
      <strong>{t.fullName}:</strong>{" "}
      {patientDetails.fullName || "Not provided"}
    </p>

    <p>
      <strong>{t.age}:</strong>{" "}
      {patientDetails.age || "Not provided"}
    </p>

    <p>
      <strong>{t.gender}:</strong>{" "}
      {patientDetails.gender || "Not provided"}
    </p>

    <p>
      <strong>{t.phoneNumber}:</strong>{" "}
      {patientDetails.phoneNumber || "Not provided"}
    </p>
  </div>
</div>

          <div className="summary-section">
  <h2>{t.currentHealthConcern}</h2>

  <div className="summary-content">
    {messages
      .filter((message) => message.sender === "user")
      .map((message, index) => (
        <p key={index}>
          <strong>{index + 1}.</strong> {message.text}
        </p>
      ))}

   
  </div>
</div>

          <div className="summary-section">
            <h2>📋 {t.reviewMedicalHistory}</h2>


            
  <div className="summary-content">
    <p>
      <strong>{t.previousConditions}:</strong>{" "}
      {previousConditions || "Not provided"}
    </p>

    <p>
      <strong>{t.currentMedicines}:</strong>{" "}
      {currentMedicines || "Not provided"}
    </p>

    <p>
      <strong>{t.allergies}:</strong>{" "}
      {allergies || "Not provided"}
    </p>

    <p>
      <strong>{t.previousSurgeries}:</strong>{" "}
      {previousSurgeries || "Not provided"}
    </p>
  </div>
</div>
<div className="summary-section">
  <h2>📄 {t.medicalDocuments}</h2>

  <div className="summary-content">
    {documents.prescription && (
      <p>
        📋 <strong>{t.prescription}:</strong>{" "}
        {documents.prescription.name}
      </p>
    )}

    {documents.labReports && (
      <p>
        🧪 <strong>{t.labReports}:</strong>{" "}
        {documents.labReports.name}
      </p>
    )}

    {documents.dischargeSummary && (
      <p>
        🏥 <strong>{t.dischargeSummary}:</strong>{" "}
        {documents.dischargeSummary.name}
      </p>
    )}

    {documents.otherDocuments && (
      <p>
        📎 <strong>{t.otherDocuments}:</strong>{" "}
        {documents.otherDocuments.name}
      </p>
    )}

    {!documents.prescription &&
      !documents.labReports &&
      !documents.dischargeSummary &&
      !documents.otherDocuments && (
        <p>{t.uploadSkipText}</p>
      )}
  </div>
</div>
          <div className="review-note">
            <ShieldCheck size={20} />
            <p>{t.reviewNote}</p>
          </div>

          <button
            className="continue-btn submit-case-btn"
            onClick={() => setPage("submitted")}
          >
            {t.submitCase}
            <ArrowRight size={20} />
          </button>
        </div>
      </main>
    </div>
  );
}
// ---------------- CASE SUBMITTED PAGE ----------------

if (page === "submitted") {
  return (
    <div className="app submitted-page">
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon">
            <Stethoscope size={28} />
          </div>
          <span>MediVoice</span>
        </div>
      </nav>

      <main className="submitted-container">
        <div className="submitted-card">
          <div className="success-icon">
            <Check size={50} />
          </div>

          <h1>{t.caseSubmitted}</h1>
          <p className="submitted-description">
  {t.submittedDesc}
</p>

          <div className="submitted-info">
            <div className="info-item">
              <span className="info-icon">🩺</span>
              <div>
                <h3>{t.caseReady}</h3>
<p>{t.caseReadyDesc}</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">🔒</span>
              <div>
                <h3>{t.secureInformation}</h3>
<p>{t.secureInformationDesc}</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">📋</span>
              <div>
                <h3>{t.structuredSummary}</h3>
<p>{t.structuredSummaryDesc}</p>
              </div>
            </div>
          </div>

          <button
            className="continue-btn home-btn"
            onClick={() => setPage("welcome")}
          >
           {t.backToHome}
          </button>
        </div>
      </main>
    </div>
  );
}
}
export default PatientInterface;