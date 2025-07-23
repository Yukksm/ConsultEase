// src/pages/AddDetails.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/AddDetails.module.css"; // Import CSS module

const AddDetails = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "", name: "", industry: "", duration: "", title: "",
    pi: "", piemail: "", copi: "", copiemail: "", academicyear: "",
    sanctionedAmt: "", receivedAmt: "", student1name: "", student1email: "",
    student2name: "", student2email: "", summary: ""
  });

  const [billFile, setBillFile] = useState(null);
  const [agreementFile, setAgreementFile] = useState(null);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    const { name, files } = e.target;
    if (name === "bill") setBillFile(files[0]);
    if (name === "agreement") setAgreementFile(files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (billFile) data.append("bill", billFile);
      if (agreementFile) data.append("agreement", agreementFile);

      const res = await fetch("http://localhost:5000/newUser", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: data
      });

      const result = await res.json();
      if (res.ok) {
        alert("Project added successfully!");
        navigate("/login");
      } else {
        alert(`Error: ${result.message || result.error}`);
      }
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>ConsultEase</div>
        <div className={styles.navLinks}>
          <button>About</button>
          <button>Hello</button>
        </div>
      </nav>

      <div className={styles.mainContent}>
        <div className={styles.formSection}>
          <div className={styles.formBox}>
            <h2 className={styles.formTitle}>Add Project Details</h2>
            <form className={styles.form} onSubmit={handleSubmit} encType="multipart/form-data">
              <input name="email" placeholder="Email" onChange={handleChange} required />
              <input name="name" placeholder="Faculty Name" onChange={handleChange} required />
              <input name="industry" placeholder="Industry Name" onChange={handleChange} required />
              <input name="duration" placeholder="Project Duration" onChange={handleChange} required />
              <input name="title" placeholder="Title" onChange={handleChange} required />
              <input name="pi" placeholder="Principal Investigator" onChange={handleChange} required />
              <input name="piemail" placeholder="PI Email" onChange={handleChange} required />
              <input name="copi" placeholder="Co-PI" onChange={handleChange} />
              <input name="copiemail" placeholder="Co-PI Email" onChange={handleChange} />
              <input name="academicyear" placeholder="Academic Year" onChange={handleChange} />
              <input name="sanctionedAmt" placeholder="Sanctioned Amount" onChange={handleChange} />
              <input name="receivedAmt" placeholder="Received Amount" onChange={handleChange} />
              <input name="student1name" placeholder="Student 1 Name" onChange={handleChange} />
              <input name="student1email" placeholder="Student 1 Email" onChange={handleChange} />
              <input name="student2name" placeholder="Student 2 Name" onChange={handleChange} />
              <input name="student2email" placeholder="Student 2 Email" onChange={handleChange} />
              <textarea name="summary" placeholder="Project Summary" onChange={handleChange}></textarea>

              <label>Upload Bill PDF:</label>
              <input type="file" name="bill" accept="application/pdf" onChange={handleFileChange} />

              <label>Upload Agreement PDF:</label>
              <input type="file" name="agreement" accept="application/pdf" onChange={handleFileChange} />

              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
        <div className={styles.imageSection}></div>
      </div>
    </div>
  );
};

export default AddDetails;
