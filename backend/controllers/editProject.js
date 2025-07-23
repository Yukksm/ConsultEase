import dotenv from "dotenv";
dotenv.config();

import { sheets } from "../index.js";
import jwt from "jsonwebtoken";

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const JWT_SECRET = process.env.JWT_KEY;

const editProject = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized: No token" });

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const loggedInEmail = decoded.username;
        const { id, updatedData } = req.body;

        if (!id || !updatedData) {
            return res.status(400).json({ message: "Missing originalTitle or updatedData" });
        }

        // Fetch all projects
        const sheetData = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: "faculty!A:S",
        });

        const rows = sheetData.data.values || [];

        // Find index of project row by email + title
        const rowIndex = rows.findIndex(
            row => row[0] === loggedInEmail && row[4] === id
        );

        if (rowIndex === -1) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Update the row at index
        const newRow = [
            loggedInEmail,
            updatedData.name || "",
            updatedData.industry || "",
            updatedData.duration || "",
            updatedData.title || "",
            updatedData.pi || "",
            updatedData.piemail || "",
            updatedData.copi || "",
            updatedData.copiemail || "",
            updatedData.academicyear || "",
            updatedData.sanctionedAmt || "",
            updatedData.receivedAmt || "",
            updatedData.bill || "",
            updatedData.agreement || "",
            updatedData.student1name || "",
            updatedData.student1email || "",
            updatedData.student2name || "",
            updatedData.student2email || "",
            updatedData.summary || "",
        ];

        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `faculty!A${rowIndex + 1}:S${rowIndex + 1}`,
            valueInputOption: "USER_ENTERED",
            resource: { values: [newRow] },
        });

        res.json({ message: "Project updated successfully!" });
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default editProject;
