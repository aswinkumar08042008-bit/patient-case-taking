import { useState, useRef, useEffect } from "react";
import API from "./api/api";
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
  LayoutDashboard,
  ClipboardList,
  FileText,
  Activity,
  Bell,
  Settings,
  LogOut,
  Menu,
  ChevronRight,
  Upload,
  MessageSquare,
  CalendarDays,
  Lock,
  UserRound,
  Languages,
  CircleCheck,
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

  const [patientId, setPatientId] = useState(null);

  const [messages, setMessages] = useState([]);

  const [documents, setDocuments] = useState({
    prescription: null,
    labReports: null,
    dischargeSummary: null,
    otherDocuments: null,
  });

  const [answer, setAnswer] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [questionStep, setQuestionStep] = useState(0);
  const [caseCompleted, setCaseCompleted] = useState(false);

  const [previousConditions, setPreviousConditions] = useState("");
  const [currentMedicines, setCurrentMedicines] = useState("");
  const [allergies, setAllergies] = useState("");
  const [previousSurgeries, setPreviousSurgeries] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef = useRef(null);

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

      aiGreeting:
        "Hello! I'm MediVoice, your AI health assistant.",
      firstQuestion:
        "What brings you to the hospital today?",
      question1: "When did this problem start?",
      question2:
        "Can you describe how you are feeling?",
      question3:
        "Do you have any other symptoms?",
      question4:
        "Have you taken any medicine for this problem?",

      caseCollected:
        "Thank you. I have collected the initial information.",

      continueMedicalHistory:
        "Continue to Medical History",

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

      previousSurgeries:
        "Previous Surgeries or Hospitalizations",
      surgeriesPlaceholder:
        "Enter details, or leave blank if none",

      uploadDocumentsTitle:
        "Upload Medical Documents",

      uploadDocumentsDesc:
        "You can upload any medical documents that may help your doctor understand your health history.",

      prescription: "Prescription",
      prescriptionDesc:
        "Upload previous prescriptions",

      labReports: "Lab Reports",
      labReportsDesc:
        "Blood tests, scans or other reports",

      dischargeSummary: "Discharge Summary",
      dischargeSummaryDesc:
        "Upload previous hospital records",

      otherDocuments: "Other Documents",
      otherDocumentsDesc:
        "Any other relevant medical documents",

      uploadSkipText:
        "You can skip this step if you don't have any documents.",

      reviewTitle:
        "Review Your Health Information",

      reviewDesc:
        "Please review the information collected before submitting your case.",

      currentHealthConcern:
        "Current Health Concern",

      reviewMedicalHistory:
        "Medical History",

      medicalDocuments:
        "Medical Documents",

      reviewNote:
        "Your information will be organized into a structured summary for the doctor.",

      caseReady: "Case Ready",
      caseReadyDesc:
        "Your case summary is ready for the doctor.",

      secureInformation:
        "Secure Information",

      secureInformationDesc:
        "Your medical information is handled securely.",

      structuredSummary:
        "Structured Summary",

      structuredSummaryDesc:
        "Your responses have been organized for review.",

      submittedDesc:
        "Your health information has been collected and organized into a structured case summary.",

      backToHome: "Back to Home",

      chatDescription:
        "I'm here to understand your health concern.",

      typeAnswer: "Type your answer...",
      voiceInput: "Voice input",

      casePrivacyNote:
        "Your responses will be used only to prepare your medical case summary.",

      dashboard: "Dashboard",
      caseTaking: "Case Taking",
      history: "Medical History",
      documents: "Documents",
      summary: "Case Summary",
      notifications: "Notifications",
      settings: "Settings",
      logout: "Logout",

      welcomeBack: "Welcome back",
      patientDashboard:
        "Your personal healthcare dashboard",
      startAssessment:
        "Start New Health Assessment",
      startAssessmentDesc:
        "Talk with MediVoice AI and create a structured case summary for your doctor.",
      startNow: "Start Assessment",

      healthOverview: "Health Overview",
      activeCase: "Active Case",
      medicalRecords: "Medical Records",
      completedCases: "Completed Cases",

      quickActions: "Quick Actions",
      recentActivity: "Recent Activity",

      securePlatform:
        "Your healthcare information is securely managed.",
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

      aiGreeting:
        "வணக்கம்! நான் உங்கள் MediVoice AI உடல்நல உதவியாளர்.",

      firstQuestion:
        "இன்று உங்களை மருத்துவமனைக்கு வரச் செய்த பிரச்சனை என்ன?",

      question1:
        "இந்த பிரச்சனை எப்போது தொடங்கியது?",

      question2:
        "நீங்கள் எப்படி உணர்கிறீர்கள் என்பதை விவரிக்க முடியுமா?",

      question3:
        "உங்களுக்கு வேறு ஏதேனும் அறிகுறிகள் உள்ளதா?",

      question4:
        "இந்த பிரச்சனைக்காக ஏதேனும் மருந்து எடுத்துள்ளீர்களா?",

      caseCollected:
        "நன்றி. ஆரம்ப தகவல்கள் சேகரிக்கப்பட்டுள்ளன.",

      continueMedicalHistory:
        "மருத்துவ வரலாற்றிற்கு தொடரவும்",

      medicalHistoryDesc:
        "உங்களுக்கு தெரிந்த முந்தைய மருத்துவ தகவல்களை வழங்கவும்.",

      previousConditions:
        "முந்தைய உடல்நல பிரச்சனைகள்",

      previousConditionsPlaceholder:
        "உதாரணம்: நீரிழிவு, ஆஸ்துமா, இரத்த அழுத்தம் அல்லது எதுவும் இல்லை என்றால் காலியாக விடவும்",

      currentMedicines:
        "தற்போது எடுத்துக்கொள்ளும் மருந்துகள்",

      currentMedicinesPlaceholder:
        "நீங்கள் தற்போது எடுத்துக்கொள்ளும் மருந்துகளை உள்ளிடவும் அல்லது எதுவும் இல்லை என்றால் காலியாக விடவும்",

      allergies: "ஒவ்வாமைகள்",

      allergiesPlaceholder:
        "உங்களுக்கு தெரிந்த ஒவ்வாமைகளை உள்ளிடவும் அல்லது எதுவும் இல்லை என்றால் காலியாக விடவும்",

      previousSurgeries:
        "முந்தைய அறுவை சிகிச்சைகள் அல்லது மருத்துவமனை அனுமதிகள்",

      surgeriesPlaceholder:
        "விவரங்களை உள்ளிடவும் அல்லது எதுவும் இல்லை என்றால் காலியாக விடவும்",

      uploadDocumentsTitle:
        "மருத்துவ ஆவணங்களை பதிவேற்றவும்",

      uploadDocumentsDesc:
        "உங்கள் உடல்நல வரலாற்றைப் புரிந்துகொள்ள மருத்துவருக்கு உதவும் மருத்துவ ஆவணங்களை பதிவேற்றலாம்.",

      prescription: "மருந்துச்சீட்டு",
      prescriptionDesc:
        "முந்தைய மருந்துச்சீட்டுகளை பதிவேற்றவும்",

      labReports: "ஆய்வக அறிக்கைகள்",
      labReportsDesc:
        "இரத்த பரிசோதனை, ஸ்கேன் அல்லது பிற அறிக்கைகள்",

      dischargeSummary:
        "மருத்துவமனை வெளியேற்ற சுருக்கம்",

      dischargeSummaryDesc:
        "முந்தைய மருத்துவமனை பதிவுகளை பதிவேற்றவும்",

      otherDocuments: "பிற ஆவணங்கள்",
      otherDocumentsDesc:
        "பிற தொடர்புடைய மருத்துவ ஆவணங்கள்",

      uploadSkipText:
        "உங்களிடம் ஆவணங்கள் இல்லையெனில் இந்த படியை தவிர்க்கலாம்.",

      reviewTitle:
        "உங்கள் உடல்நல தகவலை சரிபார்க்கவும்",

      reviewDesc:
        "உங்கள் வழக்கை சமர்ப்பிப்பதற்கு முன் சேகரிக்கப்பட்ட தகவல்களை சரிபார்க்கவும்.",

      currentHealthConcern:
        "தற்போதைய உடல்நல பிரச்சனை",

      reviewMedicalHistory:
        "மருத்துவ வரலாறு",

      medicalDocuments:
        "மருத்துவ ஆவணங்கள்",

      reviewNote:
        "உங்கள் தகவல்கள் மருத்துவருக்காக ஒரு கட்டமைக்கப்பட்ட சுருக்கமாக ஒழுங்குபடுத்தப்படும்.",

      caseReady: "வழக்கு தயாராக உள்ளது",

      caseReadyDesc:
        "உங்கள் வழக்கு சுருக்கம் மருத்துவருக்காக தயாராக உள்ளது.",

      secureInformation:
        "பாதுகாப்பான தகவல்கள்",

      secureInformationDesc:
        "உங்கள் மருத்துவ தகவல்கள் பாதுகாப்பாக கையாளப்படுகின்றன.",

      structuredSummary:
        "கட்டமைக்கப்பட்ட சுருக்கம்",

      structuredSummaryDesc:
        "உங்கள் பதில்கள் சரிபார்ப்பதற்காக ஒழுங்குபடுத்தப்பட்டுள்ளன.",

      submittedDesc:
        "உங்கள் உடல்நல தகவல்கள் சேகரிக்கப்பட்டு ஒரு கட்டமைக்கப்பட்ட வழக்கு சுருக்கமாக ஒழுங்குபடுத்தப்பட்டுள்ளன.",

      backToHome:
        "முகப்புப் பக்கத்திற்கு திரும்பவும்",

      chatDescription:
        "உங்கள் உடல்நல பிரச்சனையைப் புரிந்துகொள்ள நான் இங்கே இருக்கிறேன்.",

      typeAnswer:
        "உங்கள் பதிலை உள்ளிடவும்...",

      voiceInput: "குரல் உள்ளீடு",

      casePrivacyNote:
        "உங்கள் மருத்துவ வழக்கு சுருக்கத்தைத் தயாரிக்க மட்டுமே உங்கள் பதில்கள் பயன்படுத்தப்படும்.",

      dashboard: "டாஷ்போர்டு",
      caseTaking: "வழக்கு பதிவு",
      history: "மருத்துவ வரலாறு",
      documents: "ஆவணங்கள்",
      summary: "வழக்கு சுருக்கம்",
      notifications: "அறிவிப்புகள்",
      settings: "அமைப்புகள்",
      logout: "வெளியேறு",

      welcomeBack: "மீண்டும் வரவேற்கிறோம்",
      patientDashboard:
        "உங்கள் தனிப்பட்ட சுகாதார டாஷ்போர்டு",

      startAssessment:
        "புதிய உடல்நல மதிப்பீட்டைத் தொடங்குங்கள்",

      startAssessmentDesc:
        "MediVoice AI உடன் பேசுங்கள் மற்றும் மருத்துவருக்கான கட்டமைக்கப்பட்ட வழக்கு சுருக்கத்தை உருவாக்குங்கள்.",

      startNow: "மதிப்பீட்டைத் தொடங்கு",

      healthOverview:
        "உடல்நல கண்ணோட்டம்",

      activeCase: "செயலில் உள்ள வழக்கு",
      medicalRecords: "மருத்துவ பதிவுகள்",
      completedCases: "முடிக்கப்பட்ட வழக்குகள்",

      quickActions: "விரைவு செயல்கள்",
      recentActivity: "சமீபத்திய செயல்பாடு",

      securePlatform:
        "உங்கள் சுகாதார தகவல்கள் பாதுகாப்பாக நிர்வகிக்கப்படுகின்றன.",
    },
  };

  const t = translations[selectedLanguage] || translations.English;

  const languages = [
    { name: "தமிழ்", sub: "Tamil" },
    { name: "English", sub: "English" },
    { name: "हिन्दी", sub: "Hindi" },
    { name: "മലയാളം", sub: "Malayalam" },
  ];

  const savePatientDetails = async () => {
    try {
      const response = await API.post("/patients", {
        fullName: patientDetails.fullName,
        age: Number(patientDetails.age),
        gender: patientDetails.gender,
        phoneNumber: patientDetails.phoneNumber,
      });

      console.log("Patient saved:", response.data);

      setPatientId(response.data.patient.id);
      setPage("consent");
    } catch (error) {
      console.error("Failed to save patient:", error);
      alert("Could not connect to the backend.");
    }
  };

  useEffect(() => {
    API.get("/")
      .then((response) => {
        console.log("Backend connected:", response.data);
      })
      .catch((error) => {
        console.error("Backend connection failed:", error);
      });
  }, []);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleDocumentUpload = (type, file) => {
    if (!file) return;

    setDocuments((prev) => ({
      ...prev,
      [type]: file,
    }));
  };

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
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not supported in this browser."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    const languageCodes = {
      "தமிழ்": "ta-IN",
      English: "en-IN",
      "हिन्दी": "hi-IN",
      "മലയാളം": "ml-IN",
    };

    recognition.lang =
      languageCodes[selectedLanguage] || "en-IN";

    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const spokenText =
        event.results[0][0].transcript;

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

  const goToPage = (targetPage) => {
    setPage(targetPage);
    setSidebarOpen(false);
  };

  const Sidebar = () => (
    <>
      <div
        className={`sidebar-overlay ${
          sidebarOpen ? "show" : ""
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`patient-sidebar ${
          sidebarOpen ? "open" : ""
        }`}
      >
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Stethoscope size={24} />
          </div>

          <div>
            <strong>MediVoice</strong>
            <span>Patient Care</span>
          </div>
        </div>

        <div className="sidebar-profile">
          <div className="profile-avatar">
            <UserRound size={21} />
          </div>

          <div>
            <strong>
              {patientDetails.fullName ||
                "Patient"}
            </strong>

            <span>Patient Account</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-label">MAIN MENU</p>

          <button
            className={
              page === "dashboard"
                ? "active"
                : ""
            }
            onClick={() =>
              goToPage("dashboard")
            }
          >
            <LayoutDashboard size={19} />
            <span>{t.dashboard}</span>
          </button>

          <button
            className={
              page === "case-taking"
                ? "active"
                : ""
            }
            onClick={() =>
              goToPage("case-taking")
            }
          >
            <MessageSquare size={19} />
            <span>{t.caseTaking}</span>
          </button>

          <button
            className={
              page === "medical-history"
                ? "active"
                : ""
            }
            onClick={() =>
              goToPage("medical-history")
            }
          >
            <ClipboardList size={19} />
            <span>{t.history}</span>
          </button>

          <button
            className={
              page === "documents"
                ? "active"
                : ""
            }
            onClick={() =>
              goToPage("documents")
            }
          >
            <FileText size={19} />
            <span>{t.documents}</span>
          </button>

          <button
            className={
              page === "review"
                ? "active"
                : ""
            }
            onClick={() =>
              goToPage("review")
            }
          >
            <Activity size={19} />
            <span>{t.summary}</span>
          </button>

          <p className="nav-label second">
            ACCOUNT
          </p>

          <button>
            <Bell size={19} />
            <span>{t.notifications}</span>
            <span className="notification-count">
              2
            </span>
          </button>

          <button>
            <Settings size={19} />
            <span>{t.settings}</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-secure">
            <Lock size={17} />
            <span>{t.securePlatform}</span>
          </div>

          <button
            className="logout-sidebar"
            onClick={() =>
              goToPage("welcome")
            }
          >
            <LogOut size={19} />
            <span>{t.logout}</span>
          </button>
        </div>
      </aside>
    </>
  );

  const DashboardLayout = ({ children }) => (
    <div className="patient-system">
      <Sidebar />

      <div className="patient-main">
        <header className="patient-topbar">
          <button
            className="mobile-menu"
            onClick={() =>
              setSidebarOpen(true)
            }
          >
            <Menu size={22} />
          </button>

          <div className="topbar-title">
            <span>Patient Portal</span>
          </div>

          <div className="topbar-actions">
            <button className="top-icon-btn">
              <Bell size={19} />
              <span className="top-notification-dot" />
            </button>

            <div className="top-profile">
              <div className="profile-avatar small">
                <UserRound size={17} />
              </div>

              <div>
                <strong>
                  {patientDetails.fullName ||
                    "Patient"}
                </strong>

                <span>Patient</span>
              </div>
            </div>
          </div>
        </header>

        <main className="patient-content">
          {children}
        </main>
      </div>
    </div>
  );

  // ---------------- DASHBOARD ----------------

  if (page === "dashboard") {
    return (
      <DashboardLayout>
        <div className="dashboard-heading">
          <div>
            <p className="eyebrow">
              PATIENT DASHBOARD
            </p>

            <h1>
              {t.welcomeBack},{" "}
              {patientDetails.fullName ||
                "Patient"}
            </h1>

            <p>
              {t.patientDashboard}
            </p>
          </div>

          <div className="date-display">
            <CalendarDays size={18} />
            <span>
              {new Date().toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              )}
            </span>
          </div>
        </div>

        <section className="assessment-banner">
          <div className="assessment-icon">
            <Bot size={30} />
          </div>

          <div className="assessment-text">
            <span className="banner-label">
              AI HEALTH ASSISTANT
            </span>

            <h2>{t.startAssessment}</h2>

            <p>
              {t.startAssessmentDesc}
            </p>

            <button
              className="primary-action"
              onClick={() =>
                goToPage("case-taking")
              }
            >
              {t.startNow}
              <ArrowRight size={18} />
            </button>
          </div>
        </section>

        <section>
          <div className="section-title-row">
            <div>
              <h2>{t.healthOverview}</h2>
              <p>
                Your current healthcare activity
              </p>
            </div>
          </div>

          <div className="dashboard-stats">
            <div className="dashboard-stat">
              <div className="dashboard-stat-icon blue">
                <Activity size={22} />
              </div>

              <div>
                <span>{t.activeCase}</span>
                <strong>
                  {caseCompleted
                    ? "Completed"
                    : "In Progress"}
                </strong>
              </div>
            </div>

            <div className="dashboard-stat">
              <div className="dashboard-stat-icon green">
                <FileText size={22} />
              </div>

              <div>
                <span>{t.medicalRecords}</span>
                <strong>
                  {
                    Object.values(
                      documents
                    ).filter(Boolean).length
                  }
                </strong>
              </div>
            </div>

            <div className="dashboard-stat">
              <div className="dashboard-stat-icon purple">
                <CircleCheck size={22} />
              </div>

              <div>
                <span>{t.completedCases}</span>
                <strong>
                  {page === "submitted"
                    ? "1"
                    : "0"}
                </strong>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-lower-grid">
          <div className="dashboard-panel">
            <div className="panel-header">
              <div>
                <h2>{t.quickActions}</h2>
                <p>
                  Common healthcare actions
                </p>
              </div>
            </div>

            <div className="quick-actions">
              <button
                onClick={() =>
                  goToPage("case-taking")
                }
              >
                <div className="quick-icon blue">
                  <MessageSquare size={20} />
                </div>

                <div>
                  <strong>
                    Start Case Taking
                  </strong>
                  <span>
                    Talk with MediVoice AI
                  </span>
                </div>

                <ChevronRight size={18} />
              </button>

              <button
                onClick={() =>
                  goToPage(
                    "medical-history"
                  )
                }
              >
                <div className="quick-icon green">
                  <ClipboardList size={20} />
                </div>

                <div>
                  <strong>
                    Medical History
                  </strong>
                  <span>
                    Manage health information
                  </span>
                </div>

                <ChevronRight size={18} />
              </button>

              <button
                onClick={() =>
                  goToPage("documents")
                }
              >
                <div className="quick-icon purple">
                  <Upload size={20} />
                </div>

                <div>
                  <strong>
                    Upload Documents
                  </strong>
                  <span>
                    Add medical records
                  </span>
                </div>

                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="dashboard-panel activity-panel">
            <div className="panel-header">
              <div>
                <h2>{t.recentActivity}</h2>
                <p>
                  Your latest healthcare activity
                </p>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-dot blue" />
              <div>
                <strong>
                  Patient profile created
                </strong>
                <span>
                  Your basic information has been
                  saved.
                </span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-dot green" />
              <div>
                <strong>
                  Secure patient portal
                </strong>
                <span>
                  Your healthcare data is protected.
                </span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-dot purple" />
              <div>
                <strong>
                  MediVoice AI ready
                </strong>
                <span>
                  Start your health assessment
                  anytime.
                </span>
              </div>
            </div>
          </div>
        </section>
      </DashboardLayout>
    );
  }

  // ---------------- CASE TAKING ----------------

  if (page === "case-taking") {
    return (
      <DashboardLayout>
        <div className="page-heading">
          <div>
            <p className="eyebrow">
              AI CASE TAKING
            </p>

            <h1>MediVoice AI Assistant</h1>

            <p>
              {t.chatDescription}
            </p>
          </div>

          <button
            className="secondary-action"
            onClick={() =>
              goToPage("dashboard")
            }
          >
            <ArrowLeft size={17} />
            Dashboard
          </button>
        </div>

        <div className="chat-card">
          <div className="chat-card-header">
            <div className="chat-ai-profile">
              <div className="chat-ai-icon">
                <Bot size={25} />
              </div>

              <div>
                <strong>
                  MediVoice AI
                </strong>

                <span>
                  <span className="online-dot" />
                  {t.aiAssistantOnline}
                </span>
              </div>
            </div>

            <button
              className="exit-chat-btn"
              onClick={() =>
                goToPage("dashboard")
              }
            >
              <X size={17} />
              {t.exit}
            </button>
          </div>

          <div className="messages">
            {messages.map(
              (message, index) => (
                <div
                  key={index}
                  className={`message-row ${message.sender}`}
                >
                  <div className="message-avatar">
                    {message.sender ===
                    "ai" ? (
                      <Bot size={17} />
                    ) : (
                      <User size={17} />
                    )}
                  </div>

                  <div className="message-bubble">
                    {message.text}
                  </div>
                </div>
              )
            )}

            <div ref={messagesEndRef} />
          </div>

          {caseCompleted && (
            <button
              className="medical-history-btn"
              onClick={() =>
                goToPage(
                  "medical-history"
                )
              }
            >
              {t.continueMedicalHistory}
              <ArrowRight size={18} />
            </button>
          )}

          <div className="chat-input-area">
            <input
              type="text"
              placeholder={
                t.typeAnswer
              }
              value={answer}
              onChange={(e) =>
                setAnswer(e.target.value)
              }
              disabled={caseCompleted}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter"
                ) {
                  handleSend();
                }
              }}
            />

            <button
              className={`mic-btn ${
                isListening
                  ? "listening"
                  : ""
              }`}
              title={
                t.voiceInput
              }
              onClick={
                handleVoiceInput
              }
              disabled={caseCompleted}
            >
              <Mic size={20} />
            </button>

            <button
              className="send-btn"
              onClick={handleSend}
              disabled={
                caseCompleted
              }
            >
              <Send size={19} />
            </button>
          </div>

          <p className="chat-note">
            <ShieldCheck size={14} />
            {t.casePrivacyNote}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // ---------------- MEDICAL HISTORY ----------------

  if (page === "medical-history") {
    return (
      <DashboardLayout>
        <div className="page-heading">
          <div>
            <p className="eyebrow">
              PATIENT RECORD
            </p>

            <h1>{t.medicalHistory}</h1>

            <p>
              {t.medicalHistoryDesc}
            </p>
          </div>

          <button
            className="secondary-action"
            onClick={() =>
              goToPage("dashboard")
            }
          >
            <ArrowLeft size={17} />
            Dashboard
          </button>
        </div>

        <div className="form-panel">
          <div className="panel-title">
            <div className="panel-title-icon green">
              <ClipboardList size={22} />
            </div>

            <div>
              <h2>
                Medical History Information
              </h2>

              <p>
                Add information that may help your
                doctor understand your health history.
              </p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group full">
              <label>
                {t.previousConditions}
                <span>
                  Optional
                </span>
              </label>

              <textarea
                placeholder={
                  t.previousConditionsPlaceholder
                }
                value={
                  previousConditions
                }
                onChange={(e) =>
                  setPreviousConditions(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="form-group full">
              <label>
                {t.currentMedicines}
                <span>
                  Optional
                </span>
              </label>

              <textarea
                placeholder={
                  t.currentMedicinesPlaceholder
                }
                value={
                  currentMedicines
                }
                onChange={(e) =>
                  setCurrentMedicines(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="form-group">
              <label>
                {t.allergies}
                <span>
                  Optional
                </span>
              </label>

              <textarea
                placeholder={
                  t.allergiesPlaceholder
                }
                value={allergies}
                onChange={(e) =>
                  setAllergies(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="form-group">
              <label>
                {t.previousSurgeries}
                <span>
                  Optional
                </span>
              </label>

              <textarea
                placeholder={
                  t.surgeriesPlaceholder
                }
                value={
                  previousSurgeries
                }
                onChange={(e) =>
                  setPreviousSurgeries(
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="form-footer">
            <button
              className="primary-action"
              onClick={async () => {
                try {
                  const response =
                    await API.post(
                      "/medical-history",
                      {
                        patient_id:
                          patientId,
                        previousConditions,
                        currentMedicines,
                        allergies,
                        previousSurgeries,
                      }
                    );

                  console.log(
                    "Medical history saved:",
                    response.data
                  );

                  goToPage(
                    "documents"
                  );
                } catch (error) {
                  console.error(
                    "Failed to save medical history:",
                    error
                  );

                  alert(
                    "Could not save medical history."
                  );
                }
              }}
            >
              {t.continue}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ---------------- DOCUMENTS ----------------

  if (page === "documents") {
    const uploadItems = [
      {
        type: "prescription",
        icon: <ClipboardList size={22} />,
        title: t.prescription,
        desc: t.prescriptionDesc,
      },
      {
        type: "labReports",
        icon: <Activity size={22} />,
        title: t.labReports,
        desc: t.labReportsDesc,
      },
      {
        type: "dischargeSummary",
        icon: <FileText size={22} />,
        title: t.dischargeSummary,
        desc: t.dischargeSummaryDesc,
      },
      {
        type: "otherDocuments",
        icon: <Upload size={22} />,
        title: t.otherDocuments,
        desc: t.otherDocumentsDesc,
      },
    ];

    return (
      <DashboardLayout>
        <div className="page-heading">
          <div>
            <p className="eyebrow">
              PATIENT RECORD
            </p>

            <h1>
              {t.uploadDocumentsTitle}
            </h1>

            <p>
              {t.uploadDocumentsDesc}
            </p>
          </div>

          <button
            className="secondary-action"
            onClick={() =>
              goToPage(
                "medical-history"
              )
            }
          >
            <ArrowLeft size={17} />
            {t.back}
          </button>
        </div>

        <div className="documents-panel">
          <div className="upload-grid">
            {uploadItems.map(
              (item) => (
                <div
                  className="upload-box"
                  key={item.type}
                >
                  <div className="upload-box-icon">
                    {item.icon}
                  </div>

                  <h3>
                    {item.title}
                  </h3>

                  <p>
                    {item.desc}
                  </p>

                  <label className="upload-button">
                    <Upload size={16} />
                    Choose File

                    <input
                      type="file"
                      onChange={(e) =>
                        handleDocumentUpload(
                          item.type,
                          e.target.files[0]
                        )
                      }
                    />
                  </label>

                  {documents[
                    item.type
                  ] && (
                    <div className="uploaded-file">
                      <Check size={15} />
                      <span>
                        {
                          documents[
                            item.type
                          ].name
                        }
                      </span>
                    </div>
                  )}
                </div>
              )
            )}
          </div>

          <p className="skip-text">
            {t.uploadSkipText}
          </p>

          <div className="form-footer">
            <button
              className="primary-action"
              onClick={() =>
                goToPage("review")
              }
            >
              {t.continue}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ---------------- REVIEW ----------------

  if (page === "review") {
    return (
      <DashboardLayout>
        <div className="page-heading">
          <div>
            <p className="eyebrow">
              CASE SUMMARY
            </p>

            <h1>
              {t.reviewTitle}
            </h1>

            <p>
              {t.reviewDesc}
            </p>
          </div>

          <button
            className="secondary-action"
            onClick={() =>
              goToPage("documents")
            }
          >
            <ArrowLeft size={17} />
            {t.back}
          </button>
        </div>

        <div className="review-layout">
          <div className="review-main">
            <div className="review-section">
              <div className="review-section-title">
                <div className="review-icon blue">
                  <UserRound size={19} />
                </div>

                <h2>
                  {t.patientDetails}
                </h2>
              </div>

              <div className="review-info-grid">
                <div>
                  <span>
                    {t.fullName}
                  </span>

                  <strong>
                    {patientDetails.fullName ||
                      "Not provided"}
                  </strong>
                </div>

                <div>
                  <span>
                    {t.age}
                  </span>

                  <strong>
                    {patientDetails.age ||
                      "Not provided"}
                  </strong>
                </div>

                <div>
                  <span>
                    {t.gender}
                  </span>

                  <strong>
                    {patientDetails.gender ||
                      "Not provided"}
                  </strong>
                </div>

                <div>
                  <span>
                    {t.phoneNumber}
                  </span>

                  <strong>
                    {patientDetails.phoneNumber ||
                      "Not provided"}
                  </strong>
                </div>
              </div>
            </div>

            <div className="review-section">
              <div className="review-section-title">
                <div className="review-icon purple">
                  <MessageSquare size={19} />
                </div>

                <h2>
                  {t.currentHealthConcern}
                </h2>
              </div>

              <div className="answer-list">
                {messages
                  .filter(
                    (message) =>
                      message.sender ===
                      "user"
                  )
                  .map(
                    (
                      message,
                      index
                    ) => {
                      const questions = [
                        t.firstQuestion,
                        t.question1,
                        t.question2,
                        t.question3,
                        t.question4,
                      ];

                      return (
                        <div
                          className="answer-item"
                          key={index}
                        >
                          <strong>
                            {
                              questions[
                                index
                              ]
                            }
                          </strong>

                          <p>
                            {
                              message.text
                            }
                          </p>
                        </div>
                      );
                    }
                  )}
              </div>
            </div>

            <div className="review-section">
              <div className="review-section-title">
                <div className="review-icon green">
                  <ClipboardList size={19} />
                </div>

                <h2>
                  {t.reviewMedicalHistory}
                </h2>
              </div>

              <div className="review-history">
                <div>
                  <span>
                    {
                      t.previousConditions
                    }
                  </span>

                  <p>
                    {previousConditions ||
                      "Not provided"}
                  </p>
                </div>

                <div>
                  <span>
                    {
                      t.currentMedicines
                    }
                  </span>

                  <p>
                    {currentMedicines ||
                      "Not provided"}
                  </p>
                </div>

                <div>
                  <span>
                    {t.allergies}
                  </span>

                  <p>
                    {allergies ||
                      "Not provided"}
                  </p>
                </div>

                <div>
                  <span>
                    {
                      t.previousSurgeries
                    }
                  </span>

                  <p>
                    {previousSurgeries ||
                      "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            <div className="review-section">
              <div className="review-section-title">
                <div className="review-icon orange">
                  <FileText size={19} />
                </div>

                <h2>
                  {t.medicalDocuments}
                </h2>
              </div>

              <div className="review-documents">
                {Object.entries(
                  documents
                )
                  .filter(
                    ([, file]) => file
                  )
                  .map(
                    ([type, file]) => (
                      <div
                        className="review-document"
                        key={type}
                      >
                        <FileText
                          size={18}
                        />

                        <span>
                          {file.name}
                        </span>

                        <Check
                          size={17}
                        />
                      </div>
                    )
                  )}

                {Object.values(
                  documents
                ).every(
                  (file) => !file
                ) && (
                  <p>
                    {t.uploadSkipText}
                  </p>
                )}
              </div>
            </div>
          </div>

          <aside className="review-side">
            <div className="ready-card">
              <div className="ready-icon">
                <ShieldCheck size={27} />
              </div>

              <h3>
                {t.caseReady}
              </h3>

              <p>
                {t.reviewNote}
              </p>

              <button
                className="primary-action full"
                onClick={() =>
                  goToPage("submitted")
                }
              >
                {t.submitCase}
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="secure-card">
              <Lock size={18} />

              <div>
                <strong>
                  {t.secureInformation}
                </strong>

                <span>
                  {t.secureInformationDesc}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </DashboardLayout>
    );
  }

  // ---------------- SUBMITTED ----------------

  if (page === "submitted") {
    return (
      <DashboardLayout>
        <div className="submitted-wrapper">
          <div className="submitted-card">
            <div className="success-icon">
              <Check size={40} />
            </div>

            <span className="success-label">
              CASE COMPLETED
            </span>

            <h1>
              {t.caseSubmitted}
            </h1>

            <p className="submitted-description">
              {t.submittedDesc}
            </p>

            <div className="submitted-info">
              <div className="info-item">
                <div className="info-item-icon blue">
                  <Stethoscope size={19} />
                </div>

                <div>
                  <h3>
                    {t.caseReady}
                  </h3>

                  <p>
                    {t.caseReadyDesc}
                  </p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-item-icon green">
                  <Lock size={19} />
                </div>

                <div>
                  <h3>
                    {t.secureInformation}
                  </h3>

                  <p>
                    {t.secureInformationDesc}
                  </p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-item-icon purple">
                  <ClipboardList size={19} />
                </div>

                <div>
                  <h3>
                    {t.structuredSummary}
                  </h3>

                  <p>
                    {t.structuredSummaryDesc}
                  </p>
                </div>
              </div>
            </div>

            <button
              className="primary-action"
              onClick={() =>
                goToPage("dashboard")
              }
            >
              {t.backToHome}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ---------------- WELCOME ----------------

  if (page === "welcome") {
    return (
      <div className="landing-page">
        <nav className="landing-navbar">
          <div className="landing-logo">
            <div className="landing-logo-icon">
              <Stethoscope size={24} />
            </div>

            <span>MediVoice</span>
          </div>

          <button
            className="landing-login"
            onClick={() =>
              setPage("language")
            }
          >
            {t.login}
          </button>
        </nav>

        <main className="landing-content">
          <div className="landing-text">
            <div className="landing-badge">
              <HeartPulse size={16} />
              AI-Powered Healthcare
            </div>

            <h1>
              Your Health Story,
              <span>
                {" "}
                Clearly Understood.
              </span>
            </h1>

            <p>
              MediVoice helps you share your
              medical history easily through voice
              or text, creating a structured summary
              for your doctor.
            </p>

            <button
              className="landing-start"
              onClick={() => {
                setAgreed(false);
                setPage("language");
              }}
            >
              {t.getStarted}
              <ArrowRight size={20} />
            </button>

            <div className="landing-features">
              <div>
                <HeartPulse size={19} />
                <span>
                  Easy Case-Taking
                </span>
              </div>

              <div>
                <Bot size={19} />
                <span>
                  AI-Guided Questions
                </span>
              </div>

              <div>
                <ShieldCheck size={19} />
                <span>
                  Secure & Private
                </span>
              </div>
            </div>
          </div>

          <div className="landing-visual">
            <div className="medical-preview">
              <div className="preview-top">
                <div className="preview-ai-icon">
                  <Bot size={25} />
                </div>

                <div>
                  <strong>
                    MediVoice AI
                  </strong>

                  <span>
                    <span className="online-dot" />
                    Ready to listen
                  </span>
                </div>
              </div>

              <div className="preview-message ai">
                Hello! What brings you here
                today?
              </div>

              <div className="preview-message patient">
                I have been feeling unwell.
              </div>

              <div className="preview-secure">
                <ShieldCheck size={16} />
                Secure medical assessment
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ---------------- DETAILS ----------------

  if (page === "details") {
    return (
      <div className="simple-page">
        <div className="simple-navbar">
          <div className="landing-logo">
            <div className="landing-logo-icon">
              <Stethoscope size={24} />
            </div>
            <span>MediVoice</span>
          </div>
        </div>

        <main className="simple-content">
          <button
            className="secondary-action"
            onClick={() =>
              setPage("language")
            }
          >
            <ArrowLeft size={17} />
            {t.back}
          </button>

          <div className="simple-card">
            <div className="simple-card-icon blue">
              <UserRound size={25} />
            </div>

            <h1>
              {t.patientDetails}
            </h1>

            <p>
              {t.patientDetailsDesc}
            </p>

            <div className="form-group">
              <label>
                {t.fullName}
              </label>

              <input
                type="text"
                placeholder={
                  t.enterFullName
                }
                value={
                  patientDetails.fullName
                }
                onChange={(e) =>
                  setPatientDetails({
                    ...patientDetails,
                    fullName:
                      e.target.value,
                  })
                }
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  {t.age}
                </label>

                <input
                  type="number"
                  min="1"
                  max="120"
                  placeholder={
                    t.enterAge
                  }
                  value={
                    patientDetails.age
                  }
                  onChange={(e) =>
                    setPatientDetails({
                      ...patientDetails,
                      age:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  {t.gender}
                </label>

                <select
                  value={
                    patientDetails.gender
                  }
                  onChange={(e) =>
                    setPatientDetails({
                      ...patientDetails,
                      gender:
                        e.target.value,
                    })
                  }
                >
                  <option value="">
                    {t.selectGender}
                  </option>

                  <option>
                    {t.male}
                  </option>

                  <option>
                    {t.female}
                  </option>

                  <option>
                    {t.preferNotToSay}
                  </option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>
                {t.phoneNumber}
              </label>

              <input
                type="tel"
                placeholder={
                  t.enterPhone
                }
                value={
                  patientDetails.phoneNumber
                }
                maxLength="10"
                onChange={(e) =>
                  setPatientDetails({
                    ...patientDetails,
                    phoneNumber:
                      e.target.value.replace(
                        /\D/g,
                        ""
                      ),
                  })
                }
              />
            </div>

            {patientDetails.phoneNumber
              .length > 0 &&
              patientDetails.phoneNumber
                .length !== 10 && (
                <p className="error-message">
                  Please enter a valid
                  10-digit phone number.
                </p>
              )}

            <button
              className="primary-action full"
              disabled={
                !patientDetails.fullName.trim() ||
                !patientDetails.age ||
                !patientDetails.gender ||
                patientDetails.phoneNumber
                  .length !== 10
              }
              onClick={
                savePatientDetails
              }
            >
              {t.continue}
              <ArrowRight size={18} />
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ---------------- CONSENT ----------------

  if (page === "consent") {
    return (
      <div className="simple-page">
        <div className="simple-navbar">
          <div className="landing-logo">
            <div className="landing-logo-icon">
              <Stethoscope size={24} />
            </div>
            <span>MediVoice</span>
          </div>
        </div>

        <main className="simple-content">
          <button
            className="secondary-action"
            onClick={() =>
              setPage("details")
            }
          >
            <ArrowLeft size={17} />
            {t.back}
          </button>

          <div className="simple-card consent-modern">
            <div className="simple-card-icon green">
              <ShieldCheck size={27} />
            </div>

            <h1>
              {t.privacyTitle}
            </h1>

            <p>
              {t.privacyDesc}
            </p>

            <div className="consent-points">
              <div>
                <Check size={17} />
                <span>
                  Medical information will be
                  collected for your case summary.
                </span>
              </div>

              <div>
                <Check size={17} />
                <span>
                  Voice responses may be converted
                  into text.
                </span>
              </div>

              <div>
                <Check size={17} />
                <span>
                  Uploaded medical documents may be
                  processed.
                </span>
              </div>
            </div>

            <label className="consent-checkbox">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) =>
                  setAgreed(
                    e.target.checked
                  )
                }
              />

              <span>
                I understand and agree to the
                collection and processing of my
                information for this assessment.
              </span>
            </label>

            <button
              className="primary-action full"
              disabled={!agreed}
              onClick={() =>
                setPage("case-taking")
              }
            >
              {t.agreeContinue}
              <ArrowRight size={18} />
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ---------------- LANGUAGE ----------------

  if (page === "language") {
    return (
      <div className="simple-page">
        <div className="simple-navbar">
          <div className="landing-logo">
            <div className="landing-logo-icon">
              <Stethoscope size={24} />
            </div>

            <span>MediVoice</span>
          </div>
        </div>

        <main className="simple-content">
          <button
            className="secondary-action"
            onClick={() =>
              setPage("welcome")
            }
          >
            <ArrowLeft size={17} />
            {t.back}
          </button>

          <div className="simple-card language-modern">
            <div className="simple-card-icon blue">
              <Languages size={27} />
            </div>

            <h1>
              {t.chooseLanguage}
            </h1>

            <p>
              {t.selectLanguage}
            </p>

            <div className="language-grid">
              {languages.map(
                (language) => (
                  <button
                    key={
                      language.name
                    }
                    className={`language-card ${
                      selectedLanguage ===
                      language.name
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedLanguage(
                        language.name
                      )
                    }
                  >
                    <div>
                      <strong>
                        {
                          language.name
                        }
                      </strong>

                      <span>
                        {
                          language.sub
                        }
                      </span>
                    </div>

                    {selectedLanguage ===
                      language.name && (
                      <div className="language-check">
                        <Check size={16} />
                      </div>
                    )}
                  </button>
                )
              )}
            </div>

            <button
              className="primary-action full"
              disabled={
                !selectedLanguage
              }
              onClick={() =>
                setPage("details")
              }
            >
              {t.continue}
              <ArrowRight size={18} />
            </button>
          </div>
        </main>
      </div>
    );
  }

  return null;
}

export default PatientInterface;