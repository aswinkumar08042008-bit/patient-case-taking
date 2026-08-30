
import { useState,useEffect } from "react";
import API from "../api/api";
import {
  Search,
  Bell,
  Users,
  ClipboardList,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import "./DoctorDashboard.css";

function DoctorDashboard() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
const [loading, setLoading] = useState(true);
const [medicalHistory, setMedicalHistory] = useState(null);
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

const fetchMedicalHistory = async (patientId) => {
  try {
    const response = await API.get(`/patients/${patientId}/history`);
    console.log("Medical history:", response.data);
    setMedicalHistory(response.data);
  } catch (error) {
    console.error("Failed to fetch medical history:", error);
    setMedicalHistory(null);
  }
};
  const filteredPatients = patients.filter((patient) =>
  patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  patient.id.toString().includes(searchTerm)
);
if (selectedPatient) {
  return (
    <div className="doctor-dashboard">
      <button
        className="back-btn"
        onClick={() => setSelectedPatient(null)}
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="patient-case-header">
        <h1>{selectedPatient.name}</h1>
        <p>
          Patient ID: {selectedPatient.id} | Age: {selectedPatient.age}
        </p>
      </div>

      <div className="case-card">
        <h2>Chief Complaint</h2>
        <p>{selectedPatient.complaint}</p>
      </div>

      <div className="case-card">
        <h2>AI Case Summary</h2>
        <p>
          The patient's information collected during the AI
          case-taking process will appear here.
        </p>
      </div>

      <div className="case-card">
  <h2>Medical History</h2>

  {medicalHistory && !medicalHistory.message ? (
    <>
      <p>
        <strong>Previous Conditions:</strong>{" "}
        {medicalHistory.previousConditions || "None"}
      </p>

      <p>
        <strong>Current Medicines:</strong>{" "}
        {medicalHistory.currentMedicines || "None"}
      </p>

      <p>
        <strong>Allergies:</strong>{" "}
        {medicalHistory.allergies || "None"}
      </p>

      <p>
        <strong>Previous Surgeries:</strong>{" "}
        {medicalHistory.previousSurgeries || "None"}
      </p>
    </>
  ) : (
    <p>No medical history found.</p>
  )}
</div>

      <div className="case-card">
        <h2>Medical Documents</h2>
        <p>
          Uploaded prescriptions, lab reports and other documents
          will appear here.
        </p>
      </div>
    </div>
  );
}
  return (
    <div className="doctor-dashboard">
      <header className="doctor-header">
        <div>
          <h1>Doctor Dashboard</h1>
          <p>Review and manage patient cases</p>
        </div>

        <button className="notification-btn">
          <Bell size={20} />
        </button>
      </header>

      <div className="doctor-welcome">
        <h2>Good Morning, Doctor</h2>
        <p>Here is an overview of today's patient cases.</p>
      </div>

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
            <CheckCircle size={24} />
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
            <p>Total Cases</p>
            <h2>40</h2>
          </div>
        </div>
      </div>

      <section className="patient-section">
        <div className="section-header">
          <div>
            <h2>Recent Patient Cases</h2>
            <p>Review the latest patient information.</p>
          </div>

          <div className="search-box">
            <Search size={19} />
            <input
  type="text"
  placeholder="Search patient..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
          </div>
        </div>

        <div className="patient-table">
          <div className="table-header">
            <span>Patient</span>
            <span>Age</span>
            <span>Chief Complaint</span>
            <span>Status</span>
            <span>Action</span>
          </div>

{filteredPatients.map((patient) => (            <div className="patient-row" key={patient.id}>
              <div>
                <strong>{patient.fullName}</strong>
                <small>Patient ID: {patient.id}</small>
              </div>

              <span>{patient.age}</span>

              <span>Patient details available</span>

              <span className="status status-new">
  New
</span>

             <button
  className="view-btn"
onClick={() => {
  setSelectedPatient(patient);
  fetchMedicalHistory(patient.id);
}}
>
  View Case
</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

  
export default DoctorDashboard;