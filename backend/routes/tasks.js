const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();

// Connect to SQLite Database
const db = new sqlite3.Database("./db/database.sqlite");

// Create tasks table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    status TEXT,
    date TEXT
  )
`);

// Get all tasks
router.get("/", (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ tasks: rows });
  });
});

// Get task by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM tasks WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ task: row });
  });
});

// Create a new task
router.post("/", (req, res) => {
  const { title, description, status, date } = req.body;
  const sql = "INSERT INTO tasks (title, description, status, date) VALUES (?, ?, ?, ?)";
  db.run(sql, [title, description, status, date], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Update a task
router.put("/:id", (req, res) => {
  const { title, description, status, date } = req.body;
  console.log(req.params.id, title, description, status, date);
  const sql = "UPDATE tasks SET title = ?, description = ?, status = ?, date = ? WHERE id = ?";
  db.run(sql, [title, description, status, date, req.params.id], function (err) {
    if (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(200).json({ changes: this.changes });
  });
});

// Delete task
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM tasks WHERE id = ?", [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: `Task with ID ${id} deleted successfully.` });
  });
});

module.exports = router;
