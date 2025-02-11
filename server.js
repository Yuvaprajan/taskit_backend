const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const contactRoutes = require("./routes/contact");
const cors = require("cors");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json()); // For parsing JSON request bodies
app.use(cors());

// Routes
app.use("/api/contact", contactRoutes);

// Home route for testing
app.get("/", (req, res) => {
  res.send(contactRoutes);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
