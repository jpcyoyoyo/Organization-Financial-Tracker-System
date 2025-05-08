const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const fs = require("fs");
const multer = require("multer");
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

// ---- Functions ---- //

function formatDate(isoDate) {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  const options = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

function formatDateTable(input) {
  const date = new Date(input);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // convert 0 to 12
  const formattedHours = String(hours).padStart(2, "0");

  return `${day}-${month}-${year} - ${formattedHours}:${minutes}:${seconds} ${ampm}`;
}

function formatDateTableNoTime(input) {
  const date = new Date(input);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

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

function logActivity({
  user_id = null,
  tab,
  activity,
  relating_id = null,
  status = 0,
  summary = "",
  details = "",
}) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO log (user_id, created_at, tab, activity, relating_id, status, summary, details)
      VALUES (?, NOW(), ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      user_id,
      tab,
      activity,
      relating_id,
      status,
      summary,
      details,
    ];

    oms_db.query(sql, params, (err, result) => {
      if (err) {
        console.error("Error logging activity:", err);
        reject(err);
      } else {
        console.log("Activity logged successfully:", result.insertId);
        resolve(result.insertId);
      }
    });
  });
}

// 🔹 Login Route (Fixed bcrypt compatibility)
app.post("/login", async (req, res) => {
  const { studentId, password, platform } = req.body;

  if (!studentId || !password || !platform) {
    logActivity({
      tab: "Login",
      activity: "Login Attempt",
      status: 1, // Failed
      summary: "Missing credentials or platform",
      details: String(
        `\nUser trying logging in. Student ID or Password missing.\n\nEntered credentials:\n\t- Student ID: ${
          studentId ? studentId : "Missing"
        }\n\t- Password:  ${
          password ? "Password inputed" : "Missing"
        }\n\t- Platform: ${platform || "Missing"}`
      ),
    }).catch((err) => {
      console.error("Failed to log activity:", err);
    });

    return res
      .status(400)
      .json({ error: "Student ID and Password are required" });
  } else {
    logActivity({
      tab: "Login",
      activity: "Login Attempt",
      status: 2, // Process
      summary: "Processing Login...",
      details: String(
        `Credentials recieved. Processing Login...\n\nEntered credentials: \n\t- Student ID: ${
          studentId ? studentId : "Missing"
        }\n\t- Password:  ${password ? "Password inputed" : "Missing"}`
      ),
    }).catch((err) => {
      console.error("Failed to log activity:", err);
    });
  }

  const sql = "SELECT * FROM user_account WHERE student_id = ?";

  oms_db.query(sql, [studentId], async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      logActivity({
        tab: "Login",
        activity: "Login Attempt",
        status: 1, // Failed
        summary: "Database error:",
        details: String(
          `An error occur retriving the user account in the database.\n\nDetails: ${err}`
        ),
      });
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      logActivity({
        tab: "Login",
        activity: "Login Attempt",
        status: 1, // Failed
        summary: "Invalid Student ID",
        details: String(
          `User trying logging in. Account does not exist.\n\nEntered credentials: \n\t- Student ID: ${
            studentId ? studentId : "Missing"
          }\n\t- Password:  ${password ? "Password inputed" : "Missing"}`
        ),
      });

      return res.status(401).json({ error: "Account does not exist" });
    }

    const user = results[0];

    if (user) {
      logActivity({
        tab: "Login",
        activity: "Login Attempt",
        status: 2, // Success
        summary: "User account detail retrive succussfully",
        details: String(
          `User account retrive succussfully. Ready for password comparison.\n\n\t- User ID: ${user.id}`
        ),
      });
    }

    // 🔹 Adjust bcrypt hash format from PHP ($2y$ to $2a$ for Node.js compatibility)
    const adjustedHash = user.password.replace("$2y$", "$2a$");

    // 🔹 Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, adjustedHash);
    if (!isPasswordValid) {
      logActivity({
        tab: "Login",
        activity: "Login Attempt",
        status: 1,
        summary: "Wrong password.",
        details: String(
          `User account inputed a wrong password.\n\n\t- User ID: ${user.id}`
        ),
      });

      return res.status(401).json({ error: "Wrong password. Try Again!" });
    }

    // 🔹 Update is_online and platform-specific login status
    let updateSql = "UPDATE user_account SET is_online = 1";
    if (platform === "web") {
      updateSql += ", is_login_web = 1";
    } else if (platform === "mobile") {
      updateSql += ", is_login_mobile = 1";
    }
    updateSql += " WHERE id = ?";

    oms_db.query(updateSql, [user.id], (updateErr) => {
      if (updateErr) {
        console.error("Error updating login status:", updateErr);
        logActivity({
          user_id: user.id,
          tab: "Login",
          activity: "Login Status Update",
          status: 1, // Failed
          summary: "Failed to update login status",
          details: String(
            `An error occurred while updating the login status for the user.\n\n\t- User ID: ${user.id}\n\t- Platform: ${platform}\n\t- Error: ${updateErr}`
          ),
        });
        return res.status(500).json({ error: "Failed to update login status" });
      }

      logActivity({
        user_id: user.id,
        tab: "Login",
        activity: "Login Status Update",
        status: 2, // Success
        summary: "Login status updated successfully",
        details: String(
          `User login status updated successfully.\n\n\t- User ID: ${user.id}\n\t- Platform: ${platform}`
        ),
      });
    });

    // 🔹 Generate JWT Token
    const token = jwt.sign(
      { id: user.id, studentId: user.student_id },
      process.env.JWT_SECRET || "defaultsecret", // Use .env for security
      { expiresIn: "2h" }
    );

    // 🔹 Remove password before sending user data
    delete user.password;

    logActivity({
      user_id: `${user.id}`,
      tab: "Login",
      activity: "Login Attempt",
      status: 0, // Success
      summary: "Successful Log In.",
      details: String(
        `Log in successful. Redirecting to dashboard.\n\n\t- User ID: ${user.id} \n\t- Full Name: ${user.full_name}\n\t- Student ID: ${user.student_id}\n\t- Designation: ${user.designation}\n\t- Platform: ${platform}`
      ),
    });

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
  let sql = `
  SELECT 
    ua.id,
    ua.student_id,
    ua.full_name,
    ua.is_online,
    s.name AS section_name
  FROM user_account ua 
  LEFT JOIN section s ON ua.section_id = s.id
  WHERE ua.designation != 'Admin'
  `;
  let params = [];

  if (mode === "Populate") {
    // No additional filtering needed
    // Optionally: sql += " ORDER BY created_at DESC";
  } else if (mode === "Search") {
    // Search across common fields
    sql +=
      " AND (ua.student_id LIKE ? OR ua.full_name LIKE ? OR ua.designation LIKE ?)";
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern, pattern);
  } else if (mode === "Filter") {
    // Filter by creation year and optionally by date range (requires created_at field)
    sql += " AND YEAR(ua.created_at) = ?";
    params.push(year);
    if (startDate) {
      sql += " AND ua.created_at >= ?";
      params.push(startDate);
    }
    if (endDate) {
      sql += " AND ua.created_at <= ?";
      params.push(endDate);
    }
  } else if (mode === "Mixed") {
    // Both search and filter criteria
    sql +=
      " AND (ua.student_id LIKE ? OR ua.full_name LIKE ? OR ua.designation LIKE ?)";
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern, pattern);
    sql += " AND YEAR(ua.created_at) = ?";
    params.push(year);
    if (startDate) {
      sql += " AND ua.created_at >= ?";
      params.push(startDate);
    }
    if (endDate) {
      sql += " AND ua.created_at <= ?";
      params.push(endDate);
    }
  }

  oms_db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    return res.json({ status: true, data: results });
  });
});

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
app.post("/fetch-section-options", (req, res) => {
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

      const incrementStudentNoSql =
        "UPDATE section SET student_no = student_no + 1 WHERE id = ?";
      oms_db.query(incrementStudentNoSql, [section_id], (err) => {
        if (err) {
          console.error("Error incrementing student_no in section:", err);
          return res.status(500).json({
            status: false,
            error: "Error updating section student_no",
          });
        }
      });

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

    const data = results[0];
    data.created_at = formatDate(data.created_at);
    data.updated_at = formatDate(data.updated_at);
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

  try {
    let updateQuery;
    let updateValues;

    if (new_password) {
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
    } else {
      updateQuery = `
        UPDATE user_account SET 
          full_name = ?, 
          student_id = ?, 
          email = ?, 
          section_id = ?, 
          designation = ?
        WHERE id = ?`;
      updateValues = [
        full_name,
        student_id,
        email,
        section_id,
        designation,
        id,
      ];
    }

    // Handle unique roles first
    if (uniqueRoles.includes(designation)) {
      await new Promise((resolve, reject) => {
        oms_db.query(
          "UPDATE user_account SET designation = 'Member' WHERE designation = ? AND id <> ?",
          [designation, id],
          (err) => (err ? reject(err) : resolve())
        );
      });
    }

    // Handle Representative role reassignment
    if (designation === "Representative") {
      await new Promise((resolve, reject) => {
        oms_db.query(
          "UPDATE user_account SET designation = 'Member' WHERE designation = ? AND id <> ? AND section_id = ?",
          [designation, id, section_id],
          (err) => (err ? reject(err) : resolve())
        );
      });

      await new Promise((resolve, reject) => {
        oms_db.query(
          "UPDATE section SET representative = ? WHERE id = ?",
          [id, section_id],
          (err) => (err ? reject(err) : resolve())
        );
      });
    }

    // Finally update the user
    await new Promise((resolve, reject) => {
      oms_db.query(updateQuery, updateValues, (err) =>
        err ? reject(err) : resolve()
      );
    });

    return res.json({ status: true });
  } catch (error) {
    console.error("Error updating account:", error);
    return res
      .status(500)
      .json({ status: false, error: "Internal server error" });
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

/*
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
*/

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

app.post("/fetch-sections", (req, res) => {
  const { mode, searchTerm, year, startDate, endDate } = req.body;

  let sql = `
  SELECT 
    s.id, 
    s.name, 
    s.section_no, 
    s.year, 
    s.representative,
    ua.full_name AS representative_full_name
  FROM section s
  LEFT JOIN user_account ua ON s.representative = ua.id`;

  let params = [];

  if (mode === "Populate") {
    // No additional filtering needed.
  } else if (mode === "Search") {
    sql +=
      " WHERE (s.name LIKE ? OR ua.full_name LIKE ? OR s.year LIKE ? OR s.section_no LIKE ?)";
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern, pattern, pattern);
  } else if (mode === "Filter") {
    sql += " WHERE YEAR(s.created_at) = ?";
    params.push(year);
    if (startDate) {
      sql += " AND s.created_at >= ?";
      params.push(startDate);
    }
    if (endDate) {
      sql += " AND s.created_at <= ?";
      params.push(endDate);
    }
  } else if (mode === "Mixed") {
    sql +=
      " WHERE (s.name LIKE ? OR ua.full_name LIKE ? OR s.year LIKE ? OR s.section_no LIKE ?)";
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern, pattern, pattern);
    sql += " AND YEAR(s.created_at) = ?";
    params.push(year);
    if (startDate) {
      sql += " AND s.created_at >= ?";
      params.push(startDate);
    }
    if (endDate) {
      sql += " AND s.created_at <= ?";
      params.push(endDate);
    }
  }

  oms_db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    return res.json({ status: true, data: results });
  });
});

app.post("/check-section-exist", (req, res) => {
  const { section_no, year } = req.body;
  if (!section_no || !year) {
    return res
      .status(400)
      .json({ status: false, error: "Section number and year are required" });
  }
  const sql = "SELECT id FROM section WHERE section_no = ? AND year = ?";
  oms_db.query(sql, [section_no, year], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (results.length > 0) {
      return res.json({ exists: true });
    }
    return res.json({ exists: false });
  });
});

app.post("/create-section", (req, res) => {
  const { section_no, year, user_data } = req.body;
  if (!section_no || !year || !user_data) {
    return res
      .status(400)
      .json({ status: false, error: "Section number and year are required" });
  }

  const user_data_parse = JSON.parse(user_data);
  const user_id = user_data_parse.id; // Extract user_id from parsed data

  const name = `${year}0${section_no}`;
  const sql =
    "INSERT INTO section (section_no, year, name, user_id) VALUES (?, ?, ?, ?)";
  oms_db.query(sql, [section_no, year, name, user_id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json({ status: true, id: result.insertId });
  });
});

app.post("/fetch-section-details", (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ status: false, error: "ID is required" });
  }
  const sql = `
    SELECT 
      s.id,
      s.created_at,
      s.updated_at,
      s.section_no,
      s.year,
      s.name,
      s.student_no,
      ua.full_name AS representative_full_name
    FROM section s
    LEFT JOIN user_account ua ON s.representative = ua.id
    WHERE s.id = ?`;
  oms_db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    if (results.length === 0) {
      return res.json({ status: false, error: "Section not found" });
    }

    const data = results[0];
    data.created_at = formatDate(data.created_at);
    data.updated_at = formatDate(data.updated_at);
    return res.json({ status: true, data: results[0] });
  });
});

app.post("/fetch-online-accounts", (req, res) => {
  const { id } = req.body;

  // Log the process of fetching online accounts
  logActivity({
    user_id: id || null,
    tab: "Admin Dashboard",
    activity: "Fetch Dashboard Data Attempt",
    status: 2, // Process
    summary: "Fetching online accounts...",
    details:
      "The system is attempting to fetch the count of online accounts for Admin Dashboard.",
  }).catch((err) => {
    console.error("Failed to log process activity:", err);
  });

  const sql =
    "SELECT COUNT(is_online) AS online_accounts FROM user_account WHERE is_online = 1 AND designation <> 'Admin'";

  oms_db.query(sql, [], (err, result) => {
    if (err) {
      console.error("Database error:", err);

      // Log the failure of fetching online accounts
      logActivity({
        user_id: id || null,
        tab: "Admin Dashboard",
        activity: "Fetch Dashboard Data Attempt",
        status: 1, // Failed
        summary: "Failed to fetch online accounts",
        details: `An error occurred while fetching online accounts for Admin Dashboard.\n\nError: ${err}`,
      }).catch((logErr) => {
        console.error("Failed to log failed activity:", logErr);
      });

      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    // Log the success of fetching online accounts
    logActivity({
      user_id: id || null,
      tab: "Admin Dashboard",
      activity: "Fetch Dashboard Data Attempt",
      status: 0, // Success
      summary: "Successfully fetched online accounts",
      details: `The system successfully fetched the count of online accounts for Admin Dashboard.\n\nCount: ${result[0].online_accounts}`,
    }).catch((logErr) => {
      console.error("Failed to log success activity:", logErr);
    });

    return res.json({ status: true, data: result[0] });
  });
});

app.post("/fetch-online-web", (req, res) => {
  const { id } = req.body;

  // Log the process of fetching online web accounts
  logActivity({
    user_id: id || null,
    tab: "Admin Dashboard",
    activity: "Fetch Dashboard Data Attempt",
    status: 2, // Process
    summary: "Fetching online web accounts...",
    details:
      "The system is attempting to fetch the count of online web accounts for Admin Dashboard.",
  }).catch((err) => {
    console.error("Failed to log process activity:", err);
  });

  const sql =
    "SELECT COUNT(is_login_web) AS online_web FROM user_account WHERE is_login_web = 1 AND designation <> 'Admin'";

  oms_db.query(sql, [], (err, result) => {
    if (err) {
      console.error("Database error:", err);

      // Log the failure of fetching online web accounts
      logActivity({
        user_id: id || null,
        tab: "Admin Dashboard",
        activity: "Fetch Dashboard Data Attempt",
        status: 1, // Failed
        summary: "Failed to fetch online web accounts",
        details: `An error occurred while fetching online web accounts for Admin Dashboard.\n\nError: ${err}`,
      }).catch((logErr) => {
        console.error("Failed to log failed activity:", logErr);
      });

      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    // Log the success of fetching online web accounts
    logActivity({
      user_id: id || null,
      tab: "Admin Dashboard",
      activity: "Fetch Dashboard Data Attempt",
      status: 0, // Success
      summary: "Successfully fetched online web accounts",
      details: `The system successfully fetched the count of online web accounts for Admin Dashboard.\n\nCount: ${result[0].online_web}`,
    }).catch((logErr) => {
      console.error("Failed to log success activity:", logErr);
    });

    return res.json({ status: true, data: result[0] });
  });
});

app.post("/fetch-online-mobile", (req, res) => {
  const { id } = req.body;

  // Log the process of fetching online mobile accounts
  logActivity({
    user_id: id || null,
    tab: "Admin Dashboard",
    activity: "Fetch Dashboard Data Attempt",
    status: 2, // Process
    summary: "Fetching online mobile accounts...",
    details:
      "The system is attempting to fetch the count of online mobile accounts for Admin Dashboard.",
  }).catch((err) => {
    console.error("Failed to log process activity:", err);
  });

  const sql =
    "SELECT COUNT(is_login_mobile) AS online_mobile FROM user_account WHERE is_login_mobile = 1 AND designation <> 'Admin'";

  oms_db.query(sql, [], (err, result) => {
    if (err) {
      console.error("Database error:", err);

      // Log the failure of fetching online mobile accounts
      logActivity({
        user_id: id || null,
        tab: "Admin Dashboard",
        activity: "Fetch Dashboard Data Attempt",
        status: 1, // Failed
        summary: "Failed to fetch online mobile accounts",
        details: `An error occurred while fetching online mobile accounts for Admin Dashboard.\n\nError: ${err}`,
      }).catch((logErr) => {
        console.error("Failed to log failed activity:", logErr);
      });

      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    // Log the success of fetching online mobile accounts
    logActivity({
      user_id: id || null,
      tab: "Admin Dashboard",
      activity: "Fetch Dashboard Data Attempt",
      status: 0, // Success
      summary: "Successfully fetched online mobile accounts",
      details: `The system successfully fetched the count of online mobile accounts for Admin Dashboard.\n\nCount: ${result[0].online_mobile}`,
    }).catch((logErr) => {
      console.error("Failed to log success activity:", logErr);
    });

    return res.json({ status: true, data: result[0] });
  });
});

app.post("/fetch-total-accounts", (req, res) => {
  const { id } = req.body;

  // Log the process of fetching total accounts
  logActivity({
    user_id: id || null,
    tab: "Admin Dashboard",
    activity: "Fetch Dashboard Data Attempt",
    status: 2, // Process
    summary: "Fetching total accounts...",
    details:
      "The system is attempting to fetch the total count of accounts for Admin Dashboard.",
  }).catch((err) => {
    console.error("Failed to log process activity:", err);
  });

  const sql =
    "SELECT COUNT(*) AS total_accounts FROM user_account WHERE designation <> 'Admin'";

  oms_db.query(sql, [], (err, result) => {
    if (err) {
      console.error("Database error:", err);

      // Log the failure of fetching total accounts
      logActivity({
        user_id: id || null,
        tab: "Admin Dashboard",
        activity: "Fetch Dashboard Data Attempt",
        status: 1, // Failed
        summary: "Failed to fetch total accounts",
        details: `An error occurred while fetching total accounts for Admin Dashboard.\n\nError: ${err}`,
      }).catch((logErr) => {
        console.error("Failed to log failed activity:", logErr);
      });

      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    // Log the success of fetching total accounts
    logActivity({
      user_id: id || null,
      tab: "Admin Dashboard",
      activity: "Fetch Dashboard Data Attempt",
      status: 0, // Success
      summary: "Successfully fetched total accounts",
      details: `The system successfully fetched the total count of accounts for Admin Dashboard.\n\nCount: ${result[0].total_accounts}`,
    }).catch((logErr) => {
      console.error("Failed to log success activity:", logErr);
    });

    return res.json({ status: true, data: result[0] });
  });
});

app.post("/fetch-total-logs", (req, res) => {
  const { id } = req.body;

  // Log the process of fetching total logs
  logActivity({
    user_id: id || null,
    tab: "Admin Dashboard",
    activity: "Fetch Dashboard Data Attempt",
    status: 2, // Process
    summary: "Fetching total logs...",
    details:
      "The system is attempting to fetch the total count of logs for Admin Dashboard.",
  }).catch((err) => {
    console.error("Failed to log process activity:", err);
  });

  const sql = "SELECT COUNT(*) AS total_logs FROM log";

  oms_db.query(sql, [], (err, result) => {
    if (err) {
      console.error("Database error:", err);

      // Log the failure of fetching total logs
      logActivity({
        user_id: id || null,
        tab: "Admin Dashboard",
        activity: "Fetch Dashboard Data Attempt",
        status: 1, // Failed
        summary: "Failed to fetch total logs",
        details: `An error occurred while fetching total logs for Admin Dashboard.\n\nError: ${err}`,
      }).catch((logErr) => {
        console.error("Failed to log failed activity:", logErr);
      });

      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    // Log the success of fetching total logs
    logActivity({
      user_id: id || null,
      tab: "Admin Dashboard",
      activity: "Fetch Dashboard Data Attempt",
      status: 0, // Success
      summary: "Successfully fetched total logs",
      details: `The system successfully fetched the total count of logs for Admin Dashboard.\n\nCount: ${result[0].total_logs}`,
    }).catch((logErr) => {
      console.error("Failed to log success activity:", logErr);
    });

    return res.json({ status: true, data: result[0] });
  });
});

app.post("/fetch-logs-today", (req, res) => {
  const { id } = req.body;

  // Log the process of fetching today's logs
  logActivity({
    user_id: id || null,
    tab: "Admin Dashboard",
    activity: "Fetch Dashboard Data Attempt",
    status: 2, // Process
    summary: "Fetching today's logs...",
    details:
      "The system is attempting to fetch the count of logs created today for Admin Dashboard.",
  }).catch((err) => {
    console.error("Failed to log process activity:", err);
  });

  const sql =
    "SELECT COUNT(*) AS logs_today FROM log WHERE DATE(created_at) = CURDATE()";

  oms_db.query(sql, [], (err, result) => {
    if (err) {
      console.error("Database error:", err);

      // Log the failure of fetching today's logs
      logActivity({
        user_id: id || null,
        tab: "Admin Dashboard",
        activity: "Fetch Dashboard Data Attempt",
        status: 1, // Failed
        summary: "Failed to fetch today's logs",
        details: `An error occurred while fetching today's logs for Admin Dashboard.\n\nError: ${err}`,
      }).catch((logErr) => {
        console.error("Failed to log failed activity:", logErr);
      });

      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    // Log the success of fetching today's logs
    logActivity({
      user_id: id || null,
      tab: "Admin Dashboard",
      activity: "Fetch Dashboard Data Attempt",
      status: 0, // Success
      summary: "Successfully fetched today's logs",
      details: `The system successfully fetched the count of logs created today for Admin Dashboard.\n\nCount: ${result[0].logs_today}`,
    }).catch((logErr) => {
      console.error("Failed to log success activity:", logErr);
    });

    return res.json({ status: true, data: result[0] });
  });
});

app.post("/fetch-logs", (req, res) => {
  const { mode, searchTerm, year, startDate, endDate } = req.body;

  // Base SELECT without ORDER BY
  let sql = `
    SELECT 
      l.id, 
      l.user_id, 
      l.created_at,
      l.summary,
      l.status,
      ua.student_id AS student_id
    FROM log l
    LEFT JOIN user_account ua ON l.user_id = ua.id
  `;
  const conditions = [];
  const params = [];

  if (mode === "Search") {
    const pattern = `%${searchTerm}%`;
    // change to summary if you don't have an activity column:
    conditions.push(`(ua.student_id LIKE ? OR l.summary LIKE ?)`);
    params.push(pattern, pattern);
  } else if (mode === "Filter") {
    conditions.push(`YEAR(l.created_at) = ?`);
    params.push(year);
    if (startDate) {
      conditions.push(`DATE(l.created_at) >= ?`);
      params.push(startDate);
    }
    if (endDate) {
      conditions.push(`DATE(l.created_at) <= ?`);
      params.push(endDate);
    }
  } else if (mode === "Mixed") {
    const pattern = `%${searchTerm}%`;
    conditions.push(`(ua.student_id LIKE ? OR l.summary LIKE ?)`);
    params.push(pattern, pattern);

    conditions.push(`YEAR(l.created_at) = ?`);
    params.push(year);

    if (startDate) {
      conditions.push(`DATE(l.created_at) >= ?`);
      params.push(startDate);
    }
    if (endDate) {
      conditions.push(`DATE(l.created_at) <= ?`);
      params.push(endDate);
    }
  }
  // mode === "Populate" ⇒ no filters

  // Only append WHERE if we have at least one condition
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  // Now append ORDER BY at the very end
  sql += " ORDER BY l.id DESC";

  oms_db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    const formattedResults = results.map((log) => ({
      ...log,
      created_at: formatDateTable(log.created_at),
    }));

    // Now, fetch unique years for filter
    const yearsQuery =
      "SELECT DISTINCT YEAR(created_at) AS year FROM log ORDER BY year DESC";
    oms_db.query(yearsQuery, (yearErr, yearResults) => {
      if (yearErr) {
        console.error("Database error (years):", yearErr);
        // Even if years fetching fails, send back logs data
        return res.json({ status: true, data: formattedResults, years: [] });
      }
      const years = yearResults.map((row) => row.year);
      return res.json({ status: true, data: formattedResults, years });
    });
  });
});

app.post("/fetch-log-details", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ status: false, error: "ID is required" });
  }

  const sql = `
    SELECT 
      l.id,
      l.user_id,
      l.created_at,
      l.tab,
      l.activity,
      l.relating_id,
      l.status,
      l.summary,
      l.details,
      ua.full_name AS full_name,
      ua.student_id AS student_id,
      ua.profile_pic AS profile_pic,
      ua.designation AS designation
    FROM log l
    LEFT JOIN user_account ua ON l.user_id = ua.id 
    WHERE l.id = ?
  `;

  oms_db.query(sql, id, (err, results) => {
    if (err) {
      console.error("Database error: ", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.json({ status: false, error: "Log not found" });
    }

    const data = results[0];
    data.created_at = formatDate(data.created_at);

    return res.json({ status: true, data: results[0] });
  });
});

app.post("/logout", async (req, res) => {
  const { id, platform } = req.body;

  if (!id || !platform) {
    return res
      .status(400)
      .json({ status: false, error: "User ID and platform are required" });
  }

  // Update the user's online status and platform-specific login status
  let updateSql = "UPDATE user_account SET is_online = 0";
  if (platform === "web") {
    updateSql += ", is_login_web = 0";
  } else if (platform === "mobile") {
    updateSql += ", is_login_mobile = 0";
  }
  updateSql += " WHERE id = ?";

  oms_db.query(updateSql, [id], (err, result) => {
    if (err) {
      console.error("Error updating logout status:", err);
      logActivity({
        user_id: id,
        tab: "Logout",
        activity: "Logout Attempt",
        status: 1, // Failed
        summary: "Failed to update logout status",
        details: String(
          `An error occurred while updating the logout status for the user.\n\n\t- User ID: ${id}\n\t- Platform: ${platform}\n\t- Error: ${err}`
        ),
      });
      return res
        .status(500)
        .json({ status: false, error: "Failed to update logout status" });
    }

    logActivity({
      user_id: id,
      tab: "Logout",
      activity: "Logout Status Update",
      status: 2,
      summary: "Logout status updated successfully",
      details: String(
        `User logout status updated successfully.\n\n\t- User ID: ${id}\n\t- Platform: ${platform}`
      ),
    });

    logActivity({
      user_id: id,
      tab: "Logout",
      activity: "Logout Attempt",
      status: 0,
      summary: "Successfully Log Out.",
      details: String(`User logout successfully.\n\n\t- User ID: ${id}`),
    });

    return res.json({ status: true, message: "Logout successful" });
  });
});

app.post("/fetch-financial-groupings-deposit", (req, res) => {
  const { mode, searchTerm, year, startDate, endDate } = req.body;

  // Base query excludes Admin accounts
  let sql = `
  SELECT 
    id,
    created_at,
    name,
    record_no
  FROM record_group
  WHERE tab = 'deposit'
  `;
  let params = [];

  if (mode === "Populate") {
    // No additional filtering needed
    // Optionally: sql += " ORDER BY created_at DESC";
  } else if (mode === "Search") {
    // Search across common fields
    sql += " AND (name LIKE ?)";
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
    sql += " AND (name LIKE ?)";
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

    const formattedResults = results.map((log) => ({
      ...log,
      created_at: formatDateTable(log.created_at),
    }));

    return res.json({ status: true, data: formattedResults });
  });
});

app.post("/fetch-financial-groupings-expense", (req, res) => {
  const { mode, searchTerm, year, startDate, endDate } = req.body;

  // Base query excludes Admin accounts
  let sql = `
  SELECT 
    id,
    created_at,
    name,
    record_no
  FROM record_group
  WHERE tab = 'expense'
  `;
  let params = [];

  if (mode === "Populate") {
    // No additional filtering needed
    // Optionally: sql += " ORDER BY created_at DESC";
  } else if (mode === "Search") {
    // Search across common fields
    sql += " AND (name LIKE ?)";
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
    sql += " AND (name LIKE ?)";
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

    const formattedResults = results.map((log) => ({
      ...log,
      created_at: formatDateTable(log.created_at),
    }));

    return res.json({ status: true, data: formattedResults });
  });
});

app.post("/check-record-group-exist-updated", (req, res) => {
  const { name, tab, id } = req.body;

  if (!name || !tab || !id) {
    return res
      .status(400)
      .json({ status: false, error: "Name and tab are required" });
  }

  const sql = `
    SELECT id 
    FROM record_group 
    WHERE (name = ? AND tab = ?) AND id <> ?
  `;

  oms_db.query(sql, [name, tab, id], (err, results) => {
    if (err) {
      console.error("Error checking updated record group exist:", err);
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

// Route to check if a record group already exists
app.post("/check-record-group-exist", (req, res) => {
  const { name, tab } = req.body;

  if (!name || !tab) {
    return res
      .status(400)
      .json({ status: false, error: "Name and tab are required" });
  }

  const sql = `
    SELECT id 
    FROM record_group 
    WHERE name = ? AND tab = ?
  `;

  oms_db.query(sql, [name, tab], (err, results) => {
    if (err) {
      console.error("Error checking record group exist", err);
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

// Route to create a new record group
app.post("/create-record-group", (req, res) => {
  const { name, description, tab, user_data } = req.body;

  if (!name || !description || !tab) {
    return res.status(400).json({
      status: false,
      error: "Name, description, and tab are required",
    });
  }

  const user_data_parse = JSON.parse(user_data);
  const user_id = user_data_parse.id; // Extract user_id from parsed data

  const sql = `
    INSERT INTO record_group (name, user_id, description, tab) 
    VALUES (?, ?, ?, ?)
  `;

  oms_db.query(sql, [name, user_id, description, tab], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    return res.json({ status: true, id: result.insertId });
  });
});

// Route to fetch record group details by ID
app.post("/fetch-record-group-details", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res
      .status(400)
      .json({ status: false, error: "Record group ID is required" });
  }

  const sql = `
    SELECT 
      id, 
      created_at, 
      updated_at, 
      name, 
      tab, 
      description, 
      record_no 
    FROM record_group 
    WHERE id = ?
  `;

  oms_db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ status: false, error: "Record group not found" });
    }

    const data = results[0];
    data.created_at = formatDate(data.created_at);
    data.updated_at = formatDate(data.updated_at);

    return res.json({ status: true, data: results[0] });
  });
});

// Route to update a record group
app.post("/update-record-group", (req, res) => {
  const { id, name, description } = req.body;

  if (!id || !name || !description) {
    return res
      .status(400)
      .json({ status: false, error: "ID, name, and description are required" });
  }

  const sql = `
    UPDATE record_group 
    SET name = ?, description = ?, updated_at = NOW() 
    WHERE id = ?
  `;

  oms_db.query(sql, [name, description, id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ status: false, error: "Record group not found" });
    }

    return res.json({
      status: true,
      message: "Record group updated successfully",
    });
  });
});

// Route to fetch deposits
app.post("/fetch-deposits", (req, res) => {
  // For simplicity, fetching all deposits. You can add filtering as needed.
  const sql = `
    SELECT 
      d.id, 
      d.name, 
      d.amount, 
      d.issued_at,
      d.record_group_id,
      rg.name as source_name
    FROM deposit d
    LEFT JOIN record_group rg on d.record_group_id = rg.id
    WHERE d.status = 'Issued'
    ORDER BY issued_at DESC
    
  `;
  oms_db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching deposits:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    // Format issued_at for each deposit if not null.
    const data = results.map((deposit) => {
      if (deposit.issued_at !== null) {
        deposit.issued_at = formatDateTableNoTime(deposit.issued_at);
        deposit.amount = "₱ " + deposit.amount;
      }
      return deposit;
    });

    return res.json({ status: true, data: data });
  });
});

// Route to fetch deposits
app.post("/fetch-manage-deposits", (req, res) => {
  // For simplicity, fetching all deposits. You can add filtering as needed.
  const sql =
    "SELECT id, name, issued_at, amount, status FROM deposit ORDER BY created_at DESC";
  oms_db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching deposits:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    // Format issued_at for each deposit if not null.
    const data = results.map((deposit) => {
      if (deposit.issued_at !== null) {
        deposit.issued_at = formatDateTableNoTime(deposit.issued_at);
        deposit.amount = "₱ " + deposit.amount;
      }
      return deposit;
    });

    return res.json({ status: true, data: data });
  });
});

// Route to fetch record groups options for deposit (using query param tab=deposit)
app.get("/fetch-record-groups-options", (req, res) => {
  const { tab } = req.query;
  if (!tab) {
    return res
      .status(400)
      .json({ status: false, error: "Tab parameter is required" });
  }
  const sql = "SELECT id, name FROM record_group WHERE tab = ?";
  oms_db.query(sql, [tab], (err, results) => {
    if (err) {
      console.error("Error fetching record group options:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    return res.json({ status: true, data: results });
  });
});

function updateRecordGroupCount(recordGroupId, type) {
  if (!recordGroupId) {
    console.error("Record Group ID is required.");
    return;
  }

  let countSql = "";
  // Determine which table to use based on the type
  if (type === "Deposit") {
    countSql =
      "SELECT COUNT(*) AS total FROM deposit WHERE record_group_id = ?";
  } else if (type === "Expense") {
    countSql =
      "SELECT COUNT(*) AS total FROM expense WHERE record_group_id = ?";
  } else {
    console.error("Unknown type:", type);
    return;
  }

  // Count records from the appropriate table
  oms_db.query(countSql, [recordGroupId], (err, results) => {
    if (err) {
      console.error(
        "Error counting records for record group",
        recordGroupId,
        ":",
        err
      );
      return;
    }

    // Get the count value from the first result row
    const total = results[0].total;

    // Update the record_group's record_no with the count value
    const updateSql = "UPDATE record_group SET record_no = ? WHERE id = ?";
    oms_db.query(
      updateSql,
      [total, recordGroupId],
      (updateErr, updateResult) => {
        if (updateErr) {
          console.error(
            "Error updating record_no for record group",
            recordGroupId,
            ":",
            updateErr
          );
        } else {
          console.log(
            "Record group",
            recordGroupId,
            "record_no updated to",
            total
          );
        }
      }
    );
  });
}

// Route to check if a draft deposit exists
app.post("/check-draft-deposit", (req, res) => {
  const { user_data, tab } = req.body;
  if (!user_data || !tab) {
    return res
      .status(400)
      .json({ status: false, error: "User data and tab are required" });
  }
  // Assuming deposits with state 'drafting' are drafts
  const sql = "SELECT id FROM deposit WHERE user_id = ? AND status = 'Draft'";
  const userObj = JSON.parse(user_data);
  oms_db.query(sql, [userObj.id, tab], (err, results) => {
    if (err) {
      console.error("Error checking draft deposit:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    return res.json({ hasDraft: results.length > 0 });
  });
});

// Route to issue (finalize) a deposit
app.post("/create-deposit", (req, res) => {
  const { user_data, name, breakdown, amount, record_group_id, proof, status } =
    req.body;
  if (!user_data || !name || !status) {
    return res
      .status(400)
      .json({ status: false, error: "Missing required fields" });
  }
  const userObj = JSON.parse(user_data);
  const issuedAtAssignment = status === "Issued" ? "NOW()" : "NULL";
  const sql = `
    INSERT INTO deposit (user_id, issued_at, name, breakdown, amount, record_group_id, proof, status)
    VALUES (?, ${issuedAtAssignment}, ?, ?, ?, ?, ?, ?)
  `;

  oms_db.query(
    sql,
    [userObj.id, name, breakdown, amount, record_group_id, proof, status],
    (err, result) => {
      if (err) {
        console.error("Error issuing deposit:", err);
        return res
          .status(500)
          .json({ status: false, error: "Internal Server Error" });
      }

      updateRecordGroupCount(record_group_id, "Deposit");

      return res.json({ status: true, id: result.insertId });
    }
  );
});

// Route to handle proof file uploading
// This example uses 'multer' middleware for file uploads. Make sure to install multer.
const path = require("path");

// Configure storage for proofs in the proofs folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "proofs"));
  },
  filename: (req, file, cb) => {
    // Set unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Endpoint to upload proof files
app.post("/upload-proof", upload.array("proofFiles"), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ status: false, error: "No files uploaded" });
  }
  // Return array of file names (without path)
  const fileNames = req.files.map((file) => file.filename);
  return res.json({ status: true, fileNames });
});

app.delete("/delete-proof", (req, res) => {
  const { filename } = req.body;
  if (!filename) {
    return res
      .status(400)
      .json({ status: false, error: "Filename is required." });
  }
  const filePath = path.join(__dirname, "proofs", filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      return res
        .status(500)
        .json({ status: false, error: "File deletion failed." });
    }
    return res.json({ status: true, message: "File deleted successfully." });
  });
});

app.use("/proofs", express.static(path.join(__dirname, "proofs")));

app.post("/fetch-deposit-details", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ status: false, error: "ID is required" });
  }

  const sql = `
    SELECT 
      d.id,
      d.user_id,
      d.created_at,
      d.updated_at,
      d.issued_at,
      d.name,
      d.breakdown,
      d.amount,
      d.proof,
      d.status,
      d.record_group_id,
      ua.full_name treasurer_full_name,
      rg.name AS source_name
    FROM deposit d
    LEFT JOIN user_account ua ON d.user_id = ua.id 
    LEFT JOIN record_group rg ON d.record_group_id = rg.id
    WHERE d.id = ?
  `;

  oms_db.query(sql, id, (err, results) => {
    if (err) {
      console.error("Database error: ", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.json({ status: false, error: "Log not found" });
    }

    const data = results[0];
    data.created_at = formatDate(data.created_at);
    data.updated_at = formatDate(data.updated_at);
    data.issued_at = formatDate(data.issued_at);

    return res.json({ status: true, data: data });
  });
});

// Route to update an existing deposit
app.post("/update-deposit", (req, res) => {
  const { id, name, breakdown, amount, record_group_id, proof, status, mode } =
    req.body;

  // Validate required fields (adjust validations as needed)
  if (!id || !name || !status) {
    return res.status(400).json({
      status: false,
      error: "Deposit ID, name, and status are required.",
    });
  }

  // Determine issued_at value
  // If the deposit is being issued, update issued_at to NOW(); otherwise, clear it (or leave it unchanged)
  const issuedAtAssignment = status === "Issued" ? "NOW()" : "NULL";

  let sql = "";
  let params = [name, breakdown, amount, record_group_id, proof];

  if (mode === "editDraft") {
    sql = `
    UPDATE deposit
    SET name = ?, 
        breakdown = ?, 
        amount = ?, 
        record_group_id = ?, 
        proof = ?, 
        status = ?,
        issued_at = ${issuedAtAssignment}
    WHERE id = ?
    `;
    params.push(status, id);
  } else {
    sql = `
    UPDATE deposit
    SET name = ?, 
        breakdown = ?, 
        amount = ?, 
        record_group_id = ?, 
        proof = ?
    WHERE id = ?
    `;
    params.push(id);
  }

  oms_db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error updating deposit:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ status: false, error: "Deposit not found" });
    }

    updateRecordGroupCount(record_group_id, "Deposit");

    return res.json({
      status: true,
      message: "Deposit updated successfully",
    });
  });
});

app.post("/delete-deposit", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res
      .status(400)
      .json({ status: false, error: "Deposit ID is required" });
  }

  try {
    // First, select the deposit record to get proof and record_group_id
    const depositRecord = await new Promise((resolve, reject) => {
      oms_db.query(
        "SELECT proof, record_group_id FROM deposit WHERE id = ?",
        [id],
        (err, results) => {
          if (err) return reject(err);
          if (results.length === 0)
            return reject(new Error("Deposit not found"));
          resolve(results[0]);
        }
      );
    });

    const { proof, record_group_id } = depositRecord;

    // If proof exists, assume it's a JSON array of filenames
    if (proof) {
      let proofFiles = [];
      try {
        proofFiles = JSON.parse(proof);
        if (!Array.isArray(proofFiles)) proofFiles = [];
      } catch (parseErr) {
        console.error("Error parsing proof JSON:", parseErr);
      }

      // Delete each file from the proofs folder
      const deletePromises = proofFiles.map((fileName) => {
        const filePath = path.join(__dirname, "proofs", fileName);
        return new Promise((resolve) => {
          fs.unlink(filePath, (err) => {
            if (err) console.error(`Error deleting file ${fileName}:`, err);
            resolve();
          });
        });
      });
      await Promise.all(deletePromises);
    }

    // Delete the deposit record
    const deleteResult = await new Promise((resolve, reject) => {
      oms_db.query("DELETE FROM deposit WHERE id = ?", [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    if (deleteResult.affectedRows === 0) {
      return res
        .status(404)
        .json({ status: false, error: "Deposit not found" });
    }

    // Update the record group count after deletion
    updateRecordGroupCount(record_group_id, "Deposit");

    return res.json({
      status: true,
      message: "Deposit deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting deposit:", err);
    return res
      .status(500)
      .json({ status: false, error: "Internal Server Error" });
  }
});

// 🔹 Start Express Server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
