import dotenv from "dotenv";
dotenv.config();

import { sheets } from "../index.js";
import jwt from "jsonwebtoken";

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const JWT_SECRET = process.env.JWT_KEY;

const getProjectById = async (req, res) => {
  const { id } = req.params; // this could be project title or any unique field

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const loggedInUsername = decoded.username;

    // Get all projects for all faculty
    const projectsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "faculty!A:S", // adjust if more columns
    });

    const allProjects = projectsResponse.data.values || [];

    // Map header
    const headers = [
      "facultyEmail", "facultyName", "industry", "duration", "title",
      "pi", "piEmail", "copi", "copiEmail", "academicYear", "sanctionedAmt",
      "receivedAmt", "billFile", "agreementFile", "student1Name", "student1Email",
      "student2Name", "student2Email", "summary"
    ];

    const project = allProjects
      .map(row => {
        const entry = {};
        headers.forEach((h, i) => {
          entry[h] = row[i] || "";
        });
        return entry;
      })
      .find(p => p.title === id && p.facultyEmail === loggedInUsername);

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (err) {
    console.error("Error fetching project by ID:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default getProjectById;
