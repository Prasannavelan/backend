const express = require('express');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const router = express.Router();

// Rate limiter for API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// CORS configuration to allow requests from specific origins
const corsOptions = {
  origin: ['http://localhost:5000', 'https://cyberbind.in'], // Frontend domains
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
router.use(cors(corsOptions));

// Validation middleware
const validateContactForm = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('phone').optional().isLength({ min: 10, max: 10 }).withMessage('Invalid phone number'),
  body('message').notEmpty().withMessage('Message is required'),
];

// Route to handle contact form submission
router.post('/', limiter, validateContactForm, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, phone, message } = req.body;

  try {
    // Create a transporter to send email via Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use Gmail service
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_PASS, // App Password for Gmail (make sure to create an app password if using 2FA)
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.GMAIL_USER,  // Sender's email address
      to: process.env.RECIPIENT_EMAIL,  // Recipient's email address
      subject: 'New Contact Form Submission',
      text: `Name: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send response back to client
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error during email sending:', error);
    res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
});

module.exports = router;
