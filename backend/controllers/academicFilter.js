import dotenv from "dotenv";
import { sheets } from "../index.js";

dotenv.config();

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

const academicFilter = async (req, res) => {
    try {
        const { academicYear } = req.body;  // Get academic year from request

        if (!academicYear) {
            return res.status(400).json({ message: "Please provide an academic year in format YYYY-YYYY" });
        }

        // Fetch faculty projects data from Google Sheets
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: "faculty!A:S",  // A = Email, B = Name, others are project details
        });

        const allProjects = response.data.values || [];

        // Filter projects that match the given academic year
        const filteredProjects = allProjects.filter(row => row[9] === academicYear);

        if (filteredProjects.length === 0) {
            return res.status(404).json({ message: "No projects found for the given academic year" });
        }

        // Format the response to include faculty name, email, and project details
        const formattedProjects = filteredProjects.map(row => ({
            facultyEmail: row[0],  // Faculty email
            facultyName: row[1],   // Faculty name
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
        console.error("Academic Filter Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default academicFilter;
