// src/pages/RegisterPage.js
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/LoginPage.css"; // Import the same CSS file

const RegisterPage = () => {
  const [form, setForm] = useState({ username: "", password: "", usertype: "user" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const aboutRef = useRef(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/register", form);
      setMessage("Registration successful!");
      if (form.usertype === "admin") {
        navigate("/admin");
      } else {
        setTimeout(() => {
          navigate("/add-details");
        }, 7000);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="page-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">ConsultEase</div>
        <div className="nav-links">
          <button onClick={scrollToAbout}>About</button>
          <button onClick={scrollToAbout}>Hello</button>
        </div>
      </nav>

      {/* Main content */}
      <div className="main-content">
        <div className="login-section">
          <div className="login-box">
            <h2 className="login-title">Register for ConsultEase</h2>
            <form className="login-form" onSubmit={handleSubmit}>
              <input name="username" placeholder="Username" onChange={handleChange} required />
              <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
              <select name="usertype" onChange={handleChange}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit">Register</button>
            </form>
            <p className="message">{message}</p>
            <p className="register-link">
              Have an account?{" "}
              <span onClick={() => navigate("/login")}>Click here to login</span>
            </p>
          </div>

          {/* About section */}
          <div ref={aboutRef} className="about-section">
            <h3>About ConsultEase</h3>
            <p>
              ConsultEase is a smart platform that connects professionals, students, and mentors. 
              Whether you're a learner seeking guidance or a consultant looking to assist, this app 
              makes collaboration seamless and meaningful.
            </p>
          </div>
        </div>

        <div className="image-section"></div>
      </div>
    </div>
  );
};

export default RegisterPage;
