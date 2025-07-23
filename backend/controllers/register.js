import dotenv from "dotenv";
dotenv.config();

import { sheets } from "../index.js";
import bcrypt from "bcryptjs";

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

const register = async (req, res) => {
    try {
        const { username, password, usertype } = req.body;

       
        if (!["user", "admin"].includes(usertype.toLowerCase())) {
            return res.status(400).json({ message: "Usertype must be 'user' or 'admin' only" });
        }

        
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: "Users!A:C",  
        });

        const users = response.data.values || [];
        if (users.some((row) => row[0] === username)) {
            return res.status(400).json({ message: "User already exists" });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

       
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: "Users!A1",
            valueInputOption: "USER_ENTERED",
            resource: { values: [[username, password, hashedPassword, usertype]] },  
        });

        res.json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: error.message });
    }
};

export default register;
