const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: process.env.DB_HOST || "mysql",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "yesno"
});

// Create question
app.post("/questions", (req, res) => {
const { question, optionA, optionB } = req.body;
db.query(
"INSERT INTO questions (question, optionA, optionB, votesA, votesB) VALUES (?, ?, ?, 0, 0)",
[question, optionA, optionB],
() => res.send("Created")
);
});

// Get questions
app.get("/questions", (req, res) => {
db.query("SELECT * FROM questions", (err, results) => {
res.json(results);
});
});

// Vote (FIXED)
app.post("/vote/:id", (req, res) => {
const { option } = req.body;
const id = req.params.id;

const column = option === "A" ? "votesA" : "votesB";

db.query(
`UPDATE questions SET ${column} = ${column} + 1 WHERE id = ?`,
[id],
() => res.send("Voted")
);
});

app.listen(3000, () => console.log("Server running on 3000"));

