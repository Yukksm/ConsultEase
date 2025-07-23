import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AdminAmount.css"; // Make sure to link the correct CSS file

function AdminAmount() {
  const [amount, setSanctionedAmount] = useState("");
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const res = await axios.post("http://localhost:5000/amountFilter", { amount });
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error(err);
      setProjects([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  return (
    <div className="admin-amount-container">
      <button className="close-btn" onClick={() => navigate("/admin")}>Close</button>
      <h2>Filter Projects by Sanctioned Amount</h2>

      <form onSubmit={handleSubmit} className="filter-form">
        <label>Sanctioned Amount ≥ :</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setSanctionedAmount(e.target.value)}
          required
          className="amount-input"
        />
        <button type="submit" className="apply-btn">Search</button>
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

export default AdminAmount;
