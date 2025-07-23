import express from "express";
import authenticate from "../config/authMiddleware.js";
import register from "../controllers/register.js";
import login from "../controllers/login.js";
import { newuser, uploadMiddleware } from "../controllers/userDetails.js";
import facultyDashboard from "../controllers/facultyDashboard.js";
import { addProject, uploadMiddlewareP } from "../controllers/addProject.js";
import viewProjects from "../controllers/viewProject.js";
import academicFilter from "../controllers/academicFilter.js";
import amountFilter from "../controllers/amountFilter.js";
import facultyFilter from "../controllers/facultyFilter.js";
import industryFilter from "../controllers/industryFilter.js";
import adminDashboard from "../controllers/adminDashboard.js";
import editProject from "../controllers/editProject.js";
import deleteProject from "../controllers/deleteProject.js";
import getProjectById from "../controllers/getProjectById.js";


const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/newUser", uploadMiddleware, newuser);
router.get("/facultyDashboard", facultyDashboard);
router.post("/addProject", uploadMiddlewareP, addProject );
router.get("/viewProjects", viewProjects);
router.post("/academicFilter", academicFilter);
router.post("/amountFilter", amountFilter);
router.post("/facultyFilter", facultyFilter);
router.post("/industryFilter", industryFilter);
router.get("/adminDashboard", adminDashboard);
router.post("/editProject", editProject);
router.delete("/deleteProject", deleteProject);
router.get("/getProjectById/:id", getProjectById);



router.get("/protected-route", authenticate, (req, res) => {
    res.json({ message: "You accessed a protected route!", user: req.user });
});

export default router;