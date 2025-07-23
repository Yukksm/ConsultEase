import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { google } from "googleapis";
import fs from "fs";

import router from "./routes/authRoutes.js";


dotenv.config();

//creating express server
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connecting the google sheets with backend
const credentials = JSON.parse(fs.readFileSync("./consultease-11e236c725c7.json"));
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

app.use("/", router); // Uses authentication routes

app.listen(5000, () => console.log("Server running on port 5000"));

export {sheets};

// In your backend (index.js or app.js)


app.use(cors({
  origin: 'http://localhost:3000/login', // Your React app's origin
  credentials: true
}));