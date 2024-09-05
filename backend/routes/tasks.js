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
    status TEXT
  )
`);

// Get all tasks
router.get("/", (req, res) => {
  console.log("Entered in get all tasks");
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

// Create new task
router.post("/", (req, res) => {
  console.log("Entered in new task");
  const { title, description, status } = req.body;
  console.log(req.body);
  db.run(
    "INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)",
    [title, description, status],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ task: { id: this.lastID, title, description, status } });
    }
  );
});

// Update a task by ID
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  const sql = `UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?`;
  const params = [title, description, status, id];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: "Task updated", changes: this.changes });
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
