// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/loginPage";
import RegisterPage from "./components/registerPage";
import AddDetails from "./components/AddDetails";
import FacultyDashboard from "./components/facultydashboard";
import Updates from "./components/update";
import Admin from "./components/adminDashboard";
import AdminFaculty from "./components/adminFaculty";
import AdminAcademic from "./components/adminAcademic";
import AdminIndustry from "./components/adminIndustry";
import AdminAmount from "./components/adminAmount";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/add-details" element={<AddDetails />} />
        <Route path="/dashboard" element={<FacultyDashboard />} />
        <Route path="/update/:id" element={<Updates />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/adminFaculty" element={<AdminFaculty />} />
        <Route path="/adminAcademic" element={<AdminAcademic />} />
        <Route path="/adminIndustry" element={<AdminIndustry />} />
        <Route path="/adminAmount" element={<AdminAmount />} />


      </Routes>
    </Router>
  );
}

export default App;
