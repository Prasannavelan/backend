// Required packages
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Dynamic CORS setup
const allowedOrigins = ["http://localhost:5000", "https://cyberbind.in"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,POST,OPTIONS",
    credentials: true, // If cookies are used
  })
);

// POST /internship route
app.post("/api/internship", async (req, res) => {
  const { name, email, phone, college, duration, interest } = req.body;

  // Validation
  if (!name || !email || !phone || !college || !duration || !interest) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Nodemailer configuration for Gmail
  const transporter = nodemailer.createTransport({
    service: "gmail",  // Use Gmail's SMTP service
    auth: {
      user: process.env.GMAIL_USER,  // Your Gmail email address
      pass: process.env.GMAIL_PASS,  // Your Gmail app password (if 2FA enabled)
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,  // Your Gmail email address
    to: process.env.RECIPIENT_EMAIL,  // Recipient email address
    subject: "New Internship Application",
    text: `You have received a new internship application:

Name: ${name}
Email: ${email}
Phone: ${phone}
College: ${college}
Duration: ${duration}
Interest: ${interest}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Application submitted successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Unable to submit your application. Please try again later.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
