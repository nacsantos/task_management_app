const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to SQLite Database
const db = new sqlite3.Database("./db/database.sqlite", (err) => {
  if (err) {
    console.error("Failed to connect to database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Routes
const tasksRouter = require("./routes/tasks");
app.use("/api/tasks", tasksRouter);

// Sample route to check CORS
app.get("/test-cors", (req, res) => {
  res.json({ message: "CORS is working!" });
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
