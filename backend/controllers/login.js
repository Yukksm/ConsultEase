import dotenv from "dotenv";
dotenv.config();

import { sheets } from "../index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const JWT_SECRET = process.env.JWT_KEY;

const login = async (req, res) => {
    try {
        const { username, password, usertype } = req.body;

        
        if (!["user", "admin"].includes(usertype.toLowerCase())) {
            return res.status(400).json({ message: "Usertype must be 'user' or 'admin' only" });
        }

       
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: "Users!A:D",  
        });

        const users = response.data.values || [];
        const user = users.find((row) => row[0] === username);

       
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const storedPassword = user[2]; 
        const storedUsertype = user[3];
         

        
        const isMatch = await bcrypt.compare(password, storedPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        
        if (storedUsertype !== usertype.toLowerCase()) {
            return res.status(400).json({ message: "Incorrect usertype" });
        }

        
        const token = jwt.sign({ username, usertype }, JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Logged in successfully!", token,  name: username, usertype});
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: error.message });
    }
};

export default login;
