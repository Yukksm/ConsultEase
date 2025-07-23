import dotenv from "dotenv";
dotenv.config();

import { google } from "googleapis";
import { sheets } from "../index.js";  
import multer from "multer";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"; // Import nodemailer

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const JWT_SECRET = process.env.JWT_KEY;

// Set up Google Drive authentication
const auth = new google.auth.GoogleAuth({
    keyFile: "./consultease-11e236c725c7.json",
    scopes: ["https://www.googleapis.com/auth/drive"],
});
const drive = google.drive({ version: "v3", auth });

// Multer setup for handling PDF file uploads
const upload = multer({ dest: "uploads/" });

// Function to create a Drive folder and upload files
const uploadFileToDrive = async (file, folderName) => {
    try {
        const folderResponse = await drive.files.list({
            q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
            fields: "files(id, name)",
        });

        let folderId;
        if (folderResponse.data.files.length > 0) {
            folderId = folderResponse.data.files[0].id;
        } else {
            const folderMetadata = { name: folderName, mimeType: "application/vnd.google-apps.folder" };
            const folder = await drive.files.create({ resource: folderMetadata, fields: "id" });
            folderId = folder.data.id;
        }

        const fileMetadata = { name: file.originalname, parents: [folderId] };
        const media = { mimeType: file.mimetype, body: fs.createReadStream(file.path) };

        const uploadedFile = await drive.files.create({ resource: fileMetadata, media: media, fields: "id" });

        const fileId = uploadedFile.data.id;
        await drive.permissions.create({
            fileId,
            requestBody: { role: "reader", type: "anyone" },
        });

        return `https://drive.google.com/file/d/${fileId}/view`;
    } catch (error) {
        console.error("Error uploading file to Drive:", error);
        throw new Error("Failed to upload file");
    }
};

// Function to send email after project addition
const sendConfirmationEmail = async (toEmail, projectDetails) => {
    // Create a transporter using Gmail
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
    port: 587,  // Use 465 for SSL
    secure: false, 
            auth: {
                user: 'yukksm333@gmail.com',  // Use your email here
                pass: 'nfmbbtmgojdtcdcq',  // Use your email password or app password
            },
        });

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: 'vyuktha364@gmail.com',
        subject: `Project Added: ${projectDetails.title}`,
        text: `
            

            project titled "${projectDetails.title}" has been recently added.

            Details:
            Industry: ${projectDetails.industry}
            Duration: ${projectDetails.duration}
            PI: ${projectDetails.pi}
            Co-PI: ${projectDetails.copi}
            Academic Year: ${projectDetails.academicyear}
            Sanctioned Amount: ${projectDetails.sanctionedAmt}
            Received Amount: ${projectDetails.receivedAmt}
            
            You can view the uploaded documents here:
            Bill File: ${projectDetails.billFile}
            Agreement File: ${projectDetails.agreementFile}

            Best Regards,
            The ConsultEase Team
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Confirmation email sent successfully!");
    } catch (error) {
        console.error("Error sending confirmation email:", error);
    }
};

// API to add a new faculty project
const addProject = async (req, res) => {
    try {
        // 🔹 Extract token and verify it
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        const loggedInUsername = decoded.username;

        // 🔹 Fetch faculty details from Google Sheets
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: "faculty!A:C", // A = Username, B = Email, C = Name
        });

        const users = response.data.values || [];
        const faculty = users.find(row => row[0] === loggedInUsername);

        if (!faculty) {
            return res.status(404).json({ message: "Faculty member not found" });
        }

        const facultyEmail = faculty[0]; // Email
        const facultyName = faculty[1]; // Name

        // 🔹 Extract project details from request body
        const {
            industry, duration, title, pi, piemail, copi, copiemail,
            academicyear, sanctionedAmt, receivedAmt, student1name, student1email,
            student2name, student2email, summary
        } = req.body;

        // Check for missing fields
        if (!industry || !duration || !title || !pi || !piemail) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        console.log("Received files:", req.files);

        // 🔹 Upload PDF files to Google Drive
        const billFile = req.files["bill"] ? await uploadFileToDrive(req.files["bill"][0], title) : "";
        const agreementFile = req.files["agreement"] ? await uploadFileToDrive(req.files["agreement"][0], title) : "";

        // 🔹 Save project data in Google Sheets
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: "faculty!A:S",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [[
                    facultyEmail, facultyName, industry, duration, title, pi, piemail, copi, copiemail,
                    academicyear, sanctionedAmt, receivedAmt, billFile, agreementFile,
                    student1name, student1email, student2name, student2email, summary
                ]],
            },
        });

        // Send confirmation email to PI
        const projectDetails = { 
            title, industry, duration, pi, copi, academicyear, sanctionedAmt, receivedAmt, billFile, agreementFile
        };
        await sendConfirmationEmail(piemail, projectDetails);

        res.json({ message: "Faculty project added successfully!", billFile, agreementFile });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Set up route with file upload handling
const uploadMiddlewareP = upload.fields([{ name: "bill", maxCount: 1 }, { name: "agreement", maxCount: 1 }]);

// Export the functions
export { addProject, uploadMiddlewareP }; 
