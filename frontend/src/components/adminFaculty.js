import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AdminFaculty.css";

function AdminFaculty() {
  const [facultyName, setFacultyName] = useState("");
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/facultyFilter", { facultyName });
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-faculty-container">
      <button className="close-btn" onClick={() => navigate("/admin")}>Close</button>
      <h2>Filter by Faculty</h2>

      <form onSubmit={handleSubmit} className="filter-form">
        <label>Enter Faculty Name:</label>
        <input 
          type="text" 
          value={facultyName} 
          onChange={(e) => setFacultyName(e.target.value)} 
          className="faculty-input"
        />
        <button type="submit" className="apply-btn">Apply Filter</button>
      </form>

      {projects.length > 0 && (
        <div className="table-container">
          <table className="table table-bordered">
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
      )}
    </div>
  );
}

export default AdminFaculty;
