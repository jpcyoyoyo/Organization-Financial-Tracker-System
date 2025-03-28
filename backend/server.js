const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ofts_db",
});

// 🔹 Login Route (Fixed bcrypt compatibility)
app.post("/login", async (req, res) => {
  const { studentId, password } = req.body;

  if (!studentId || !password) {
    return res
      .status(400)
      .json({ error: "Student ID and Password are required" });
  }

  const sql = "SELECT * FROM user_accounts WHERE student_id = ?";

  db.query(sql, [studentId], async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid Student ID or Password" });
    }

    const user = results[0];

    // 🔹 Adjust bcrypt hash format from PHP ($2y$ to $2a$ for Node.js compatibility)
    const adjustedHash = user.password.replace("$2y$", "$2a$");

    // 🔹 Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, adjustedHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Wrong password. Try Again!" });
    }

    // 🔹 Generate JWT Token
    const token = jwt.sign(
      { id: user.id, studentId: user.student_id },
      process.env.JWT_SECRET || "defaultsecret", // Use .env for security
      { expiresIn: "2h" }
    );

    // 🔹 Remove password before sending user data
    delete user.password;

    return res.json({ message: "Login successful", user, token });
  });
});

app.post("/fetch-users", async (req, res) => {
  const sql = "SELECT * FROM user_accounts";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    return res.json({ status: true, users: results });
  });
});

// 🔹 Start Express Server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
