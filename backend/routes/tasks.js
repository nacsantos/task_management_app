const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const jwt = require("jsonwebtoken");

const router = express.Router();
const SECRET_KEY = "your_jwt_secret_key"; // Replace with your secure secret key

// Connect to SQLite Database
const db = new sqlite3.Database("./db/database.sqlite");

// Create tasks table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    status TEXT,
    date TEXT,
    user_id INTEGER
  )
`);

// Middleware to authenticate JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(authHeader, token);

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user; // Store the decoded user information (including user_id) in req.user
    next();
  });
}

// Get all tasks for the authenticated user (protected route)
router.get("/", authenticateToken, (req, res) => {
  const userId = req.user.userId; // Assume the token contains the user's ID as `id`
  db.all("SELECT * FROM tasks WHERE user_id = ?", [userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ tasks: rows });
  });
});

// Get task by task ID for the authenticated user (protected route)
router.get("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId; // Get the user ID from the token

  db.get("SELECT * FROM tasks WHERE id = ? AND user_id = ?", [id, userId], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      return res.status(404).json({ message: "Task not found or you don't have access to it" });
    }
    res.json({ task: row });
  });
});

// Create a new task for the authenticated user (protected route)
router.post("/", authenticateToken, (req, res) => {
  const { title, description, status, date } = req.body;
  const userId = req.user.userId; // Get the user ID from the token

  const sql = "INSERT INTO tasks (title, description, status, date, user_id) VALUES (?, ?, ?, ?, ?)";
  db.run(sql, [title, description, status, date, userId], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Update a task for the authenticated user (protected route)
router.put("/:id", authenticateToken, (req, res) => {
  const { title, description, status, date } = req.body;
  const { id } = req.params;
  const userId = req.user.userId; // Get the user ID from the token

  // TODO: Define the SQL query to update a task with new values (title, description, status, date).
  //       - The update should only occur if the task ID and user ID match.

  // TODO: Execute the SQL query using db.run() with the appropriate parameters:
  //       [title, description, status, date, id, userId].

  // TODO: If an error occurs during the query execution:
  //       - Respond with HTTP 500 and include the error message in JSON format.

  // TODO: If no rows are updated (this.changes === 0):
  //       - Respond with HTTP 404 and a message indicating that the task was not found
  //         or that the user does not have access to it.

  // TODO: If the update is successful:
  //       - Respond with HTTP 200 and include the number of changes made in JSON format.
});

// Delete task for the authenticated user (protected route)
router.delete("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId; // Get the user ID from the token

  // TODO: Execute a SQL DELETE query to remove a task matching the given ID and user ID.
  //       - Use db.run() with parameters [id, userId].

  // TODO: If an error occurs during the query execution:
  //       - Respond with HTTP 500 and include the error message in JSON format.

  // TODO: If no rows are affected (this.changes === 0):
  //       - Respond with HTTP 404 and a message indicating that the task was not found
  //         or that the user does not have permission to delete it.

  // TODO: If the deletion is successful:
  //       - Respond with a success message including the deleted task ID.
});

module.exports = router;
