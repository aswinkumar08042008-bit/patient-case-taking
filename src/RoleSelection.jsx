import { User, Stethoscope } from "lucide-react";
import "./RoleSelection.css";

function RoleSelection({ onSelectRole }) {
  return (
    <div className="role-page">
      <div className="role-container">
        <div className="role-logo">M</div>

        <h1>Welcome to MediVoice</h1>
        <p className="role-subtitle">Please select your role to continue</p>

        <div className="role-options">
          <button
            className="role-card"
            onClick={() => onSelectRole("patient")}
          >
            <div className="role-icon">
              <User size={30} />
            </div>

            <div>
              <h2>Patient</h2>
              <p>Continue as a patient</p>
            </div>
          </button>

          <button
            className="role-card"
            onClick={() => onSelectRole("doctor")}
          >
            <div className="role-icon">
              <Stethoscope size={30} />
            </div>

            <div>
              <h2>Doctor</h2>
              <p>Continue as a doctor</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;