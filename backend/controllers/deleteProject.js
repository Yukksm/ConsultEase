import dotenv from "dotenv";
dotenv.config();

import { sheets } from "../index.js";
import jwt from "jsonwebtoken";

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const JWT_SECRET = process.env.JWT_KEY;

const deleteProject = async (req, res) => {
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
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Project title is required" });
        }

        const sheetData = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: "faculty!A:S",
        });

        const rows = sheetData.data.values || [];
        const rowIndex = rows.findIndex(
            row => row[0] === loggedInEmail && row[4] === id
        );

        if (rowIndex === -1) {
            return res.status(404).json({ message: "Project not found" });
        }

        await sheets.spreadsheets.values.clear({
            spreadsheetId: SPREADSHEET_ID,
            range: `faculty!A${rowIndex + 1}:S${rowIndex + 1}`,
        });

        res.json({ message: "Project deleted successfully!" });
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default deleteProject;
