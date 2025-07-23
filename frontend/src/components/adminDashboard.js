import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";
import filterIcon from "../assets/filter.png";

function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/adminDashboard");
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error(err);
      setProjects([]);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="navbar">
        <div className="navbar-left">Consultease</div>
        <div className="navbar-right">
          <button className="logout-btn" onClick={handleLogout}>
            
            Logout
          </button>
          <p>hellp</p>
        </div>
      </div>

      <div className="container mt-3">
        <div className="heading-section">
          <h2>Welcome, Admin</h2>
          <img
            src={filterIcon}
            alt="Filter"
            className="filter-icon"
            onClick={() => setShowModal(true)}
          />
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h4>Sort By</h4>
              <button onClick={() => navigate("/adminFaculty")}>Faculty</button>
              <button onClick={() => navigate("/adminAcademic")}>Academic Year</button>
              <button onClick={() => navigate("/adminIndustry")}>Industry</button>
              <button onClick={() => navigate("/adminAmount")}>Sanctioned Amount</button>
              <button onClick={() => setShowModal(false)} style={{ marginTop: "10px" }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="table-container">
          <table className="table table-bordered mt-3">
            <thead>
              <tr>
                <th>Faculty Name</th>
                <th>Faculty Email</th>
                <th>Industry</th>
                <th>Duration</th>
                <th>Title</th>
                <th>PI</th>
                <th>PI Email</th>
                <th>Co-PI</th>
                <th>Co-PI Email</th>
                <th>Academic Year</th>
                <th>Sanctioned</th>
                <th>Received</th>
                <th>Student 1</th>
                <th>Student 1 Email</th>
                <th>Student 2</th>
                <th>Student 2 Email</th>
                <th>Bill File</th>
                <th>Agreement File</th>
                <th>Summary</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj, idx) => (
                <tr key={idx}>
                  <td>{proj.facultyName}</td>
                  <td>{proj.facultyEmail}</td>
                  <td>{proj.industry}</td>
                  <td>{proj.duration}</td>
                  <td>{proj.title}</td>
                  <td>{proj.pi}</td>
                  <td>{proj.piEmail}</td>
                  <td>{proj.copi}</td>
                  <td>{proj.copiEmail}</td>
                  <td>{proj.academicYear}</td>
                  <td>{proj.sanctionedAmt}</td>
                  <td>{proj.receivedAmt}</td>
                  <td>{proj.student1Name}</td>
                  <td>{proj.student1Email}</td>
                  <td>{proj.student2Name}</td>
                  <td>{proj.student2Email}</td>
                  <td>{proj.billFile}</td>
                  <td>{proj.agreementFile}</td>
                  <td>{proj.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
