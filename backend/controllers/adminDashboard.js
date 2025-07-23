import dotenv from "dotenv";
import { sheets } from "../index.js";

dotenv.config();

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

const adminDashboard = async (req, res) => {
    try {
        // Fetch all projects from Google Sheets
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: "faculty!A:S", // Adjust range as needed
        });

        const allProjects = response.data.values || [];

        if (allProjects.length <= 1) {
            return res.status(404).json({ message: "No projects found in the sheet" });
        }
        const dataRows = allProjects.slice(1);
        // Format all projects
        const formattedProjects = dataRows.map(row => ({
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

        res.json({ projects: formattedProjects });
    } catch (error) {
        console.error("Admin Dashboard Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default adminDashboard;
