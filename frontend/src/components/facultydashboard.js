import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../styles/FacultyDashboard.module.css";

const FacultyDashboard = () => {
  const [faculty, setFaculty] = useState({ name: "", email: "" });
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const facultyRes = await axios.get("http://localhost:5000/facultyDashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFaculty(facultyRes.data);

        const projectRes = await axios.get("http://localhost:5000/viewProjects", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProjects(projectRes.data.projects);
      } catch (err) {
        console.error(err);
        setMessage("Error loading dashboard");
      }
    };

    fetchData();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete("http://localhost:5000/deleteProject", {
        headers: { Authorization: `Bearer ${token}` },
        data: { id }
      });
      setProjects(projects.filter((p) => p.id !== id));
      setMessage("Project deleted!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete project.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/update/${id}`);
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      setMessage("Adding project...");
      await axios.post("http://localhost:5000/addProject", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      setMessage("Project added!");
      setShowAddForm(false);
      const projectRes = await axios.get("http://localhost:5000/viewProjects", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(projectRes.data.projects);
    } catch (err) {
      console.error(err);
      setMessage("Failed to add project");
    }
  };

  return (
    <div className={styles.background}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>ConsultEase</div>
        <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
      </nav>

      <div className={styles.container}>
        <h2 className={styles.greeting}>Hello there, {faculty.name}</h2>
        <p className={styles.email}>Email: {faculty.email}</p>

        <h3 className={styles.heading}>Your Projects</h3>

        {projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.projectTable}>
              <thead>
                <tr>
                  <th>Industry Name</th>
                  <th>Project Duration</th>
                  <th>Title</th>
                  <th>Principle Investigator</th>
                  <th>PI Email</th>
                  <th>Co-PI</th>
                  <th>Co-PI Email</th>
                  <th>Academic Year</th>
                  <th>Amount Sanctioned</th>
                  <th>Amount Received</th>
                  <th>Bill Settlement</th>
                  <th>Signed Agreement</th>
                  <th>Student 1 Name</th>
                  <th>Student 1 Email</th>
                  <th>Student 2 Name</th>
                  <th>Student 2 Email</th>
                  <th>Summary</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>{project.industry}</td>
                    <td>{project.duration}</td>
                    <td>{project.title}</td>
                    <td>{project.pi}</td>
                    <td>{project.piEmail}</td>
                    <td>{project.copi}</td>
                    <td>{project.copiEmail}</td>
                    <td>{project.academicYear}</td>
                    <td>{project.sanctionedAmt}</td>
                    <td>{project.receivedAmt}</td>
                    <td>{project.billFile || "Not uploaded"}</td>
                    <td>{project.agreementFile || "Not uploaded"}</td>
                    <td>{project.student1Name}</td>
                    <td>{project.student1Email}</td>
                    <td>{project.student2Name}</td>
                    <td>{project.student2Email}</td>
                    <td>{project.summary}</td>
                    <td>
                      <button className={styles.editBtn} onClick={() => handleEdit(project.title)}>Edit</button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(project.title)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button onClick={() => setShowAddForm(!showAddForm)} className={styles.toggleBtn}>
          {showAddForm ? "Cancel" : "Add Project"}
        </button>

        {showAddForm && (
          <form onSubmit={handleAddProject} className={styles.projectForm}>
            <h4>Add New Project</h4>
            <input name="title" placeholder="Title" required />
            <input name="industry" placeholder="Industry" required />
            <input name="duration" placeholder="Duration" required />
            <input name="pi" placeholder="PI" required />
            <input name="piemail" placeholder="PI Email" required />
            <input name="copi" placeholder="Co-PI" required />
            <input name="copiemail" placeholder="Co-PI Email" required />
            <input name="sanctionedAmt" placeholder="Sanctioned Amount" required />
            <input name="receivedAmt" placeholder="Received Amount" required />
            <input name="student1name" placeholder="Student 1 Name" required />
            <input name="student1email" placeholder="Student 1 Email" required />
            <input name="student2name" placeholder="Student 2 Name" />
            <input name="student2email" placeholder="Student 2 Email" />
            <input name="summary" placeholder="Summary" required />
            <input name="academicyear" placeholder="Academic Year" required />
            <input type="file" name="bill" />
            <input type="file" name="agreement" />
            <button type="submit" className={styles.submitBtn}>Submit</button>
          </form>
        )}

        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
};

export default FacultyDashboard;
