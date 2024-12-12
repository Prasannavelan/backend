const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();  // Ensure environment variables are loaded

// Initialize Express app
const app = express();

// Dynamic CORS setup
const allowedOrigins = ['http://localhost:5000', 'https://cyberbind.in'];  // Add your production URL
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS error: Not allowed by CORS'));
    }
  },
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type'],
  credentials: true,  // Enable cookies if needed
}));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Use Gmail service
  auth: {
    user: process.env.GMAIL_USER,  // Your Gmail address
    pass: process.env.GMAIL_PASS,  // Your Gmail app password (not your Gmail account password)
  },
});

// Helper function to handle email sending and errors
async function sendEmail(mailOptions, res, successMessage, failureMessage) {
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    res.status(200).json({ message: successMessage });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      message: failureMessage,
      error: error.message,
      stack: error.stack,
    });
  }
}

// Route to handle contact form submission
app.post('/api/contact', (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  // Log the incoming request data
  console.log('Contact form submission received:', req.body);

  if (!firstName || !lastName || !email || !phone || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const mailOptions = {
    from: process.env.GMAIL_USER,      // Sender's email
    to: process.env.RECIPIENT_EMAIL,    // Receiver's email
    subject: 'New Contact Form Submission',  // Email subject
    text: `Name: ${firstName} ${lastName}
           Email: ${email}
           Phone: ${phone}
           Message: ${message}`,  // Body of the email
  };

  sendEmail(mailOptions, res, 'Form submitted successfully!', 'Error submitting form');
});

// Route to handle internship form submission
app.post('/api/internship', (req, res) => {
  const { name, email, phone, college, duration, interest } = req.body;

  // Log the incoming request data
  console.log('Internship form submission received:', req.body);

  if (!name || !email || !phone || !college || !interest) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const mailOptions = {
    from: process.env.GMAIL_USER,      // Sender's email
    to: process.env.RECIPIENT_EMAIL,    // Receiver's email
    subject: 'New Internship Form Submission',  // Email subject
    text: `Name: ${name}
           Email: ${email}
           Phone: ${phone}
           College: ${college}
           Duration: ${duration}
           Interest: ${interest}`,  // Body of the email
  };

  sendEmail(mailOptions, res, 'Internship application submitted successfully!', 'Error submitting internship application');
});

// Route to handle project page form submission
app.post('/api/project', (req, res) => {
  const { name, email, requirements } = req.body;

  // Log the incoming request data
  console.log('Project form submission received:', req.body);

  if (!name || !email || !requirements) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const mailOptions = {
    from: process.env.GMAIL_USER,      // Sender's email
    to: process.env.RECIPIENT_EMAIL,    // Receiver's email
    subject: 'New Project Inquiry',  // Email subject
    text: `Name: ${name}
           Email: ${email}
           Project Requirements: ${requirements}`,  // Body of the email
  };

  sendEmail(mailOptions, res, 'Project inquiry submitted successfully!', 'Error submitting project inquiry');
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
