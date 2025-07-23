import dotenv from "dotenv";
import { google } from "googleapis";
import { sheets } from "../index.js";  // Import Sheets instance
import multer from "multer";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";  // Import nodemailer

dotenv.config();

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

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
        // Check if folder exists, else create a new one
        const folderResponse = await drive.files.list({
            q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
            fields: "files(id, name)",
        });

        let folderId;
        if (folderResponse.data.files.length > 0) {
            folderId = folderResponse.data.files[0].id;
        } else {
            const folderMetadata = {
                name: folderName,
                mimeType: "application/vnd.google-apps.folder",
            };
            const folder = await drive.files.create({
                resource: folderMetadata,
                fields: "id",
            });
            folderId = folder.data.id;
        }

        // Upload the PDF file to the folder
        const fileMetadata = {
            name: file.originalname,
            parents: [folderId],
        };
        const media = {
            mimeType: file.mimetype,
            body: fs.createReadStream(file.path),
        };
        const uploadedFile = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: "id",
        });

        // Construct the file link
        const fileId = uploadedFile.data.id;
        await drive.permissions.create({
            fileId,
            requestBody: {
                role: "reader",
                type: "anyone",
            },
        });

        return `https://drive.google.com/file/d/${fileId}/view`;
    } catch (error) {
        console.error("Error uploading file to Drive:", error);
        throw new Error("Failed to upload file");
    }
};

//  API to register a new project (With PDF upload)
const newuser = async (req, res) => {
    try {
        // Get form data (excluding PDFs)
        const {
            email, name, industry, duration, title, pi, piemail, copi, copiemail,
            academicyear, sanctionedAmt, receivedAmt, student1name, student1email,
            student2name, student2email, summary
        } = req.body;

        // Ensure required fields are provided
        if (!name || !industry || !duration || !title || !pi || !piemail) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        console.log("Received files:", req.files);

        //  Upload PDF files to Google Drive and get links
        const billFile = req.files["bill"] ? await uploadFileToDrive(req.files["bill"][0], title) : "";
        const agreementFile = req.files["agreement"] ? await uploadFileToDrive(req.files["agreement"][0], title) : "";

        //  Save data in Google Sheets
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: "faculty!A:S",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [[
                    email, name, industry, duration, title, pi, piemail, copi, copiemail,
                    academicyear, sanctionedAmt, receivedAmt, billFile, agreementFile,
                    student1name, student1email, student2name, student2email, summary
                ]],
            },
        });

        // Send email notification
        await sendEmailNotification(title);

        res.json({ message: "Faculty project entered successfully!", billFile, agreementFile });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Function to send email notification
const sendEmailNotification = async (title) => {
    try {
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
            from: process.env.EMAIL_USER,
            to: "vyuktha364@gmail.com",  // The recipient email address
            subject: `New Project Added: ${title}`,
            text: `   project titled "${title}" has been recently added.

            Details:
            Industry: ${industry}
            Duration: ${duration}
            PI: ${pi}
            Co-PI: ${copi}
            Academic Year: ${academicyear}
            Sanctioned Amount: ${sanctionedAmt}
            Received Amount: ${receivedAmt}
            
            You can view the uploaded documents here:
            Bill File: ${billFile}
            Agreement File: ${agreementFile}

            Best Regards,
            The ConsultEase Team`,
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

//  Set up route with file upload handling
const uploadMiddleware = upload.fields([{ name: "bill", maxCount: 1 }, { name: "agreement", maxCount: 1 }]);

export { newuser, uploadMiddleware };
