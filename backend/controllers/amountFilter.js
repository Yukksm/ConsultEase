import dotenv from "dotenv";
import { sheets } from "../index.js";

dotenv.config();

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

const amountFilter = async (req, res) => {
    try {
        const { amount } = req.body;  // Get amount from request

        if (!amount || isNaN(amount)) {
            return res.status(400).json({ message: "Please provide a valid amount" });
        }

        // Convert input amount to number
        const minAmount = parseFloat(amount);

        // Fetch faculty projects data from Google Sheets
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: "faculty!A:S",  // A = Email, B = Name, other columns are project details
        });

        const allProjects = response.data.values || [];

        // Filter projects where sanctionedAmt (column index 10) is >= entered amount
        const filteredProjects = allProjects.filter(row => {
            const sanctionedAmt = parseFloat(row[10]); // Convert sanctioned amount to number
            return !isNaN(sanctionedAmt) && sanctionedAmt >= minAmount;
        });

        if (filteredProjects.length === 0) {
            return res.status(404).json({ message: "No projects found with sanctioned amount greater than or equal to the entered amount" });
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
        console.error("Amount Filter Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default amountFilter;
