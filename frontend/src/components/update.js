import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../styles/Up.module.css"; // Importing modular CSS

const Updates = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState({});
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/getProjectById/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProject(res.data);
      } catch (err) {
        console.error(err);
        setMessage("Error fetching project details");
      }
    };

    fetchProject();
  }, [id, token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const updatedProject = {
      name: formData.get("name"),
      title: formData.get("title"),
      industry: formData.get("industry"),
      duration: formData.get("duration"),
      pi: formData.get("pi"),
      piemail: formData.get("piemail"),
      copi: formData.get("copi"),
      copiemail: formData.get("copiemail"),
      sanctionedAmt: formData.get("sanctionedAmt"),
      receivedAmt: formData.get("receivedAmt"),
      student1name: formData.get("student1name"),
      student1email: formData.get("student1email"),
      student2name: formData.get("student2name"),
      student2email: formData.get("student2email"),
      summary: formData.get("summary"),
      academicyear: formData.get("academicyear"),
      bill: formData.get("bill"),
      agreement: formData.get("agreement"),
    };

    try {
      await axios.post(
        "http://localhost:5000/editProject",
        { id, updatedData: updatedProject },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Project updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setMessage("Failed to update project.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <div className={styles.logo}>ConsultEase</div>
        <button className={styles.logout} onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}>
          Logout
        </button>
      </div>

      <form className={styles.form} onSubmit={handleUpdate}>
        <h2 className={styles.title}>Update Project</h2>

        <input name="name" defaultValue={project.facultyName} placeholder="Faculty Name" required />
        <input name="title" defaultValue={project.title} placeholder="Project Title" required />
        <input name="industry" defaultValue={project.industry} placeholder="Industry Partner" required />
        <input name="duration" defaultValue={project.duration} placeholder="Duration" required />
        <input name="pi" defaultValue={project.pi} placeholder="PI Name" required />
        <input name="piemail" defaultValue={project.piEmail} placeholder="PI Email" required />
        <input name="copi" defaultValue={project.copi} placeholder="Co-PI Name" required />
        <input name="copiemail" defaultValue={project.copiEmail} placeholder="Co-PI Email" required />
        <input name="sanctionedAmt" defaultValue={project.sanctionedAmt} placeholder="Sanctioned Amount" required />
        <input name="receivedAmt" defaultValue={project.receivedAmt} placeholder="Received Amount" required />
        <input name="academicyear" defaultValue={project.academicYear} placeholder="Academic Year" required />
        <input name="student1name" defaultValue={project.student1Name} placeholder="Student 1 Name" required />
        <input name="student1email" defaultValue={project.student1Email} placeholder="Student 1 Email" required />
        <input name="student2name" defaultValue={project.student2Name} placeholder="Student 2 Name" />
        <input name="student2email" defaultValue={project.student2Email} placeholder="Student 2 Email" />
        <textarea name="summary" defaultValue={project.summary} placeholder="Project Summary" required />
        <input name="bill" defaultValue={project.billFile} placeholder="Bill File" />
        <input name="agreement" defaultValue={project.agreementFile} placeholder="Agreement File" />

        <button type="submit" className={styles.submitBtn}>Update</button>
        <p className={styles.message}>{message}</p>
      </form>
    </div>
  );
};

export default Updates;
