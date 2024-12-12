const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config(); // Load environment variables from .env

const app = express();

// Middleware
app.use(bodyParser.json());

// CORS Configuration
const allowedOrigins = ['https://cyberbind.in', 'http://localhost:5000']; // Include localhost for development
app.use(cors({
  origin: allowedOrigins,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow cookies if needed
}));

// POST route to handle project form submissions
app.post("/api/project", async (req, res) => {
  const { name, email, requirements } = req.body;

  // Validate input fields
  if (!name || !email || !requirements) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    // Nodemailer transporter configuration for Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use Gmail's SMTP service
      auth: {
        user: process.env.GMAIL_USER,  // Your Gmail email address
        pass: process.env.GMAIL_PASS,  // Your Gmail app password (if 2FA enabled)
      },
    });

    // Mail options
    const mailOptions = {
      from: process.env.GMAIL_USER,  // Your Gmail email address
      to: process.env.RECIPIENT_EMAIL, // Recipient's email address
      subject: "New Project Inquiry",
      text: `You have a new project inquiry:\n\nName: ${name}\nEmail: ${email}\nProject Requirements:\n${requirements}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Thank you for your inquiry! We’ll get back to you soon." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send your message. Please try again later." });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
