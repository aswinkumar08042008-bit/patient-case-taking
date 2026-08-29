
import { useState } from "react";
import { Search, Bell, Users, ClipboardList, CheckCircle, ArrowLeft } from "lucide-react";
import "./DoctorDashboard.css";
function DoctorDashboard() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const patients = [
    {
      id: "P001",
      name: "Patient 01",
      age: 45,
      complaint: "Chest discomfort",
      status: "New",
    },
    {
      id: "P002",
      name: "Patient 02",
      age: 32,
      complaint: "Persistent headache",
      status: "Reviewed",
    },
    {
      id: "P003",
      name: "Patient 03",
      age: 27,
      complaint: "Fever and cough",
      status: "New",
    },
  ];
  const filteredPatients = patients.filter((patient) =>
  patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
  patient.complaint.toLowerCase().includes(searchTerm.toLowerCase())
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
        <p>
          Previous medical conditions, medicines, allergies and
          surgeries will appear here.
        </p>
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
                <strong>{patient.name}</strong>
                <small>{patient.id}</small>
              </div>

              <span>{patient.age}</span>

              <span>{patient.complaint}</span>

              <span
                className={`status ${
                  patient.status === "New" ? "status-new" : "status-reviewed"
                }`}
              >
                {patient.status}
              </span>

             <button
  className="view-btn"
  onClick={() => setSelectedPatient(patient)}
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