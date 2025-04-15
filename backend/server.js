const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
require("dotenv").config(); // Load environment variables

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

const oms_db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "oms_db",
});

const sets_db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "expense_tracker",
});

// 🔹 Login Route (Fixed bcrypt compatibility)
app.post("/login", async (req, res) => {
  const { studentId, password } = req.body;

  if (!studentId || !password) {
    return res
      .status(400)
      .json({ error: "Student ID and Password are required" });
  }

  const sql = "SELECT * FROM user_account WHERE student_id = ?";

  oms_db.query(sql, [studentId], async (err, results) => {
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

app.post("/fetch-your-payments", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "User Data are required" });
  }

  const sql =
    "SELECT p.* FROM payment p LEFT JOIN collection c ON p.id = c.payment_id WHERE c.payment_id IS NULL AND p.user_id = ?;";

  oms_db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    return res.json({ status: true, fetch: results });
  });
});

app.post("/fetch-budgets", async (req, res) => {
  const { mode } = req.body;

  let sql;

  if (mode === "Populate") {
    sql = "SELECT * FROM budget";
  }

  oms_db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    return res.json({ status: true, data: results });
  });
});

app.post("/fetch-users", async (req, res) => {
  const { mode, searchTerm, year, startDate, endDate } = req.body;

  // Base query excludes Admin accounts
  let sql = "SELECT * FROM user_account WHERE designation != 'Admin'";
  let params = [];

  if (mode === "Populate") {
    // No additional filtering needed
    // Optionally: sql += " ORDER BY created_at DESC";
  } else if (mode === "Search") {
    // Search across common fields
    sql += " AND (student_id LIKE ? OR full_name LIKE ? OR designation LIKE ?)";
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern, pattern);
  } else if (mode === "Filter") {
    // Filter by creation year and optionally by date range (requires created_at field)
    sql += " AND YEAR(created_at) = ?";
    params.push(year);
    if (startDate) {
      sql += " AND created_at >= ?";
      params.push(startDate);
    }
    if (endDate) {
      sql += " AND created_at <= ?";
      params.push(endDate);
    }
  } else if (mode === "Mixed") {
    // Both search and filter criteria
    sql += " AND (student_id LIKE ? OR full_name LIKE ? OR designation LIKE ?)";
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern, pattern);
    sql += " AND YEAR(created_at) = ?";
    params.push(year);
    if (startDate) {
      sql += " AND created_at >= ?";
      params.push(startDate);
    }
    if (endDate) {
      sql += " AND created_at <= ?";
      params.push(endDate);
    }
  }

  oms_db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Remove sensitive data from each result
    results.forEach((user) => {
      delete user.password;
    });

    return res.json({ status: true, data: results });
  });
});

// Utility function to generate a random password of given length
function generatePassword(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// /check-user-exist route: check if a user exists by student_id or email
app.post("/check-user-exist", (req, res) => {
  const { student_id, email, full_name } = req.body;
  if (!student_id || !email || !full_name) {
    return res.status(400).json({ error: "Student ID and Email are required" });
  }
  const sql =
    "SELECT id FROM user_account WHERE student_id = ? OR email = ?  or full_name = ?";
  oms_db.query(sql, [student_id, email, full_name], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    // If any record is found, return exists true
    if (results.length > 0) {
      return res.json({ exists: true });
    }
    return res.json({ exists: false });
  });
});

// /fetch-sections route: return list of sections
app.get("/fetch-sections", (req, res) => {
  const sql = "SELECT * FROM section";
  oms_db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    return res.json({ status: true, data: results });
  });
});

// /create-account route: Create a new user account and set default settings and security questions
app.post("/create-account", async (req, res) => {
  const { full_name, student_id, email, section_id } = req.body;
  if (!full_name || !student_id || !email || !section_id) {
    return res
      .status(400)
      .json({ status: false, error: "All fields are required" });
  }

  // Insert the new user first with minimal info
  const insertUserSql =
    "INSERT INTO user_account (full_name, student_id, email, section_id) VALUES (?, ?, ?, ?)";
  oms_db.query(
    insertUserSql,
    [full_name, student_id, email, section_id],
    async (err, result) => {
      if (err) {
        console.error("Error inserting user:", err);
        return res
          .status(500)
          .json({ status: false, error: "Error inserting user" });
      }
      const user_id = result.insertId;

      // Generate a random password and hash it
      const generatedPassword = generatePassword(8);
      try {
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        // Insert default settings row
        const insertSettingsSql =
          "INSERT INTO settings (user_id, theme) VALUES (?, ?)";
        oms_db.query(
          insertSettingsSql,
          [user_id, "default"],
          (err, settingsResult) => {
            if (err) {
              console.error("Error inserting settings:", err);
              return res
                .status(500)
                .json({ status: false, error: "Error inserting settings" });
            }
            const settings_id = settingsResult.insertId;

            // Insert default security question row (assume minimal insertion, adjust fields as needed)
            const insertSecuritySql =
              "INSERT INTO security_q (user_id) VALUES (?)";
            oms_db.query(
              insertSecuritySql,
              [user_id],
              (err, securityResult) => {
                if (err) {
                  console.error("Error inserting security question:", err);
                  return res.status(500).json({
                    status: false,
                    error: "Error inserting security question",
                  });
                }
                const security_q_id = securityResult.insertId;

                // Update the user_account row with the generated password and additional default values
                const updateUserSql = `
            UPDATE user_account SET 
              initial_password = ?, 
              password = ?,
              profile_pic = ?,
              security_q_id = ?,
              settings_id = ?,
              designation = ?,
              is_login_web = 0,
              is_login_mobile = 0,
              is_online = 0
            WHERE id = ?`;
                const profilePic = "src/assets/profile_default.svg";
                oms_db.query(
                  updateUserSql,
                  [
                    generatedPassword,
                    hashedPassword,
                    profilePic,
                    security_q_id,
                    settings_id,
                    "Member",
                    user_id,
                  ],
                  (err, updateResult) => {
                    if (err) {
                      console.error("Error updating user:", err);
                      return res
                        .status(500)
                        .json({ status: false, error: "Error updating user" });
                    }
                    return res.json({ status: true, user_id });
                  }
                );
              }
            );
          }
        );
      } catch (error) {
        console.error("Error generating password hash:", error);
        return res
          .status(500)
          .json({ status: false, error: "Password Hashing Error" });
      }
    }
  );
});

app.post("/fetch-user-details", (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ status: false, error: "ID is required" });
  }
  const sql = `
    SELECT 
      ua.id,
      ua.created_at,
      ua.updated_at,
      ua.full_name,
      ua.student_id,
      ua.email,
      ua.initial_password,
      ua.section_id,
      s.name AS section_name,
      ua.profile_pic,
      ua.servicing_points,
      ua.designation,
      ua.is_online,
      ua.is_login_web,
      ua.is_login_mobile,
      ua.e_signature,
      ua.qr_code
    FROM user_account ua
    LEFT JOIN section s ON ua.section_id = s.id
    WHERE ua.id = ?`;
  oms_db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    if (results.length === 0) {
      return res.json({ status: false, error: "User not found" });
    }
    return res.json({ status: true, data: results[0] });
  });
});

app.post("/update-account", async (req, res) => {
  const {
    id,
    full_name,
    student_id,
    email,
    section_id,
    designation,
    new_password,
  } = req.body;
  // Validate required fields
  if (
    !id ||
    !full_name ||
    !student_id ||
    !email ||
    !section_id ||
    !designation
  ) {
    return res
      .status(400)
      .json({ status: false, error: "All fields are required" });
  }

  // List of unique roles that must be unique
  const uniqueRoles = [
    "President",
    "Vice President",
    "Secretary",
    "Treasurer",
    "Auditor",
    "Communication Officer",
    "Procurement Officer",
    "Peace Officer",
  ];

  // Function to perform the update for current user
  async function updateCurrentUser(updateQuery, updateValues) {
    oms_db.query(updateQuery, updateValues, (err, result) => {
      if (err) {
        console.error("Error updating user:", err);
        return res
          .status(500)
          .json({ status: false, error: "Error updating user" });
      }
      return res.json({ status: true });
    });
  }

  // Prepare update query and values based on whether a new password is provided.
  let updateQuery;
  let updateValues;
  if (new_password) {
    try {
      const hashedPassword = await bcrypt.hash(new_password, 10);
      updateQuery = `
        UPDATE user_account SET 
          full_name = ?, 
          student_id = ?, 
          email = ?, 
          section_id = ?, 
          designation = ?,
          initial_password = ?, 
          password = ?
        WHERE id = ?`;
      updateValues = [
        full_name,
        student_id,
        email,
        section_id,
        designation,
        new_password,
        hashedPassword,
        id,
      ];
    } catch (error) {
      console.error("Error hashing password:", error);
      return res
        .status(500)
        .json({ status: false, error: "Password hashing error" });
    }
  } else {
    updateQuery = `
      UPDATE user_account SET 
        full_name = ?, 
        student_id = ?, 
        email = ?, 
        section_id = ?, 
        designation = ?
      WHERE id = ?`;
    updateValues = [full_name, student_id, email, section_id, designation, id];
  }

  // If the new designation is one of the unique roles, update any other user holding that role to "Member"
  if (uniqueRoles.includes(designation)) {
    const updateOldQuery =
      "UPDATE user_account SET designation = 'Member' WHERE designation = ? AND id <> ?";
    oms_db.query(updateOldQuery, [designation, id], (err, result) => {
      if (err) {
        console.error("Error updating previous user with unique role:", err);
        return res
          .status(500)
          .json({ status: false, error: "Error updating previous user role" });
      }
      // Then update the current user
      updateCurrentUser(updateQuery, updateValues);
    });
  } else {
    // Otherwise, update the current user directly
    updateCurrentUser(updateQuery, updateValues);
  }
});
app.post("/check-user-exist-updated", (req, res) => {
  const { id, full_name, student_id, email } = req.body;
  if (!id || !full_name || !student_id || !email) {
    return res
      .status(400)
      .json({ status: false, error: "All fields are required" });
  }
  const sql = `
    SELECT id FROM user_account 
    WHERE (student_id = ? OR email = ? OR full_name = ?) AND id <> ?`;
  oms_db.query(sql, [student_id, email, full_name, id], (err, results) => {
    if (err) {
      console.error("Error checking updated user exist:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    if (results.length > 0) {
      return res.json({ exists: true });
    }
    return res.json({ exists: false });
  });
});

app.post("/delete-account", (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res
      .status(400)
      .json({ status: false, error: "User ID is required" });
  }
  const sql = "DELETE FROM user_account WHERE id = ?";
  oms_db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res
        .status(500)
        .json({ status: false, error: "Error deleting user" });
    }
    if (result.affectedRows === 0) {
      return res.json({ status: false, error: "User not found" });
    }
    return res.json({ status: true });
  });
});

app.post("/fetch-deposits", async (req, res) => {
  const { mode, searchTerm, year, startDate, endDate } = req.body;

  // Base query excludes Admin accounts
  let sql = "SELECT * FROM deposit";
  let params = [];

  if (mode === "Populate") {
    // No additional filtering needed
    // Optionally: sql += " ORDER BY created_at DESC";
  } else if (mode === "Search") {
    // Search across common fields
    sql += " AND (description LIKE ? OR category LIKE ? OR amount LIKE ?)";
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern, pattern);
  } else if (mode === "Filter") {
    // Filter by creation year and optionally by date range (requires created_at field)
    sql += " AND YEAR(created_at) = ?";
    params.push(year);
    if (startDate) {
      sql += " AND created_at >= ?";
      params.push(startDate);
    }
    if (endDate) {
      sql += " AND created_at <= ?";
      params.push(endDate);
    }
  } else if (mode === "Mixed") {
    // Both search and filter criteria
    sql += " AND (student_id LIKE ? OR full_name LIKE ? OR designation LIKE ?)";
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern, pattern);
    sql += " AND YEAR(created_at) = ?";
    params.push(year);
    if (startDate) {
      sql += " AND created_at >= ?";
      params.push(startDate);
    }
    if (endDate) {
      sql += " AND created_at <= ?";
      params.push(endDate);
    }
  }

  sets_db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Remove sensitive data from each result
    results.forEach((user) => {
      delete user.password;
    });

    return res.json({ status: true, data: results });
  });
});

app.post("/fetch-deposit-details", (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res
      .status(400)
      .json({ status: false, error: "Deposit ID is required" });
  }
  const sql =
    "SELECT id, amount, date, category, description FROM deposit WHERE id = ?";
  sets_db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching deposit details:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    if (results.length === 0) {
      return res.json({ status: false, error: "Deposit not found" });
    }
    return res.json({ status: true, data: results[0] });
  });
});

app.post("/fetch-expenses", async (req, res) => {
  const { mode, searchTerm, year, startDate, endDate } = req.body;

  // Base query excludes Admin accounts
  let sql = "SELECT * FROM expense";
  let params = [];

  if (mode === "Populate") {
    // No additional filtering needed
    // Optionally: sql += " ORDER BY created_at DESC";
  } else if (mode === "Search") {
    // Search across common fields
    sql += " AND (description LIKE ? OR category LIKE ? OR amount LIKE ?)";
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern, pattern);
  } else if (mode === "Filter") {
    // Filter by creation year and optionally by date range (requires created_at field)
    sql += " AND YEAR(created_at) = ?";
    params.push(year);
    if (startDate) {
      sql += " AND created_at >= ?";
      params.push(startDate);
    }
    if (endDate) {
      sql += " AND created_at <= ?";
      params.push(endDate);
    }
  } else if (mode === "Mixed") {
    // Both search and filter criteria
    sql += " AND (student_id LIKE ? OR full_name LIKE ? OR designation LIKE ?)";
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern, pattern);
    sql += " AND YEAR(created_at) = ?";
    params.push(year);
    if (startDate) {
      sql += " AND created_at >= ?";
      params.push(startDate);
    }
    if (endDate) {
      sql += " AND created_at <= ?";
      params.push(endDate);
    }
  }

  sets_db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Remove sensitive data from each result
    results.forEach((user) => {
      delete user.password;
    });

    return res.json({ status: true, data: results });
  });
});

app.post("/fetch-expense-details", (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res
      .status(400)
      .json({ status: false, error: "Deposit ID is required" });
  }
  const sql =
    "SELECT id, amount, date, category, description, item, quantity FROM expense WHERE id = ?";
  sets_db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching deposit details:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    if (results.length === 0) {
      return res.json({ status: false, error: "Deposit not found" });
    }
    return res.json({ status: true, data: results[0] });
  });
});

// 🔹 Start Express Server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
