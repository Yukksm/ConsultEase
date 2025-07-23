import dotenv from "dotenv";
dotenv.config();

import { sheets } from "../index.js";
import jwt from "jsonwebtoken";

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const JWT_SECRET = process.env.JWT_KEY;

const facultyDashboard = async (req, res) => {
    try {
        // Get the token from headers
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        const loggedInUsername = decoded.username;
        console.log(loggedInUsername);
        

        // Fetch faculty details from Google Sheets
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: "faculty!A:C", // A = Username, B = Name, C = Email
        });

        const users = response.data.values || [];
        
        // Find the logged-in faculty
        const faculty = users.find(row => row[0] === loggedInUsername);

        if (!faculty) {
            return res.status(404).json({ message: "Faculty member not found" });
        }

        const facultyName = faculty[1]; // Name
        const facultyEmail = faculty[0]; // Email

        res.json({ name: facultyName, email: facultyEmail });
        
        // Fetch all faculty projects
        const projectsResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: "faculty!A:S", // A = Email, B = Name, C = Industry, ..., L = Bill
        });

        const allProjects = projectsResponse.data.values || [];

        // Find faculty's projects
        const facultyProjects = allProjects.filter(row => row[0] === facultyEmail);

        // Check for missing bill entries (column index 12)
        //const pendingBillNotifications = facultyProjects
         //   .filter(row => !row[12]) // Empty bill column
         //   .map(row => `Bill settlement is needed for project: ${row[4]}`);

        res.json({
            name: facultyName,
            email: facultyEmail,
            //projects: facultyProjects.map(row => row.slice(2)), // Exclude faculty email & name
            //notifications: pendingBillNotifications,
        });
    } catch (error) {
        console.error("Faculty Dashboard Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default facultyDashboard;
