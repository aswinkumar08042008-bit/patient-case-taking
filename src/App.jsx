import { useState } from "react";
import RoleSelection from "./RoleSelection";
import DoctorDashboard from "./doctor/DoctorDashboard";
import PatientInterface from "./PatientInterface";

function App() {
  const [userType, setUserType] = useState(null);

  if (userType === null) {
    return <RoleSelection onSelectRole={setUserType} />;
  }

  if (userType === "doctor") {
    return <DoctorDashboard />;
  }

  if (userType === "patient") {
    return <PatientInterface />;
  }
}

export default App;