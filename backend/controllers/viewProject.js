import dotenv from "dotenv";
dotenv.config();

import { sheets } from "../index.js";
import jwt from "jsonwebtoken";

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const JWT_SECRET = process.env.JWT_KEY;

const viewProjects = async (req, res) => {
  try {
    // 🔹 Extract token from headers
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const loggedInUsername = decoded.username;

    // 🔹 Fetch faculty details from "faculty" sheet
    const usersResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "faculty!A:C", // A = email, B = Name
    });

    const users = usersResponse.data.values || [];
    const faculty = users.find(row => row[0] === loggedInUsername);

    if (!faculty) {
      return res.status(404).json({ message: "Faculty member not found" });
    }

    const facultyEmail = faculty[0];

    // 🔹 Fetch all projects
    const projectsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "faculty!A:S", // A = Email, B = Name, C-S = Project Details
    });

    const allProjects = projectsResponse.data.values || [];

    // 🔹 Filter and format projects
    const facultyProjects = allProjects
      .filter(row => row[0] === facultyEmail)
      .map(row => ({
        facultyEmail: row[0],
        facultyName: row[1],
        industry: row[2],
        duration: row[3],
        title: row[4],
        pi: row[5],
        piEmail: row[6],
        copi: row[7],
        copiEmail: row[8],
        academicYear: row[9],
        sanctionedAmt: row[10],
        receivedAmt: row[11],
        billFile: row[12],
        agreementFile: row[13],
        student1Name: row[14],
        student1Email: row[15],
        student2Name: row[16],
        student2Email: row[17],
        summary: row[18]
      }));

    if (facultyProjects.length === 0) {
      return res.status(404).json({ message: "No projects found for this faculty member" });
    }

    res.json({ projects: facultyProjects });
  } catch (error) {
    console.error("Error fetching faculty projects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default viewProjects;
