const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "book",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to MySQL");
});

app.use(express.json());
app.use(cors());

app.get("/books", (req, res) => {
  const sql = "SELECT * FROM books";
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ message: err.message });
    } else {
      res.json(result);
    }
  });
});

app.post("/books", (req, res) => {
  const { name, img, summary } = req.body;
  const sql = "INSERT INTO books (name, img, summary) VALUES (?, ?, ?)";
  db.query(sql, [name, img, summary], (err, result) => {
    if (err) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(201).json({ id: result.insertId, name, img, summary });
    }
  });
});

app.get("/books/:id", (req, res) => {
  const sql = "SELECT * FROM books WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      res.status(500).json({ message: err.message });
    } else if (result.length === 0) {
      res.status(404).json({ message: "Cannot find book" });
    } else {
      res.json(result[0]);
    }
  });
});

app.put("/books/:id", (req, res) => {
  const { name, img, summary } = req.body;
  const sql = "UPDATE books SET name = ?, img = ?, summary = ? WHERE id = ?";
  db.query(sql, [name, img, summary, req.params.id], (err, result) => {
    if (err) {
      res.status(400).json({ message: err.message });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: "Cannot find book" });
    } else {
      res.json({ id: req.params.id, name, img, summary });
    }
  });
});

app.delete("/books/:id", (req, res) => {
  const sql = "DELETE FROM books WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      res.status(500).json({ message: err.message });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: "Cannot find book" });
    } else {
      res.json({ message: "Deleted book" });
    }
  });
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
