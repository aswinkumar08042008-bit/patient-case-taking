import { useEffect, useState } from "react";
import API from "../api/api";

import {
  LayoutDashboard,
  Users,
  ClipboardList,
  HeartPulse,
  FileText,
  FileCheck,
  Bell,
  Settings,
  Search,
  ArrowLeft,
  Stethoscope,
  LogOut,
} from "lucide-react";

import "./DoctorDashboard.css";

function DoctorDashboard() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [medicalHistory, setMedicalHistory] = useState(null);

  const [doctorNotes, setDoctorNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);

  const [activeSection, setActiveSection] = useState("dashboard");

  /* =====================================================
     LOAD PATIENTS
  ===================================================== */

  useEffect(() => {
    API.get("/patients")
      .then((response) => {
        console.log("Patients received:", response.data);

        setPatients(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch patients:", error);
        setLoading(false);
      });
  }, []);

  /* =====================================================
     FETCH MEDICAL HISTORY
  ===================================================== */

  const fetchMedicalHistory = async (patientId) => {
    try {
      const response = await API.get(
        `/patients/${patientId}/history`
      );

      console.log("Medical history:", response.data);

      setMedicalHistory(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch medical history:",
        error
      );

      setMedicalHistory(null);
    }
  };

  /* =====================================================
     FETCH DOCTOR NOTES
  ===================================================== */

  const fetchDoctorNotes = async (patientId) => {
    try {
      const response = await API.get(
        `/patients/${patientId}/notes`
      );

      console.log("Saved doctor notes:", response.data);

      setSavedNotes(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch doctor notes:",
        error
      );

      setSavedNotes([]);
    }
  };

  /* =====================================================
     OPEN PATIENT CASE
  ===================================================== */

  const openPatientCase = (patient) => {
    setSelectedPatient(patient);

    setActiveSection("patients");

    setDoctorNotes("");

    fetchMedicalHistory(patient.id);
    fetchDoctorNotes(patient.id);
  };

  /* =====================================================
     BACK TO DASHBOARD
  ===================================================== */

  const backToDashboard = () => {
    setSelectedPatient(null);
    setMedicalHistory(null);
    setDoctorNotes("");
    setSavedNotes([]);
  };

  /* =====================================================
     SAVE DOCTOR NOTE
  ===================================================== */

  const saveDoctorNote = async () => {
    if (!doctorNotes.trim()) {
      alert("Please enter a note first.");
      return;
    }

    try {
      const response = await API.post(
        `/patients/${selectedPatient.id}/notes`,
        {
          patient_id: selectedPatient.id,
          note: doctorNotes,
        }
      );

      console.log(
        "Doctor note saved:",
        response.data
      );

      /*
       * Add newly saved note immediately
       * to the displayed notes.
       */

      setSavedNotes((previousNotes) => [
        ...previousNotes,
        response.data.note,
      ]);

      setDoctorNotes("");

      alert("Doctor note saved successfully.");
    } catch (error) {
      console.error(
        "Failed to save doctor note:",
        error
      );

      alert("Failed to save doctor note.");
    }
  };

  /* =====================================================
     FILTER PATIENTS
  ===================================================== */

  const filteredPatients = patients.filter(
    (patient) =>
      patient.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      patient.id
        .toString()
        .includes(searchTerm)
  );

  /* =====================================================
     SIDEBAR
  ===================================================== */

  const Sidebar = () => {
    return (
      <aside className="doctor-sidebar">

        {/* LOGO */}

        <div className="sidebar-logo">

          <div className="sidebar-logo-icon">
            <Stethoscope size={23} />
          </div>

          <div>
            <h2>MediVoice</h2>
            <span>Clinical System</span>
          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="sidebar-nav">

          <div className="sidebar-nav-title">
            Main Menu
          </div>

          <button
            className={
              activeSection === "dashboard"
                ? "active"
                : ""
            }
            onClick={() => {
              backToDashboard();
              setActiveSection("dashboard");
            }}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button
            className={
              activeSection === "patients"
                ? "active"
                : ""
            }
            onClick={() => {
              setSelectedPatient(null);
              setActiveSection("patients");
            }}
          >
            <Users size={18} />
            <span>Patients</span>
          </button>

          <button
            className={
              activeSection === "cases"
                ? "active"
                : ""
            }
            onClick={() => {
              setSelectedPatient(null);
              setActiveSection("cases");
            }}
          >
            <ClipboardList size={18} />
            <span>Patient Cases</span>
          </button>

          <button
            className={
              activeSection === "history"
                ? "active"
                : ""
            }
            onClick={() => {
              setSelectedPatient(null);
              setActiveSection("history");
            }}
          >
            <HeartPulse size={18} />
            <span>Medical History</span>
          </button>

          <button
            className={
              activeSection === "notes"
                ? "active"
                : ""
            }
            onClick={() => {
              setSelectedPatient(null);
              setActiveSection("notes");
            }}
          >
            <FileText size={18} />
            <span>Doctor Notes</span>
          </button>

          <button
            className={
              activeSection === "documents"
                ? "active"
                : ""
            }
            onClick={() => {
              setSelectedPatient(null);
              setActiveSection("documents");
            }}
          >
            <FileCheck size={18} />
            <span>Documents</span>
          </button>

          <div className="sidebar-nav-title">
            System
          </div>

          <button
            className={
              activeSection === "notifications"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection("notifications")
            }
          >
            <Bell size={18} />
            <span>Notifications</span>
          </button>

          <button
            className={
              activeSection === "settings"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveSection("settings")
            }
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>

        </nav>

        {/* DOCTOR PROFILE */}

        <div className="sidebar-bottom">

          <div className="doctor-profile">

            <div className="doctor-avatar">
              DR
            </div>

            <div>
              <strong>Doctor</strong>
              <span>Medical Officer</span>
            </div>

          </div>

        </div>

      </aside>
    );
  };

  /* =====================================================
     PATIENT CASE PAGE
  ===================================================== */

  if (selectedPatient) {
    return (
      <div className="doctor-dashboard">

        <Sidebar />

        <main className="doctor-main">

          <button
            className="back-btn"
            onClick={backToDashboard}
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

          {/* PATIENT HEADER */}

          <div className="patient-case-header">

            <h1>
              {selectedPatient.fullName}
            </h1>

            <p>
              Patient ID: {selectedPatient.id}
              {" | "}
              Age: {selectedPatient.age}
            </p>

            <p>
              Gender: {selectedPatient.gender}
              {" | "}
              Phone: {selectedPatient.phoneNumber}
            </p>

          </div>

          {/* PATIENT INFORMATION */}

          <div className="case-card">

            <h2>Patient Information</h2>

            <p>
              <strong>Name:</strong>{" "}
              {selectedPatient.fullName}
            </p>

            <p>
              <strong>Age:</strong>{" "}
              {selectedPatient.age}
            </p>

            <p>
              <strong>Gender:</strong>{" "}
              {selectedPatient.gender}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {selectedPatient.phoneNumber}
            </p>

          </div>

          {/* AI CASE SUMMARY */}

          <div className="case-card">

            <h2>AI Case Summary</h2>

            <p>
              The patient's information collected
              during the AI case-taking process will
              appear here.
            </p>

          </div>

          {/* MEDICAL HISTORY */}

          <div className="case-card">

            <h2>Medical History</h2>

            {medicalHistory &&
            !medicalHistory.message ? (

              <div className="medical-history-grid">

                <div className="history-item">
                  <span>
                    Previous Conditions
                  </span>

                  <strong>
                    {medicalHistory.previousConditions ||
                      "None"}
                  </strong>
                </div>

                <div className="history-item">
                  <span>
                    Current Medicines
                  </span>

                  <strong>
                    {medicalHistory.currentMedicines ||
                      "None"}
                  </strong>
                </div>

                <div className="history-item">
                  <span>
                    Allergies
                  </span>

                  <strong>
                    {medicalHistory.allergies ||
                      "None"}
                  </strong>
                </div>

                <div className="history-item">
                  <span>
                    Previous Surgeries
                  </span>

                  <strong>
                    {medicalHistory.previousSurgeries ||
                      "None"}
                  </strong>
                </div>

              </div>

            ) : (

              <p>
                No medical history found.
              </p>

            )}

          </div>

          {/* DOCTOR NOTES */}

          <div className="case-card doctor-notes-card">

            <h2>Doctor Notes</h2>

            <p className="notes-description">
              Add observations, diagnosis, or
              treatment notes for this patient.
            </p>

            <textarea
              className="doctor-notes-input"
              placeholder="Write your notes here..."
              value={doctorNotes}
              onChange={(e) =>
                setDoctorNotes(e.target.value)
              }
            />

            <div className="notes-actions">

              <button
                className="save-notes-btn"
                onClick={saveDoctorNote}
              >
                Save Notes
              </button>

            </div>

            {/* SAVED NOTES */}

            {savedNotes.length > 0 && (

              <div className="saved-notes">

                <h3>
                  Previous Notes
                </h3>

                {savedNotes.map(
                  (savedNote) => (

                    <div
                      className="saved-note"
                      key={savedNote.id}
                    >

                      <p>
                        {savedNote.note}
                      </p>

                      <small>
                        {savedNote.created_at
                          ? new Date(
                              savedNote.created_at
                            ).toLocaleString()
                          : "Date unavailable"}
                      </small>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

          {/* DOCUMENTS */}

          <div className="case-card">

            <h2>
              Medical Documents
            </h2>

            <p>
              Uploaded prescriptions, laboratory
              reports and other medical documents
              will appear here.
            </p>

          </div>

        </main>

      </div>
    );
  }

  /* =====================================================
     MAIN DASHBOARD
  ===================================================== */

  return (
    <div className="doctor-dashboard">

      <Sidebar />

      <main className="doctor-main">

        {/* HEADER */}

        <header className="doctor-header">

          <div>
            <h1>
              Doctor Dashboard
            </h1>

            <p>
              Review and manage patient cases
            </p>
          </div>

          <button
            className="notification-btn"
            onClick={() =>
              setActiveSection("notifications")
            }
          >
            <Bell size={20} />
          </button>

        </header>

        {/* =================================================
            DASHBOARD
        ================================================= */}

        {activeSection === "dashboard" && (

          <>

            {/* WELCOME */}

            <div className="doctor-welcome">

              <h2>
                Good Morning, Doctor
              </h2>

              <p>
                Here is an overview of today's
                patient cases.
              </p>

            </div>

            {/* STATISTICS */}

            <div className="stats-grid">

              <div className="stat-card">

                <div className="stat-icon">
                  <ClipboardList size={24} />
                </div>

                <div>
                  <p>New Cases</p>
                  <h2>12</h2>
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon">
                  <FileCheck size={24} />
                </div>

                <div>
                  <p>Reviewed Cases</p>
                  <h2>28</h2>
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon">
                  <Users size={24} />
                </div>

                <div>
                  <p>Total Patients</p>
                  <h2>
                    {patients.length}
                  </h2>
                </div>

              </div>

            </div>

            {/* PATIENTS */}

            <section className="patient-section">

              <div className="section-header">

                <div>

                  <h2>
                    Recent Patient Cases
                  </h2>

                  <p>
                    Review the latest patient
                    information.
                  </p>

                </div>

                <div className="search-box">

                  <Search size={19} />

                  <input
                    type="text"
                    placeholder="Search patient..."
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(
                        e.target.value
                      )
                    }
                  />

                </div>

              </div>

              {loading ? (

                <p>
                  Loading patients...
                </p>

              ) : (

                <div className="patient-table">

                  <div className="table-header">

                    <span>Patient</span>
                    <span>Age</span>
                    <span>Chief Complaint</span>
                    <span>Status</span>
                    <span>Action</span>

                  </div>

                  {filteredPatients.length === 0 ? (

                    <div className="patient-row">

                      <p>
                        No patients found.
                      </p>

                    </div>

                  ) : (

                    filteredPatients.map(
                      (patient) => (

                        <div
                          className="patient-row"
                          key={patient.id}
                        >

                          <div>

                            <strong>
                              {patient.fullName}
                            </strong>

                            <small>
                              Patient ID:{" "}
                              {patient.id}
                            </small>

                          </div>

                          <span>
                            {patient.age}
                          </span>

                          <span>
                            Patient details
                            available
                          </span>

                          <span className="status status-new">
                            New
                          </span>

                          <button
                            className="view-btn"
                            onClick={() =>
                              openPatientCase(
                                patient
                              )
                            }
                          >
                            View Case
                          </button>

                        </div>

                      )
                    )

                  )}

                </div>

              )}

            </section>

          </>

        )}

        {/* =================================================
            PATIENTS SECTION
        ================================================= */}

        {activeSection === "patients" && (

          <section className="patient-section">

            <div className="section-header">

              <div>

                <h2>
                  All Patients
                </h2>

                <p>
                  View and manage registered
                  patients.
                </p>

              </div>

              <div className="search-box">

                <Search size={19} />

                <input
                  type="text"
                  placeholder="Search patient..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            <div className="patient-table">

              <div className="table-header">

                <span>Patient</span>
                <span>Age</span>
                <span>Gender</span>
                <span>Status</span>
                <span>Action</span>

              </div>

              {filteredPatients.map(
                (patient) => (

                  <div
                    className="patient-row"
                    key={patient.id}
                  >

                    <div>

                      <strong>
                        {patient.fullName}
                      </strong>

                      <small>
                        Patient ID:{" "}
                        {patient.id}
                      </small>

                    </div>

                    <span>
                      {patient.age}
                    </span>

                    <span>
                      {patient.gender}
                    </span>

                    <span className="status status-new">
                      Active
                    </span>

                    <button
                      className="view-btn"
                      onClick={() =>
                        openPatientCase(
                          patient
                        )
                      }
                    >
                      View Case
                    </button>

                  </div>

                )
              )}

            </div>

          </section>

        )}

        {/* =================================================
            PATIENT CASES
        ================================================= */}

        {activeSection === "cases" && (

          <div className="case-card">

            <h2>
              Patient Cases
            </h2>

            <p>
              Patient cases and AI-generated
              clinical information will appear
              in this section.
            </p>

          </div>

        )}

        {/* =================================================
            MEDICAL HISTORY
        ================================================= */}

        {activeSection === "history" && (

          <div className="case-card">

            <h2>
              Medical History
            </h2>

            <p>
              Select a patient from the Patients
              section to view their medical history.
            </p>

          </div>

        )}

        {/* =================================================
            DOCTOR NOTES
        ================================================= */}

        {activeSection === "notes" && (

          <div className="case-card">

            <h2>
              Doctor Notes
            </h2>

            <p>
              Select a patient to view and add
              clinical notes.
            </p>

          </div>

        )}

        {/* =================================================
            DOCUMENTS
        ================================================= */}

        {activeSection === "documents" && (

          <div className="case-card">

            <h2>
              Medical Documents
            </h2>

            <p>
              Prescriptions, laboratory reports,
              scans and other patient documents
              will appear here.
            </p>

          </div>

        )}

        {/* =================================================
            NOTIFICATIONS
        ================================================= */}

        {activeSection === "notifications" && (

          <div className="case-card">

            <h2>
              Notifications
            </h2>

            <p>
              No new notifications.
            </p>

          </div>

        )}

        {/* =================================================
            SETTINGS
        ================================================= */}

        {activeSection === "settings" && (

          <div className="case-card">

            <h2>
              Settings
            </h2>

            <p>
              Doctor account and system settings
              will appear here.
            </p>

          </div>

        )}

      </main>

    </div>
  );
}

export default DoctorDashboard;