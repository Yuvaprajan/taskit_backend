const express = require("express");
const nodemailer = require("nodemailer");
const pool = require("../db");
const Joi = require("joi");
const router = express.Router();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Validate form data
const validateContactForm = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    subject: Joi.string().allow(""),
    message: Joi.string().min(1).required(),
  });
  return schema.validate(data);
};

// POST /api/contact
router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validate form data
  const { error } = validateContactForm(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    // Insert into 'user_data' table in PostgreSQL
    await pool.query(
      "INSERT INTO user_data (name, email, subject, message) VALUES ($1, $2, $3, $4)",
      [name, email, subject, message]
    );

    // Send email using Nodemailer
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECEIVER,
      subject: `New Contact Form Submission: ${subject || "No Subject"}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Message sent successfully." });
  } catch (error) {
    console.error("❌ Error processing contact form:", error);
    res.status(500).json({ message: "An error occurred while sending the message." });
  }
});

module.exports = router;
