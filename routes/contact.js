const express = require("express");
const nodemailer = require("nodemailer");
const pool = require("../db");
const router = express.Router();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /api/contact
router.post("/", async (req, res) => {
  console.log("Received contact form data:", req.body);
  const { name, email, subject, message } = req.body;

  try {
    // Insert into PostgreSQL
    await pool.query(
      "INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4)",
      [name, email, subject, message]
    );

    // Send email using Nodemailer
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECEIVER,
      subject: `New Contact Form Submission: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Message sent successfully." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "An error occurred while sending the message." });
  }
});

module.exports = router;
