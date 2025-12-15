const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const fs = require("fs");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const sessionManager = require("./session-manager");
const http = require("http");
const socketIO = require("socket.io");
require("dotenv").config();

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Initialize Socket.IO with CORS
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const oms_db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "oms_db",
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

function formatTimeOnly(input) {
  const date = new Date(input);

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const formattedHours = String(hours).padStart(2, "0");

  return `${formattedHours}:${minutes}`;
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
  emitStatsUpdate = false, // Control whether to emit stats-updated event
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

        // 🔹 Only broadcast stats-updated if explicitly enabled
        // This prevents excessive event emissions from routine logging
        if (emitStatsUpdate) {
          io.emit("stats-updated", {
            event: "log-added",
            logId: result.insertId,
            userId: user_id,
            tab: tab,
            timestamp: Date.now(),
          });

          console.log(
            `[Socket.IO] Broadcasting stats-updated event for new log (${tab})`
          );
        }

        resolve(result.insertId);
      }
    });
  });
}

app.get("/api/config", (req, res) => {
  const os = require("os");
  const interfaces = os.networkInterfaces();
  let ipAddress = "localhost";

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        ipAddress = iface.address;
        break;
      }
    }
  }

  res.json({ ipAddress });
});

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

    if (platform === "mobile" && user.designation !== "Member") {
      logActivity({
        user_id: user.id,
        tab: "Login",
        activity: "Login Attempt",
        status: 1,
        summary: "Mobile login restricted",
        details: `User with designation "${user.designation}" is not allowed to login on mobile.`,
      });
      return res
        .status(403)
        .json({ error: "Mobile login is only available for Members." });
    }

    if (parseInt(user.is_enrolled, 10) === 0) {
      logActivity({
        user_id: user.id,
        tab: "Login",
        activity: "Login Attempt",
        status: 1,
        summary: "User not enrolled",
        details: `User with Student ID: ${user.student_id} is not enrolled.`,
      });
      return res.status(403).json({
        error: "Your not enrolled. Please contact the adviser.",
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

      // 🔹 Broadcast user-joined event via Socket.IO only for non-admin users
      if (user.designation !== "Admin") {
        io.to("online-users").emit("user-joined", {
          userId: user.id,
          platform: platform,
          timestamp: Date.now(),
        });

        // 🔹 Broadcast stats-updated for online cards
        io.emit("stats-updated", {
          event: "user-login",
          userId: user.id,
          platform: platform,
          timestamp: Date.now(),
        });

        console.log(
          `[Socket.IO] Broadcasting user-joined and stats-updated events for user ${user.id} (${user.full_name}) on ${platform}`
        );
      }
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

    // 🔹 Start server-side session tracking
    const sessionId = uuidv4();
    sessionManager.registerSession(sessionId, user.id, platform);

    return res.json({ message: "Login successful", user, token, sessionId });
  });
});

app.post("/fetch-your-payments", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "User Data are required" });
  }

  // Fetch all payments that don't have corresponding collections for this user
  // Only include payments with "Issued" status
  const sql = `
    SELECT p.* 
    FROM payment p
    WHERE p.status = 'Issued'
    AND p.id NOT IN (
      SELECT DISTINCT c.payment_id 
      FROM collection c 
      WHERE c.payer_student_id = ?
    )
    ORDER BY p.due_date DESC;
  `;

  oms_db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if user has payments
    if (!results || results.length === 0) {
      return res.json({
        status: true,
        users: [],
        message: "No outstanding payments found",
      });
    }

    // Format the results with due date and color status
    const formattedResults = results.map((payment) => {
      const dueDate = new Date(payment.due_date);
      const now = new Date();

      // Format due_date as dd/mm/yyyy hh:mm AM/PM
      const day = String(dueDate.getDate()).padStart(2, "0");
      const month = String(dueDate.getMonth() + 1).padStart(2, "0");
      const year = dueDate.getFullYear();
      let hours = dueDate.getHours();
      const minutes = String(dueDate.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // convert 0 to 12
      const formattedHours = String(hours).padStart(2, "0");
      const formattedDueDate = `${day}/${month}/${year} at ${formattedHours}:${minutes} ${ampm}`;

      // Format amount with peso sign
      const formattedAmount = `₱${parseFloat(payment.amount).toFixed(2)}`;

      // Determine color based on due date
      let dueDateColor = "text-green-600"; // Default: green (not yet due or more than 1 day away)
      const diffTime = dueDate - now;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays < 0) {
        dueDateColor = "text-red-600"; // Red: overdue
      } else if (diffDays <= 1) {
        dueDateColor = "text-yellow-600"; // Yellow: within 1 day
      }

      return {
        ...payment,
        name: payment.name,
        amount: formattedAmount,
        date_due: formattedDueDate,
        dueDateColor: dueDateColor,
      };
    });

    return res.json({ status: true, users: formattedResults });
  });
});

app.post("/fetch-budgets", async (req, res) => {
  const { mode } = req.body;

  let sql;

  if (mode === "Populate") {
    sql = "SELECT * FROM budget WHERE status = 'Published'";
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

    // Sort results: online users first, then by latest update
    results.sort((a, b) => {
      // First, sort by is_online (1 = online at top, 0 = offline at bottom)
      if (a.is_online !== b.is_online) {
        return b.is_online - a.is_online;
      }
      // Then, sort by updated_at (latest first)
      return new Date(b.updated_at) - new Date(a.updated_at);
    });

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
    "INSERT INTO user_account (full_name, student_id, email, section_id, status, is_enrolled) VALUES (?, ?, ?, ?, 'Not Enrolled', 0)";
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
                    
                    // 🔹 Broadcast account-created event via Socket.IO
                    io.emit("account-updated", {
                      event: "created",
                      userId: user_id,
                      timestamp: Date.now(),
                    });
                    console.log(
                      `[Socket.IO] Broadcasting account-created event for user ${user_id}`
                    );

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

app.post("/bulk-create-accounts", (req, res) => {
  const rows = req.body; // expecting an array of objects
  if (!Array.isArray(rows)) {
    return res
      .status(400)
      .json({ status: false, error: "Invalid input; expected an array." });
  }

  // Retrieve all sections (id and name) for lookup
  const sectionQuery = "SELECT id, name FROM section";
  oms_db.query(sectionQuery, (secErr, secResults) => {
    if (secErr) {
      console.error("Error retrieving sections:", secErr);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    // Build a lookup map: section name => section id
    const sectionMap = {};
    secResults.forEach((sec) => {
      sectionMap[sec.name] = sec.id;
    });

    let processed = [];
    let errors = [];

    function processRow(i) {
      if (i >= rows.length) {
        return res.json({ status: true, processed, errors });
      }
      const row = rows[i];
      // Expected row fields: StudentID, FullName, Email, Section, Status
      const { StudentID, FullName, Email, Section, Status } = row;
      const section_id = sectionMap[Section] || null;
      const is_enrolled = Status === "Continuing" ? 1 : 0;

      if (!StudentID || !FullName || !Email || !section_id || !Status) {
        errors.push({ StudentID, error: "Missing required fields in row" });
        return processRow(i + 1);
      }

      // Check if a user with the given StudentID exists
      const checkUserSql =
        "SELECT id, designation FROM user_account WHERE student_id = ?";
      oms_db.query(checkUserSql, [StudentID], (chkErr, userRows) => {
        if (chkErr) {
          errors.push({ StudentID, error: chkErr.message });
          return processRow(i + 1);
        }
        if (userRows.length > 0) {
          // Existing account: update status, is_enrolled and section_id.
          const user = userRows[0];
          const user_id = user.id;
          const existingDesig = user.designation;

          // If the existing designation is 'Representative', clear their current section representative...
          if (existingDesig === "Representative") {
            // Set representative = NULL in any section where this user is representative
            const clearRepSql =
              "UPDATE section SET representative = NULL WHERE representative = ?";
            oms_db.query(clearRepSql, [user_id], (clearErr) => {
              if (clearErr) {
                errors.push({
                  StudentID,
                  error: "Error clearing representative: " + clearErr.message,
                });
              }
              // Then update new section to set representative = user_id.
              const setRepSql =
                "UPDATE section SET representative = ? WHERE id = ?";
              oms_db.query(setRepSql, [user_id, section_id], (setErr) => {
                if (setErr) {
                  errors.push({
                    StudentID,
                    error:
                      "Error setting new representative: " + setErr.message,
                  });
                }
              });
            });
          }
          const updateUserSql =
            "UPDATE user_account SET status = ?, is_enrolled = ?, section_id = ? WHERE id = ?";
          oms_db.query(
            updateUserSql,
            [Status, is_enrolled, section_id, user_id],
            (updErr) => {
              if (updErr) {
                errors.push({ StudentID, error: updErr.message });
              } else {
                processed.push({ StudentID, action: "updated", user_id });
              }
              processRow(i + 1);
            }
          );
        } else {
          // New account: insert minimal record, then update settings.
          const insertUserSql = `
            INSERT INTO user_account (full_name, student_id, email, section_id, status, is_enrolled)
            VALUES (?, ?, ?, ?, ?, ?)
          `;
          oms_db.query(
            insertUserSql,
            [FullName, StudentID, Email, section_id, Status, is_enrolled],
            (insErr, insResult) => {
              if (insErr) {
                errors.push({ StudentID, error: insErr.message });
                return processRow(i + 1);
              }
              const user_id = insResult.insertId;
              // Increment section's student_no
              const incrSql =
                "UPDATE section SET student_no = student_no + 1 WHERE id = ?";
              oms_db.query(incrSql, [section_id], (incrErr) => {
                if (incrErr) {
                  console.error(
                    "Error incrementing section student_no:",
                    incrErr
                  );
                }
              });
              // Generate a random password and hash it.
              const generatedPassword = generatePassword(8);
              bcrypt.hash(generatedPassword, 10, (hashErr, hashedPassword) => {
                if (hashErr) {
                  errors.push({
                    StudentID,
                    error: "Password hash error: " + hashErr.message,
                  });
                  return processRow(i + 1);
                }
                // Insert default settings.
                const insertSettingsSql =
                  "INSERT INTO settings (user_id, theme) VALUES (?, ?)";
                oms_db.query(
                  insertSettingsSql,
                  [user_id, "default"],
                  (setErr, settingsResult) => {
                    if (setErr) {
                      errors.push({
                        StudentID,
                        error: "Settings insert error: " + setErr.message,
                      });
                      return processRow(i + 1);
                    }
                    const settings_id = settingsResult.insertId;
                    // Insert default security question entry.
                    const insertSecuritySql =
                      "INSERT INTO security_q (user_id) VALUES (?)";
                    oms_db.query(
                      insertSecuritySql,
                      [user_id],
                      (secErr, secResult) => {
                        if (secErr) {
                          errors.push({
                            StudentID,
                            error: "Security insert error: " + secErr.message,
                          });
                          return processRow(i + 1);
                        }
                        const security_q_id = secResult.insertId;
                        // Update user_account with generated password, hashed password, etc.
                        const profilePic = "src/assets/profile_default.svg";
                        const updateUserSql = `
                    UPDATE user_account SET 
                      initial_password = ?, 
                      password = ?,
                      profile_pic = ?,
                      security_q_id = ?,
                      settings_id = ?,
                      designation = ?
                    WHERE id = ?
                  `;
                        // New accounts default to 'Member'
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
                          (updErr) => {
                            if (updErr) {
                              errors.push({
                                StudentID,
                                error: "User update error: " + updErr.message,
                              });
                            } else {
                              processed.push({
                                StudentID,
                                action: "created",
                                user_id,
                              });
                            }
                            processRow(i + 1);
                          }
                        );
                      }
                    );
                  }
                );
              });
            }
          );
        }
      });
    }
    processRow(0);
  });
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
      ua.status,
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
    status,
  } = req.body;

  if (
    !id ||
    !full_name ||
    !student_id ||
    !email ||
    !section_id ||
    !designation ||
    !status
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

  const is_enrolled = status === "Continuing" ? 1 : 0;

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
          status = ?,
          is_enrolled = ?,
          initial_password = ?, 
          password = ?
        WHERE id = ?`;
      updateValues = [
        full_name,
        student_id,
        email,
        section_id,
        designation,
        status,
        is_enrolled,
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
          designation = ?,
          status = ?,
          is_enrolled = ?
        WHERE id = ?`;
      updateValues = [
        full_name,
        student_id,
        email,
        section_id,
        designation,
        status,
        is_enrolled,
        id,
      ];
    }

    // Check if user's current designation is Representative and is being changed to something else
    const currentUserSql = "SELECT designation FROM user_account WHERE id = ?";
    const currentUser = await new Promise((resolve, reject) => {
      oms_db.query(currentUserSql, [id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });

    if (
      currentUser &&
      currentUser.designation === "Representative" &&
      designation !== "Representative"
    ) {
      // Clear the representative field in the section record
      await new Promise((resolve, reject) => {
        oms_db.query(
          "UPDATE section SET representative = NULL WHERE representative = ?",
          [id],
          (err) => (err ? reject(err) : resolve())
        );
      });
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

    // 🔹 Broadcast account-deleted event via Socket.IO
    io.emit("account-updated", {
      event: "deleted",
      userId: id,
      timestamp: Date.now(),
    });
    console.log(
      `[Socket.IO] Broadcasting account-deleted event for user ${id}`
    );

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
*/

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
      ua.full_name AS representative_full_name,
      ua.profile_pic AS representative_profile_pic
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

    if (data.representative_profile_pic === null) {
      data.representative_profile_pic = "src/assets/profile_default.svg";
    }

    // Fetch enrolled users for this section
    const usersSql = `
      SELECT 
        profile_pic,
        student_id,
        full_name,
        designation
      FROM user_account
      WHERE section_id = ? AND designation != 'Admin' AND status = 'Continuing'
      ORDER BY full_name ASC`;

    oms_db.query(usersSql, [id], (userErr, usersResults) => {
      if (userErr) {
        console.error("Error fetching users:", userErr);
        data.enrolled_users = [];
      } else {
        data.enrolled_users = usersResults || [];
      }
      return res.json({ status: true, data });
    });
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

// ============================================================================
// ENDPOINT: Fetch Currently Online Users (with profile pic, student_id, name, platform)
// ============================================================================
app.post("/fetch-currently-online", (req, res) => {
  const { id } = req.body;

  // Log the process
  logActivity({
    user_id: id || null,
    tab: "Admin Dashboard",
    activity: "Fetch Dashboard Data Attempt",
    status: 2, // Process
    summary: "Fetching currently online users...",
    details:
      "The system is attempting to fetch list of currently online users for Admin Dashboard.",
  }).catch((err) => {
    console.error("Failed to log process activity:", err);
  });

  // Query to get online users with their details
  // Build platform string based on web/mobile status
  const sql = `
    SELECT 
      u.id,
      u.profile_pic,
      u.student_id,
      u.full_name,
      CASE 
        WHEN u.is_login_web = 1 AND u.is_login_mobile = 1 THEN 'Web & Mobile'
        WHEN u.is_login_web = 1 THEN 'Web'
        WHEN u.is_login_mobile = 1 THEN 'Mobile'
        ELSE 'Unknown'
      END AS platform,
      u.is_online,
      u.is_login_web,
      u.is_login_mobile,
      u.updated_at
    FROM user_account u
    WHERE u.is_online = 1 
      AND u.designation <> 'Admin'
    ORDER BY u.updated_at DESC
  `;

  oms_db.query(sql, [], (err, results) => {
    if (err) {
      console.error("Database error:", err);

      // Log the failure
      logActivity({
        user_id: id || null,
        tab: "Admin Dashboard",
        activity: "Fetch Dashboard Data Attempt",
        status: 1, // Failed
        summary: "Failed to fetch currently online users",
        details: `An error occurred while fetching online users.\n\nError: ${err}`,
      }).catch((logErr) => {
        console.error("Failed to log failed activity:", logErr);
      });

      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    // Format the results for frontend
    const formattedResults = results.map((user) => ({
      id: user.id,
      profile_pic: user.profile_pic,
      student_id: user.student_id,
      full_name: user.full_name,
      name: user.full_name, // Alias for compatibility
      platform: user.platform,
      is_online: user.is_online,
      is_login_web: user.is_login_web,
      is_login_mobile: user.is_login_mobile,
      updated_at: user.updated_at,
    }));

    // Log the success
    logActivity({
      user_id: id || null,
      tab: "Admin Dashboard",
      activity: "Fetch Dashboard Data Attempt",
      status: 0, // Success
      summary: "Successfully fetched currently online users",
      details: `The system successfully fetched ${results.length} online users for Admin Dashboard.`,
    }).catch((logErr) => {
      console.error("Failed to log success activity:", logErr);
    });

    return res.json({ status: true, data: formattedResults });
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

    // Broadcast user-left event via Socket.IO to update currently online card
    io.to("online-users").emit("user-left", {
      userId: id,
      platform: platform,
      timestamp: Date.now(),
    });

    // 🔹 Broadcast stats-updated for online cards
    io.emit("stats-updated", {
      event: "user-logout",
      userId: id,
      platform: platform,
      timestamp: Date.now(),
    });

    console.log(
      `[Socket.IO] Broadcasting user-left and stats-updated events for user ${id} on ${platform}`
    );

    return res.json({ status: true, message: "Logout successful" });
  });
});

// Configure storage for profile pictures in the profile-pic folder
const profilePicStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "profile-pic"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // Sanitize filename: replace spaces and special characters
    const sanitizedName = file.originalname
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .toLowerCase();
    cb(null, uniqueSuffix + "-" + sanitizedName);
  },
});
const profilePicUpload = multer({ storage: profilePicStorage });

// Route to upload profile picture
app.post(
  "/upload-profile-pic",
  profilePicUpload.single("profilePic"),
  (req, res) => {
    const { userId } = req.body;
    const file = req.file;

    if (!userId || !file) {
      return res.status(400).json({
        status: false,
        error: "User ID and profile picture file are required",
      });
    }

    // First, fetch the current user to get the old profile picture filename
    const fetchSql = "SELECT profile_pic FROM user_account WHERE id = ?";
    oms_db.query(fetchSql, [userId], (err, results) => {
      if (err) {
        console.error("Error fetching current profile picture:", err);
        return res.status(500).json({
          status: false,
          error: "Failed to fetch current user data",
        });
      }

      // Delete the old profile picture file if it exists and is not a default icon
      if (results.length > 0 && results[0].profile_pic) {
        const oldProfilePic = results[0].profile_pic;

        // Only delete if it's not an icon path (doesn't start with "src/")
        if (!oldProfilePic.startsWith("src/")) {
          const oldFilePath = path.join(
            __dirname,
            "profile-pic",
            oldProfilePic
          );
          fs.unlink(oldFilePath, (unlinkErr) => {
            if (unlinkErr && unlinkErr.code !== "ENOENT") {
              console.warn(
                "Warning: Could not delete old profile picture:",
                unlinkErr
              );
            }
          });
        }
      }

      // Store only the filename (without path prefix)
      const fileName = file.filename;

      // Update the user_account table with the new profile picture filename
      const updateSql = "UPDATE user_account SET profile_pic = ? WHERE id = ?";

      oms_db.query(updateSql, [fileName, userId], (err) => {
        if (err) {
          console.error("Error updating profile picture:", err);
          return res.status(500).json({
            status: false,
            error: "Failed to update profile picture",
          });
        }

        // Fetch the updated user details
        const updatedFetchSql = "SELECT * FROM user_account WHERE id = ?";
        oms_db.query(updatedFetchSql, [userId], (err, updatedResults) => {
          if (err || updatedResults.length === 0) {
            console.error("Error fetching updated user:", err);
            return res.status(500).json({
              status: false,
              error: "Failed to fetch updated user details",
            });
          }

          // Remove sensitive data
          const user = updatedResults[0];
          delete user.password;

          return res.json({
            status: true,
            data: user,
            message: "Profile picture updated successfully",
          });
        });
      });
    });
  }
);

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
    params.push(pattern);
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
    params.push(pattern);
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
  const { mode, searchTerm, year, startDate, endDate } = req.body;
  let sql = `
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
  `;

  let params = [];

  if (mode === "Populate") {
    // No additional filtering needed
    // Optionally: sql += " ORDER BY created_at DESC";
  } else if (mode === "Search") {
    // Search across common fields
    sql += " AND (CAST(d.amount AS CHAR) LIKE ? OR rg.name LIKE ?)";
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern);
  } else if (mode === "Filter") {
    // Filter by creation year and optionally by date range (requires created_at field)
    sql += " AND YEAR(d.issued_at) = ?";
    params.push(year);
    if (startDate) {
      sql += " AND d.issued_at >= ?";
      params.push(startDate);
    }
    if (endDate) {
      sql += " AND d.issued_at <= ?";
      params.push(endDate);
    }
  } else if (mode === "Mixed") {
    // Both search and filter criteria
    sql += " AND (CAST(d.amount AS CHAR) LIKE ? OR rg.name LIKE ?)";
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern);
    sql += " AND YEAR(d.issued_at) = ?";
    params.push(year);
    if (startDate) {
      sql += " AND d.issued_at >= ?";
      params.push(startDate);
    }
    if (endDate) {
      sql += " AND d.issued_at <= ?";
      params.push(endDate);
    }
  }

  sql += " ORDER BY d.issued_at DESC";

  oms_db.query(sql, params, (err, results) => {
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
  const { mode, searchTerm, year, startDate, endDate } = req.body;

  // Base query and JOIN
  let sql = `
    SELECT 
      id, 
      name, 
      issued_at, 
      amount, 
      status
    FROM deposit
  `;

  let conditions = [];
  let params = [];

  // Add conditions based on mode
  if (mode === "Search") {
    conditions.push("(CAST(amount AS CHAR) LIKE ? OR name LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern);
  } else if (mode === "Filter") {
    conditions.push("YEAR(issued_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("issued_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("issued_at <= ?");
      params.push(endDate);
    }
  } else if (mode === "Mixed") {
    conditions.push("(CAST(amount AS CHAR) LIKE ? OR name LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern);
    conditions.push("YEAR(issued_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("issued_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("issued_at <= ?");
      params.push(endDate);
    }
  }

  // Append WHERE clause if there are any conditions
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  sql += " ORDER BY created_at DESC";

  oms_db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching deposits:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    const data = results.map((deposit) => {
      if (deposit.issued_at !== null) {
        deposit.issued_at = formatDateTableNoTime(deposit.issued_at);
      }
      deposit.amount = "₱ " + deposit.amount;
      return deposit;
    });

    return res.json({ status: true, data });
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

// Route to fetch current organization balance (Total deposit amount - Total expense amount)
app.post("/fetch-current-org-balance", (req, res) => {
  // Sum only deposits with status Issued
  const depositSql =
    "SELECT IFNULL(SUM(amount),0) AS totalDeposit FROM deposit WHERE status = 'Issued'";
  const expenseSql =
    "SELECT IFNULL(SUM(amount),0) AS totalExpense FROM expense";

  oms_db.query(depositSql, (depErr, depResults) => {
    if (depErr) {
      console.error("Error fetching deposits:", depErr);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    oms_db.query(expenseSql, (expErr, expResults) => {
      if (expErr) {
        console.error("Error fetching expenses:", expErr);
        return res
          .status(500)
          .json({ status: false, error: "Internal Server Error" });
      }
      const totalDeposit = parseFloat(depResults[0].totalDeposit) || 0;
      const totalExpense = parseFloat(expResults[0].totalExpense) || 0;
      const currentOrgBalance = totalDeposit - totalExpense;
      const currentOrgBalanceRounded = Number(currentOrgBalance.toFixed(2));
      const displayBalance =
        currentOrgBalanceRounded < 0
          ? `₱ 0.00 (₱ ${currentOrgBalanceRounded})`
          : "₱ " + currentOrgBalanceRounded;
      return res.json({
        status: true,
        data: { current_org_bal: displayBalance },
      });
    });
  });
});
// Route to fetch the latest issued deposit
app.post("/fetch-latest-org-deposit", (req, res) => {
  // Assumes that the latest deposit is determined by issued_at descending.
  const sql =
    "SELECT amount FROM deposit WHERE status = 'Issued' ORDER BY issued_at DESC LIMIT 1";
  oms_db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching latest deposit:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    const deposit = "+ ₱ " + results[0].amount;
    return res.json({
      status: true,
      data: results[0]
        ? { latest_org_deposit: deposit }
        : { latest_org_deposit: "₱ 0.00" },
    });
  });
});

// Route to fetch the latest expense
app.post("/fetch-latest-org-expense", (req, res) => {
  // Assumes that the latest expense is the one created most recently.
  const sql =
    "SELECT amount FROM expense WHERE status = 'Issued' ORDER BY created_at DESC LIMIT 1";
  oms_db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching latest expense:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    const expense = "- ₱ " + results[0].amount;
    return res.json({
      status: true,
      data: results[0]
        ? { latest_org_expense: expense }
        : { latest_org_expense: "₱ 0.00" },
    });
  });
});

// Route to fetch your servicing points (for logged-in user)
// Expects { id } in req.body.
app.post("/fetch-your-servicing-points", (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res
      .status(400)
      .json({ status: false, error: "User ID is required" });
  }
  const sql =
    "SELECT servicing_points as your_servicing_points FROM user_account WHERE id = ?";
  oms_db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching servicing points:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    // Return the servicing_points of the user.
    return res.json({
      status: true,
      data: results[0] ? results[0] : 0,
    });
  });
});

// Route to fetch expenses
app.post("/fetch-expenses", (req, res) => {
  const { mode, searchTerm, year, startDate, endDate } = req.body;
  let sql = `
    SELECT 
      e.id, 
      e.name, 
      e.amount, 
      e.issued_at,
      e.record_group_id,
      rg.name as category_name
    FROM expense e
    LEFT JOIN record_group rg on e.record_group_id = rg.id
    WHERE e.status = 'Issued'
    
  `;

  let params = [];

  if (mode === "Populate") {
    // No additional filtering needed
    // Optionally: sql += " ORDER BY created_at DESC";
  } else if (mode === "Search") {
    // Search across common fields
    sql += " AND (CAST(e.amount AS CHAR) LIKE ? OR rg.name LIKE ?)";
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern);
  } else if (mode === "Filter") {
    // Filter by creation year and optionally by date range (requires created_at field)
    sql += " AND YEAR(e.issued_at) = ?";
    params.push(year);
    if (startDate) {
      sql += " AND e.issued_at >= ?";
      params.push(startDate);
    }
    if (endDate) {
      sql += " AND e.issued_at <= ?";
      params.push(endDate);
    }
  } else if (mode === "Mixed") {
    // Both search and filter criteria
    sql += " AND (CAST(d.amount AS CHAR) LIKE ? OR rg.name LIKE ?)";
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern);
    sql += " AND YEAR(e.issued_at) = ?";
    params.push(year);
    if (startDate) {
      sql += " AND e.issued_at >= ?";
      params.push(startDate);
    }
    if (endDate) {
      sql += " AND e.issued_at <= ?";
      params.push(endDate);
    }
  }

  sql += " ORDER BY e.issued_at DESC";

  oms_db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching expenses:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    // Format issued_at for each expense if not null.
    const data = results.map((expense) => {
      if (expense.issued_at !== null) {
        expense.issued_at = formatDateTableNoTime(expense.issued_at);
      }
      expense.amount = "₱ " + expense.amount;
      return expense;
    });

    return res.json({ status: true, data: data });
  });
});

// Route to fetch expenses for management
app.post("/fetch-manage-expenses", (req, res) => {
  const { mode, searchTerm, year, startDate, endDate } = req.body;

  // Base query and JOIN
  let sql = `
    SELECT 
      id, 
      name, 
      issued_at, 
      amount, 
      status
    FROM expense
  `;

  let conditions = [];
  let params = [];

  // Add conditions based on mode
  if (mode === "Search") {
    conditions.push("(CAST(amount AS CHAR) LIKE ? OR name LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern);
  } else if (mode === "Filter") {
    conditions.push("YEAR(issued_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("issued_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("issued_at <= ?");
      params.push(endDate);
    }
  } else if (mode === "Mixed") {
    conditions.push("(CAST(amount AS CHAR) LIKE ? OR name LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern);
    conditions.push("YEAR(issued_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("issued_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("issued_at <= ?");
      params.push(endDate);
    }
  }

  // Append WHERE clause if there are any conditions
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  sql += " ORDER BY created_at DESC";

  oms_db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching expensecs:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    // Format issued_at for each deposit if not null.
    const data = results.map((expense) => {
      if (expense.issued_at !== null) {
        expense.issued_at = formatDateTableNoTime(expense.issued_at);
      }
      expense.amount = "₱ " + expense.amount;
      return expense;
    });

    return res.json({ status: true, data: data });
  });
});

// Route to check if a draft deposit exists
app.post("/check-draft-expense", (req, res) => {
  const { user_data, tab } = req.body;
  if (!user_data || !tab) {
    return res
      .status(400)
      .json({ status: false, error: "User data and tab are required" });
  }
  // Assuming deposits with state 'drafting' are drafts
  const sql = "SELECT id FROM expense WHERE user_id = ? AND status = 'Draft'";
  const userObj = JSON.parse(user_data);
  oms_db.query(sql, [userObj.id, tab], (err, results) => {
    if (err) {
      console.error("Error checking draft expense:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    return res.json({ hasDraft: results.length > 0 });
  });
});

// Route to fetch record groups options for deposit (using query param tab=deposit)
app.get("/fetch-budget-options", (req, res) => {
  const sql = "SELECT id, name FROM budget";
  oms_db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching budget options:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    return res.json({ status: true, data: results });
  });
});

// Configure storage for receipts in the "receipts" folder.
const receiptStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "receipts"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const receiptUpload = multer({ storage: receiptStorage });

// Route to upload receipt files.
app.post(
  "/upload-receipt-image",
  receiptUpload.array("receiptFile"),
  (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ status: false, error: "No receipt file uploaded" });
    }
    const fileNames = req.files.map((file) => file.filename);
    return res.json({ status: true, fileNames });
  }
);

// Route to create a receipt record.
// Expected fields: type, image, direction, receive_from, receive_to.
// The newly inserted receipt's id is returned.
app.post("/create-receipt", (req, res) => {
  const { user_data, type, image, direction, receive_from, receive_to } =
    req.body;
  if (
    !user_data ||
    !type ||
    !image ||
    !direction ||
    !receive_from ||
    !receive_to
  ) {
    return res
      .status(400)
      .json({ status: false, error: "Missing required receipt fields" });
  }
  const userObj = JSON.parse(user_data);
  const sql = `
      INSERT INTO receipt (user_id, type, image, direction, receive_from, receive_to)
      VALUES (?, ?, ?, ?, ?, ?)
  `;
  oms_db.query(
    sql,
    [userObj.id, type, image, direction, receive_from, receive_to],
    (err, result) => {
      if (err) {
        console.error("Error creating receipt:", err);
        return res
          .status(500)
          .json({ status: false, error: "Internal Server Error" });
      }
      return res.json({ status: true, id: result.insertId });
    }
  );
});

// Modified /create-expense route.
// This route now expects receipt_ids (as a JSON array string) and, after creating the expense,
// updates each receipt (in the receipt table) to set relating_id = expense id.
app.post("/create-expense", (req, res) => {
  const {
    user_data,
    name,
    breakdown,
    amount,
    record_group_id,
    proof,
    receipt_ids,
    status,
  } = req.body;
  if (!user_data || !name || !status) {
    return res
      .status(400)
      .json({ status: false, error: "Missing required fields" });
  }
  const userObj = JSON.parse(user_data);
  const issuedAtAssignment = status === "Issued" ? "NOW()" : "NULL";
  const sql = `
      INSERT INTO expense (user_id, issued_at, name, breakdown, amount, record_group_id, proof, status, receipt_ids)
      VALUES (?, ${issuedAtAssignment}, ?, ?, ?, ?, ?, ?, ?)
  `;
  oms_db.query(
    sql,
    [
      userObj.id,
      name,
      breakdown,
      amount,
      record_group_id,
      proof,
      status,
      receipt_ids,
    ],
    (err, result) => {
      if (err) {
        console.error("Error creating expense:", err);
        return res
          .status(500)
          .json({ status: false, error: "Internal Server Error" });
      }
      const expenseId = result.insertId;
      // If receipt_ids provided, update each receipt to set relating_id = expenseId.
      if (receipt_ids) {
        let ids;
        try {
          ids = JSON.parse(receipt_ids);
          if (!Array.isArray(ids)) {
            ids = [];
          }
        } catch (e) {
          ids = [];
        }
        if (ids.length > 0) {
          const updateSql = `
                      UPDATE receipt SET relating_id = ?
                      WHERE id IN (${ids.map(() => "?").join(",")})
                  `;
          console.log("updateSql", updateSql);
          oms_db.query(
            updateSql,
            [expenseId, ...ids],
            (updateErr, updateResult) => {
              if (updateErr) {
                console.error("Error updating receipt relating_id:", updateErr);
              }
              return res.json({ status: true, id: expenseId });
            }
          );
        } else {
          return res.json({ status: true, id: expenseId });
        }
      } else {
        return res.json({ status: true, id: expenseId });
      }
    }
  );
});

app.get("/fetch-user-options", (req, res) => {
  const sql =
    "SELECT student_id, full_name FROM user_account WHERE designation <> 'Admin'";
  oms_db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching user options:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    return res.json({ status: true, data: results });
  });
});

app.post("/delete-receipt", (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res
      .status(400)
      .json({ status: false, error: "Receipt id is required." });
  }
  // First, fetch the receipt to know the image filename
  const selectSql = "SELECT image FROM receipt WHERE id = ?";
  oms_db.query(selectSql, [id], (selectErr, results) => {
    if (selectErr) {
      console.error("Error selecting receipt:", selectErr);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    if (results.length === 0) {
      return res
        .status(404)
        .json({ status: false, error: "Receipt not found." });
    }
    const { image } = results[0];
    // Construct image file path (assuming images are stored in the "receipts" folder)
    const imagePath = path.join(__dirname, "receipts", image);
    // Delete the image file if exists
    fs.unlink(imagePath, (fsErr) => {
      if (fsErr && fsErr.code !== "ENOENT") {
        console.error("Error deleting file:", fsErr);
        // Optionally continue to delete record even if file deletion fails
      }
      // Now delete the receipt record from DB
      const deleteSql = "DELETE FROM receipt WHERE id = ?";
      oms_db.query(deleteSql, [id], (deleteErr, deleteResult) => {
        if (deleteErr) {
          console.error("Error deleting receipt record:", deleteErr);
          return res
            .status(500)
            .json({ status: false, error: "Internal Server Error" });
        }
        return res.json({
          status: true,
          message: "Receipt deleted successfully.",
        });
      });
    });
  });
});

// FETCH RECEIPT DETAILS ROUTE
app.post("/fetch-receipt-details", (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res
      .status(400)
      .json({ status: false, error: "Receipt id is required." });
  }
  const sql = `
    SELECT 
      r.id,
      r.user_id,
      r.created_at,
      r.updated_at,
      r.type,
      IFNULL(r.relating_id, 'Not Yet Assigned') AS relating_id,
      r.image,
      COALESCE(uf.full_name, r.receive_from) AS receive_from_name,
      CASE WHEN uf.student_id IS NOT NULL THEN 1 ELSE 0 END AS receive_from_comsoc,
      uf.student_id as receive_from_student_id,
      COALESCE(ut.full_name, r.receive_to) AS receive_to_name,
      CASE WHEN ut.student_id IS NOT NULL THEN 1 ELSE 0 END AS receive_to_comsoc,
      ut.student_id as receive_to_student_id,
      r.direction,
      ua.full_name AS full_name,
      ua.designation AS designation,
      r.relating_id
    FROM receipt r
    LEFT JOIN user_account uf ON r.receive_from = uf.student_id
    LEFT JOIN user_account ut ON r.receive_to = ut.student_id
    LEFT JOIN user_account ua ON r.user_id = ua.id
    WHERE r.id = ?
  `;
  oms_db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching receipt details:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    if (results.length === 0) {
      return res
        .status(404)
        .json({ status: false, error: "Receipt not found." });
    }
    const data = results[0];
    data.created_at = formatDate(data.created_at);
    data.updated_at = formatDate(data.updated_at);
    return res.json({ status: true, receipt: data });
  });
});

// Route to delete a receipt image file.
app.post("/delete-receipt-image", (req, res) => {
  const { filename } = req.body;
  if (!filename) {
    return res
      .status(400)
      .json({ status: false, error: "Filename is required" });
  }
  const imagePath = path.join(__dirname, "receipts", filename);
  fs.unlink(imagePath, (err) => {
    if (err && err.code !== "ENOENT") {
      console.error("Error deleting receipt image:", err);
      return res
        .status(500)
        .json({ status: false, error: "File deletion failed" });
    }
    return res.json({
      status: true,
      message: "Receipt image deleted successfully.",
    });
  });
});

// Route to update a receipt record.
app.post("/update-receipt", (req, res) => {
  const { id, type, image, receive_from, receive_to } = req.body;
  if (!id || !type || !image || !receive_from || !receive_to) {
    return res
      .status(400)
      .json({ status: false, error: "Missing required fields" });
  }
  const sql = `
    UPDATE receipt SET 
      type = ?,
      image = ?,
      receive_from = ?,
      receive_to = ?
    WHERE id = ?`;
  oms_db.query(
    sql,
    [type, image, receive_from, receive_to, id],
    (err, result) => {
      if (err) {
        console.error("Error updating receipt:", err);
        return res
          .status(500)
          .json({ status: false, error: "Internal Server Error" });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ status: false, error: "Receipt not found" });
      }
      return res.json({
        status: true,
        message: "Receipt updated successfully",
      });
    }
  );
});

app.post("/fetch-expense-details", (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res
      .status(400)
      .json({ status: false, error: "Expense ID is required." });
  }

  // Query the expense along with the budget name (using budget_id)
  const sql = `
    SELECT 
      e.id,
      e.user_id,
      e.created_at,
      e.updated_at,
      e.issued_at,
      e.name,
      e.breakdown,
      e.amount,
      e.proof,
      e.status,
      e.budget_id,
      e.receipt_ids,
      e.record_group_id,
      ua.full_name treasurer_full_name,
      rg.name AS category_name,
      b.name AS budget_name
    FROM expense e
    LEFT JOIN budget b ON e.budget_id = b.id
    LEFT JOIN user_account ua ON e.user_id = ua.id 
    LEFT JOIN record_group rg ON e.record_group_id = rg.id
    WHERE e.id = ?
  `;
  oms_db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching expense details:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    if (results.length === 0) {
      return res
        .status(404)
        .json({ status: false, error: "Expense not found." });
    }

    const expense = results[0];

    // Parse receipt_ids (expected to be a JSON array string)
    let receiptIDs = [];
    try {
      receiptIDs = JSON.parse(expense.receipt_ids);
      if (!Array.isArray(receiptIDs)) {
        receiptIDs = [];
      }
    } catch (parseErr) {
      receiptIDs = [];
    }

    expense.created_at = formatDate(expense.created_at);
    expense.updated_at = formatDate(expense.updated_at);
    expense.issued_at = formatDate(expense.issued_at);

    // If there are receipt IDs, query the receipts table to get the corresponding image filenames
    if (receiptIDs.length > 0) {
      const placeholders = receiptIDs.map(() => "?").join(",");
      const receiptsSql = `SELECT id, image FROM receipt WHERE id IN (${placeholders})`;
      oms_db.query(receiptsSql, receiptIDs, (recErr, recResults) => {
        if (recErr) {
          console.error("Error fetching receipt details:", recErr);
          return res
            .status(500)
            .json({ status: false, error: "Internal Server Error" });
        }
        // Build an array of receipt previews (file names)
        const receiptPreviews = recResults.map((r) => r.image);
        expense.receiptPreviews = receiptPreviews;
        return res.json({ status: true, data: expense });
      });
    } else {
      expense.receiptPreviews = [];
      return res.json({ status: true, data: expense });
    }
  });
});

app.post("/update-expense", (req, res) => {
  const {
    id,
    name,
    breakdown,
    amount,
    record_group_id,
    proof,
    receipt_ids,
    status,
    mode,
    budget_id,
  } = req.body;

  // Validate required fields.
  if (!id || !name || !status) {
    return res.status(400).json({
      status: false,
      error: "Expense ID, name, and status are required.",
    });
  }

  // Determine issued_at value.
  const issuedAtAssignment = status === "Issued" ? "NOW()" : "NULL";
  const budgetIdAssignment = budget_id === "null" ? "NULL" : `${budget_id}`;

  let sql = "";
  let params = [name, breakdown, amount, record_group_id, proof, receipt_ids];

  if (mode === "editDraft") {
    sql = `
      UPDATE expense
      SET name = ?,
          breakdown = ?,
          amount = ?,
          record_group_id = ?,
          proof = ?,
          receipt_ids = ?,
          status = ?,
          issued_at = ${issuedAtAssignment},
          budget_id = ${budgetIdAssignment}
      WHERE id = ?
    `;
    params.push(status, id);
  } else {
    sql = `
      UPDATE expense
      SET name = ?,
          breakdown = ?,
          amount = ?,
          record_group_id = ?,
          proof = ?,
          receipt_ids = ?,
          budget_id = ${budgetIdAssignment}
      WHERE id = ?
    `;
    params.push(id);
  }

  oms_db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error updating expense:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ status: false, error: "Expense not found" });
    }

    // Update the record group count for an expense.
    updateRecordGroupCount(record_group_id, "Expense");

    return res.json({
      status: true,
      message: "Expense updated successfully",
    });
  });
});

app.post("/delete-expense", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res
      .status(400)
      .json({ status: false, error: "Expense ID is required" });
  }

  try {
    // First, select the expense record to get proof, record_group_id, and receipt_ids.
    const expenseRecord = await new Promise((resolve, reject) => {
      oms_db.query(
        "SELECT proof, record_group_id, receipt_ids FROM expense WHERE id = ?",
        [id],
        (err, results) => {
          if (err) return reject(err);
          if (results.length === 0)
            return reject(new Error("Expense not found"));
          resolve(results[0]);
        }
      );
    });

    const { proof, record_group_id, receipt_ids } = expenseRecord;

    // Delete proof files (if any)
    if (proof) {
      let proofFiles = [];
      try {
        proofFiles = JSON.parse(proof);
        if (!Array.isArray(proofFiles)) proofFiles = [];
      } catch (parseErr) {
        console.error("Error parsing proof JSON:", parseErr);
      }
      const deleteProofPromises = proofFiles.map((fileName) => {
        const filePath = path.join(__dirname, "proofs", fileName);
        return new Promise((resolve) => {
          fs.unlink(filePath, (err) => {
            if (err)
              console.error(`Error deleting proof file ${fileName}:`, err);
            resolve();
          });
        });
      });
      await Promise.all(deleteProofPromises);
    }

    // Delete associated receipts and their image files.
    if (receipt_ids) {
      let receiptIDArr = [];
      try {
        receiptIDArr = JSON.parse(receipt_ids);
        if (!Array.isArray(receiptIDArr)) receiptIDArr = [];
      } catch (err) {
        receiptIDArr = [];
      }
      if (receiptIDArr.length > 0) {
        const deleteReceiptPromises = receiptIDArr.map((receiptId) => {
          return new Promise((resolve) => {
            // First, retrieve the receipt record to get its image filename.
            oms_db.query(
              "SELECT image FROM receipt WHERE id = ?",
              [receiptId],
              (selectErr, recResults) => {
                if (selectErr) {
                  console.error("Error selecting receipt:", selectErr);
                  return resolve();
                }
                if (recResults.length === 0) return resolve();
                const { image } = recResults[0];
                const imagePath = path.join(__dirname, "receipts", image);
                // Delete the image file.
                fs.unlink(imagePath, (unlinkErr) => {
                  if (unlinkErr && unlinkErr.code !== "ENOENT") {
                    console.error(
                      `Error deleting receipt image ${image}:`,
                      unlinkErr
                    );
                  }
                  // Now delete the receipt record.
                  oms_db.query(
                    "DELETE FROM receipt WHERE id = ?",
                    [receiptId],
                    (delErr) => {
                      if (delErr)
                        console.error("Error deleting receipt record:", delErr);
                      resolve();
                    }
                  );
                });
              }
            );
          });
        });
        await Promise.all(deleteReceiptPromises);
      }
    }

    // Now delete the expense record.
    const deleteResult = await new Promise((resolve, reject) => {
      oms_db.query("DELETE FROM expense WHERE id = ?", [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    if (deleteResult.affectedRows === 0) {
      return res
        .status(404)
        .json({ status: false, error: "Expense not found" });
    }

    // Update the record group count after deletion.
    updateRecordGroupCount(record_group_id, "Expense");

    return res.json({
      status: true,
      message: "Expense and associated receipts deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting expense:", err);
    return res
      .status(500)
      .json({ status: false, error: "Internal Server Error" });
  }
});

app.post("/fetch-receipts", (req, res) => {
  const { mode, searchTerm, year, startDate, endDate } = req.body;

  let sql = `
    SELECT 
      r.id,
      r.type,
      r.created_at,
      r.user_id,
      ua.full_name as issuer_name
    FROM receipt r
    LEFT JOIN user_account ua ON r.user_id = ua.id
  `;

  const conditions = [];
  const params = [];

  if (mode === "Search") {
    conditions.push("(CAST(r.id AS CHAR) LIKE ? OR ua.full_name LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern);
  } else if (mode === "Filter") {
    if (year) {
      conditions.push("YEAR(r.created_at) = ?");
      params.push(year);
    }
    if (startDate) {
      conditions.push("r.created_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("r.created_at <= ?");
      params.push(endDate);
    }
  } else if (mode === "Mixed") {
    conditions.push("(CAST(r.id AS CHAR) LIKE ? OR ua.full_name LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern);

    if (year) {
      conditions.push("YEAR(r.created_at) = ?");
      params.push(year);
    }
    if (startDate) {
      conditions.push("r.created_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("r.created_at <= ?");
      params.push(endDate);
    }
  }

  // Add WHERE clause if needed
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  sql += " ORDER BY r.id DESC";

  oms_db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching receipts:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    const data = results.map((receipt) => {
      receipt.created_at = formatDateTable(receipt.created_at);
      return receipt;
    });

    return res.json({ status: true, data });
  });
});

app.post("/create-budget", (req, res) => {
  const { user_data, name, description } = req.body;
  if (!name || !description) {
    return res
      .status(400)
      .json({ status: false, error: "All fields are required" });
  }

  const userObj = JSON.parse(user_data);
  const sql =
    "INSERT INTO budget (name, user_id, description) VALUES (?, ?, ?)";

  oms_db.query(sql, [name, userObj.id, description], (err, result) => {
    if (err) {
      console.error("Error creating budget:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    return res.json({ status: true, message: "Budget successfully created" });
  });
});

app.post("/fetch-draft-budgets", (req, res) => {
  const { mode, searchTerm, year, startDate, endDate } = req.body;

  // Base query: always restrict to budgets with status 'Draft' or 'Back to Draft'
  let sql = `
    SELECT 
      id, 
      name, 
      created_at, 
      amount, 
      status
    FROM budget
  `;

  let conditions = [];
  let params = [];

  // Mandatory condition for status
  conditions.push("status IN ('Draft', 'Back to Draft')");

  // Additional filtering based on mode
  if (mode === "Search") {
    conditions.push("(CAST(amount AS CHAR) LIKE ? OR name LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern);
  } else if (mode === "Filter") {
    conditions.push("YEAR(created_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("created_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("created_at <= ?");
      params.push(endDate);
    }
  } else if (mode === "Mixed") {
    conditions.push("(CAST(amount AS CHAR) LIKE ? OR name LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern);
    conditions.push("YEAR(created_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("created_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("created_at <= ?");
      params.push(endDate);
    }
  }

  // If any conditions exist, append them in the WHERE clause
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  // Order so that 'Back to Draft' comes first then 'Draft', and order by updated_at descending.
  sql += `
    ORDER BY 
      CASE status 
        WHEN 'Back to Draft' THEN 0 
        WHEN 'Draft' THEN 1 
        ELSE 2 
      END,
      updated_at DESC
  `;

  oms_db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching draft budgets:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    // Format created_at for each budget record if not null.
    const data = results.map((budget) => {
      if (budget.created_at !== null) {
        budget.created_at = formatDateTableNoTime(budget.created_at);
      }
      budget.amount = "₱ " + budget.amount;
      return budget;
    });

    return res.json({ status: true, data: data });
  });
});

app.post("/fetch-draft-budget-details", (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res
      .status(400)
      .json({ status: false, error: "Budget ID is required" });
  }

  const sql =
    "SELECT *, approved_at as approved_at_orig FROM budget WHERE id = ?";
  oms_db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching budget details:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ status: false, error: "Budget not found" });
    }

    const data = results.map((draftBudget) => {
      draftBudget.updated_at = formatDate(draftBudget.updated_at);
      draftBudget.created_at = formatDate(draftBudget.created_at);
      draftBudget.amount = "₱ " + draftBudget.amount;

      if (draftBudget.approved_at !== null) {
        draftBudget.approved_at = formatDate(draftBudget.approved_at);
      }

      if (draftBudget.published_at !== null) {
        draftBudget.published_at = formatDate(draftBudget.published_at);
      }

      return draftBudget;
    });

    return res.json({ status: true, data: data[0] });
  });
});

app.post("/update-draft-budget", (req, res) => {
  const {
    user_data,
    id,
    name,
    description,
    breakdown,
    amount,
    payments,
    status,
    include_payment,
    show_other_officers,
    request_message,
  } = req.body;

  if (
    !id ||
    !name ||
    !description ||
    !amount ||
    !breakdown ||
    !payments ||
    !status
  ) {
    return res
      .status(400)
      .json({ status: false, error: "All fields are required" });
  }

  const userObj = JSON.parse(user_data);

  if (status === "Sent for Approval") {
    // First create an approval record.
    const approvalName = "Approval for " + name;
    const approvalSql = `
      INSERT INTO approval (name, type, relating_id, request_message, user_id)
      VALUES (?, 'Budget', ?, ?, ?)
    `;
    oms_db.query(
      approvalSql,
      [approvalName, id, request_message, userObj.id],
      (approvalErr, approvalResult) => {
        if (approvalErr) {
          console.error("Error creating approval record:", approvalErr);
          return res
            .status(500)
            .json({ status: false, error: "Internal Server Error" });
        }
        const approval_id = approvalResult.insertId;
        // Now update the budget including the new approval_id.
        const sql = `
        UPDATE budget 
        SET name = ?, 
            description = ?, 
            breakdown = ?, 
            payments = ?, 
            amount = ?,
            status = ?, 
            include_payment = ${include_payment ? "1" : "0"},
            show_other_officers = 1,
            approval_id = ?
        WHERE id = ?
      `;
        oms_db.query(
          sql,
          [
            name,
            description,
            JSON.stringify(breakdown),
            JSON.stringify(payments),
            amount,
            status,
            approval_id,
            id,
          ],
          (err, result) => {
            if (err) {
              console.error("Error updating budget with approval:", err);
              return res
                .status(500)
                .json({ status: false, error: "Internal Server Error" });
            }
            if (result.affectedRows === 0) {
              return res
                .status(404)
                .json({ status: false, error: "Budget not found" });
            }
            // Fetch the updated budget
            const fetchSql = "SELECT * FROM budget WHERE id = ?";
            oms_db.query(fetchSql, [id], (fetchErr, fetchResults) => {
              if (fetchErr) {
                console.error("Error fetching updated budget:", fetchErr);
                return res
                  .status(500)
                  .json({ status: false, error: "Internal Server Error" });
              }
              const data = fetchResults.map((draftBudget) => {
                draftBudget.updated_at = formatDate(draftBudget.updated_at);
                draftBudget.created_at = formatDate(draftBudget.created_at);
                draftBudget.amount = "₱ " + draftBudget.amount;
                return draftBudget;
              });
              return res.json({ status: true, data: data[0] });
            });
          }
        );
      }
    );
  } else {
    // Normal update without creating an approval record.
    const sql = `
      UPDATE budget 
      SET name = ?, 
          description = ?, 
          breakdown = ?, 
          payments = ?, 
          amount = ?,
          status = ?, 
          include_payment = ${include_payment ? "1" : "0"},
          show_other_officers = ${show_other_officers ? "1" : "0"}
      WHERE id = ?
    `;
    oms_db.query(
      sql,
      [
        name,
        description,
        JSON.stringify(breakdown),
        JSON.stringify(payments),
        amount,
        status,
        id,
      ],
      (err, result) => {
        if (err) {
          console.error("Error updating budget:", err);
          return res
            .status(500)
            .json({ status: false, error: "Internal Server Error" });
        }
        if (result.affectedRows === 0) {
          return res
            .status(404)
            .json({ status: false, error: "Budget not found" });
        }
        const fetchSql = "SELECT * FROM budget WHERE id = ?";
        oms_db.query(fetchSql, [id], (fetchErr, fetchResults) => {
          if (fetchErr) {
            console.error("Error fetching updated budget:", fetchErr);
            return res
              .status(500)
              .json({ status: false, error: "Internal Server Error" });
          }
          const data = fetchResults.map((draftBudget) => {
            draftBudget.updated_at = formatDate(draftBudget.updated_at);
            draftBudget.created_at = formatDate(draftBudget.created_at);
            draftBudget.amount = "₱ " + draftBudget.amount;
            return draftBudget;
          });
          return res.json({ status: true, data: data[0] });
        });
      }
    );
  }
});

app.post("/fetch-pending-budget-approvals", (req, res) => {
  const { mode, searchTerm, year, startDate, endDate } = req.body;

  // Base query: always restrict to budgets with status 'Draft' or 'Back to Draft'
  let sql = `
    SELECT 
      id, 
      name, 
      created_at, 
      amount, 
      status
    FROM budget
  `;

  let conditions = [];
  let params = [];

  // Mandatory condition for status
  conditions.push("status IN ('Sent for Approval', 'Ready to Publish')");

  // Additional filtering based on mode
  if (mode === "Search") {
    conditions.push("(CAST(amount AS CHAR) LIKE ? OR name LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern);
  } else if (mode === "Filter") {
    conditions.push("YEAR(created_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("created_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("created_at <= ?");
      params.push(endDate);
    }
  } else if (mode === "Mixed") {
    conditions.push("(CAST(amount AS CHAR) LIKE ? OR name LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern);
    conditions.push("YEAR(created_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("created_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("created_at <= ?");
      params.push(endDate);
    }
  }

  // If any conditions exist, append them in the WHERE clause
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  // Order so that 'Back to Draft' comes first then 'Draft', and order by updated_at descending.
  sql += `
    ORDER BY 
      CASE status 
        WHEN 'Ready to Publish' THEN 0 
        WHEN 'Sent for Approval' THEN 1 
        ELSE 2 
      END,
      updated_at DESC
  `;

  oms_db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching pending budget approvals:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    // Format created_at for each budget record if not null.
    const data = results.map((budget) => {
      budget.created_at = formatDateTableNoTime(budget.created_at);
      budget.amount = "₱ " + budget.amount;
      return budget;
    });

    return res.json({ status: true, data: data });
  });
});

app.post("/fetch-published-budgets", (req, res) => {
  const { mode, searchTerm, year, startDate, endDate } = req.body;

  // Base query: always restrict to budgets with status 'Draft' or 'Back to Draft'
  let sql = "SELECT id, name, published_at, amount FROM budget";

  let conditions = [];
  let params = [];

  // Mandatory condition for status
  conditions.push("status = 'Published'");

  // Additional filtering based on mode
  if (mode === "Search") {
    conditions.push("(CAST(amount AS CHAR) LIKE ? OR name LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern);
  } else if (mode === "Filter") {
    conditions.push("YEAR(published_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("published_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("published_at <= ?");
      params.push(endDate);
    }
  } else if (mode === "Mixed") {
    conditions.push("(CAST(amount AS CHAR) LIKE ? OR name LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern);
    conditions.push("YEAR(published_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("published_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("published_at <= ?");
      params.push(endDate);
    }
  }

  // If any conditions exist, append them in the WHERE clause
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  // Order so that 'Back to Draft' comes first then 'Draft', and order by updated_at descending.
  sql += `
    ORDER BY published_at DESC
  `;

  oms_db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching draft budgets:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    // Format created_at for each budget record if not null.
    const data = results.map((budget) => {
      budget.published_at = formatDateTableNoTime(budget.published_at);
      budget.amount = "₱ " + budget.amount;
      return budget;
    });

    return res.json({ status: true, data: data });
  });
});

app.post("/cancel-budget-approval", (req, res) => {
  const { id, approval_id, user_data } = req.body;
  if (!id || !approval_id || !user_data) {
    return res
      .status(400)
      .json({ status: false, error: "Missing required fields" });
  }

  let userObj;
  try {
    userObj = JSON.parse(user_data);
  } catch (err) {
    return res.status(400).json({ status: false, error: "Invalid user data" });
  }

  const decision_message = `Cancelled by ${userObj.full_name} - (${userObj.student_id}) ${userObj.designation}`;

  // First update the approval record
  const updateApprovalSql = `
    UPDATE approval 
    SET decision_message = ?, decision = 'Cancelled' 
    WHERE id = ?
  `;
  oms_db.query(
    updateApprovalSql,
    [decision_message, approval_id],
    (err, approvalResult) => {
      if (err) {
        console.error("Error updating approval record:", err);
        return res
          .status(500)
          .json({ status: false, error: "Internal Server Error" });
      }
      // Then update the budget record
      const updateBudgetSql = `
      UPDATE budget 
      SET status = 'Back to Draft', 
          show_other_officers = 0, 
          approval_id = NULL 
      WHERE id = ?
    `;
      // Ensure past_approval_id is stored as JSON (if needed)
      oms_db.query(updateBudgetSql, [id], (err, budgetResult) => {
        if (err) {
          console.error("Error updating budget record:", err);
          return res
            .status(500)
            .json({ status: false, error: "Internal Server Error" });
        }
        return res.json({
          status: true,
          message: "Budget approval cancelled successfully",
        });
      });
    }
  );
});

app.post("/fetch-approval-history", (req, res) => {
  const { type, relating_id } = req.body;
  if (!type || !relating_id) {
    return res
      .status(400)
      .json({ status: false, error: "Missing required fields" });
  }

  const sql = `
    SELECT 
      id,
      decision
    FROM approval 
    WHERE type = ? AND relating_id = ?
    ORDER BY created_at DESC
  `;

  oms_db.query(sql, [type, relating_id], (err, results) => {
    if (err) {
      console.error("Error fetching approval history:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    return res.json({ status: true, data: results });
  });
});

app.post("/fetch-approval-details", (req, res) => {
  const { approval_id } = req.body;
  if (!approval_id) {
    return res
      .status(400)
      .json({ status: false, error: "Approval ID is required" });
  }
  const sql = `
    SELECT 
      a.id,
      a.user_id,
      a.created_at,
      a.updated_at,
      a.name,
      a.type,
      a.relating_id,
      a.request_message,
      a.decision_message,
      a.decision,
      ua.full_name,
      ua.designation
    FROM approval a
    LEFT JOIN user_account ua ON a.user_id = ua.id
    WHERE a.id = ?
  `;
  oms_db.query(sql, [approval_id], (err, results) => {
    if (err) {
      console.error("Error fetching approval details:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    if (results.length === 0) {
      return res
        .status(404)
        .json({ status: false, error: "Approval not found" });
    }

    const data = results.map((approval) => {
      approval.created_at = formatDate(approval.created_at);
      approval.updated_at = formatDate(approval.updated_at);
      return approval;
    });

    return res.json({ status: true, data: data[0] });
  });
});

app.post("/fetch-budget-approvals", (req, res) => {
  const { mode, searchTerm, year, startDate, endDate } = req.body;

  // Base query: always restrict to budgets with status 'Draft' or 'Back to Draft'
  let sql = `
    SELECT 
      id, 
      name, 
      created_at, 
      name, 
      relating_id,
      decision
    FROM approval
  `;

  let conditions = [];
  let params = [];

  // Mandatory condition for status
  conditions.push("type IN ('Budget')");
  conditions.push("decision IS NULL");

  // Additional filtering based on mode
  if (mode === "Search") {
    conditions.push("name LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern);
  } else if (mode === "Filter") {
    conditions.push("YEAR(created_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("created_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("created_at <= ?");
      params.push(endDate);
    }
  } else if (mode === "Mixed") {
    conditions.push("name LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern);
    conditions.push("YEAR(created_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("created_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("created_at <= ?");
      params.push(endDate);
    }
  }

  // If any conditions exist, append them in the WHERE clause
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  // Order so that 'Back to Draft' comes first then 'Draft', and order by updated_at descending.
  sql += `
    ORDER BY created_at DESC
  `;

  oms_db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching draft budgets:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    // Format created_at for each budget record if not null.
    const data = results.map((budgetApprovals) => {
      budgetApprovals.created_at = formatDateTableNoTime(
        budgetApprovals.created_at
      );
      budgetApprovals.relating_id =
        "Budget ID - " + budgetApprovals.relating_id;
      return budgetApprovals;
    });

    return res.json({ status: true, data: data });
  });
});

app.post("/fetch-payment-approvals", (req, res) => {
  const { mode, searchTerm, year, startDate, endDate } = req.body;

  // Base query: always restrict to budgets with status 'Draft' or 'Back to Draft'
  let sql = `
    SELECT 
      id, 
      name, 
      created_at, 
      name, 
      relating_id,
      decision
    FROM approval
  `;

  let conditions = [];
  let params = [];

  // Mandatory condition for status
  conditions.push("type IN ('Payment')");
  conditions.push("decision IS NULL");

  // Additional filtering based on mode
  if (mode === "Search") {
    conditions.push("(name LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern);
  } else if (mode === "Filter") {
    conditions.push("YEAR(created_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("created_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("created_at <= ?");
      params.push(endDate);
    }
  } else if (mode === "Mixed") {
    conditions.push("(name LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern);
    conditions.push("YEAR(created_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("created_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("created_at <= ?");
      params.push(endDate);
    }
  }

  // If any conditions exist, append them in the WHERE clause
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  // Order so that 'Back to Draft' comes first then 'Draft', and order by updated_at descending.
  sql += `
    ORDER BY created_at DESC
  `;

  oms_db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching draft budgets:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    // Format created_at for each payment record if not null.
    const data = results.map((paymentApprovals) => {
      paymentApprovals.created_at = formatDateTableNoTime(
        paymentApprovals.created_at
      );
      paymentApprovals.relating_id =
        "Payment ID - " + paymentApprovals.relating_id;
      return paymentApprovals;
    });

    return res.json({ status: true, data: data });
  });
});

app.post("/fetch-announcement-approvals", (req, res) => {
  const { mode, searchTerm, year, startDate, endDate } = req.body;

  // Base query: always restrict to budgets with status 'Draft' or 'Back to Draft'
  let sql = `
    SELECT 
      id, 
      name, 
      created_at, 
      name, 
      relating_id,
      decision
    FROM approval
  `;

  let conditions = [];
  let params = [];

  // Mandatory condition for status
  conditions.push("type IN ('Announment')");
  conditions.push("decision IS NULL");

  // Additional filtering based on mode
  if (mode === "Search") {
    conditions.push("(name LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern);
  } else if (mode === "Filter") {
    conditions.push("YEAR(created_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("created_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("created_at <= ?");
      params.push(endDate);
    }
  } else if (mode === "Mixed") {
    conditions.push("(name LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern);
    conditions.push("YEAR(created_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("created_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("created_at <= ?");
      params.push(endDate);
    }
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  sql += `
    ORDER BY created_at DESC
  `;

  oms_db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching draft budgets:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    // Format created_at for each announment record if not null.
    const data = results.map((announmentApprovals) => {
      announmentApprovals.created_at = formatDateTableNoTime(
        paymentApprovals.created_at
      );
      announmentApprovals.relating_id =
        "Announment ID - " + announmentApprovals.relating_id;
      return announmentApprovals;
    });

    return res.json({ status: true, data: data });
  });
});

app.post("/fetch-event-approvals", (req, res) => {
  const { mode, searchTerm, year, startDate, endDate } = req.body;

  // Base query: fetch event approvals with pending decision
  let sql = `
    SELECT 
      id, 
      name, 
      created_at, 
      relating_id,
      decision
    FROM approval
  `;

  let conditions = [];
  let params = [];

  // Mandatory condition for status
  conditions.push("type IN ('Event')");
  conditions.push("decision IS NULL");

  // Additional filtering based on mode
  if (mode === "Search") {
    conditions.push("(name LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern);
  } else if (mode === "Filter") {
    conditions.push("YEAR(created_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("created_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("created_at <= ?");
      params.push(endDate);
    }
  } else if (mode === "Mixed") {
    conditions.push("(name LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern);
    conditions.push("YEAR(created_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("created_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("created_at <= ?");
      params.push(endDate);
    }
  }

  // If any conditions exist, append them in the WHERE clause
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  // Order by created_at descending
  sql += `
    ORDER BY created_at DESC
  `;

  oms_db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching event approvals:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    // Format created_at for each event record if not null.
    const data = results.map((eventApprovals) => {
      eventApprovals.created_at = formatDateTableNoTime(
        eventApprovals.created_at
      );
      eventApprovals.relating_id = "Event ID - " + eventApprovals.relating_id;
      return eventApprovals;
    });

    return res.json({ status: true, data: data });
  });
});

app.post("/fetch-decided-approvals", (req, res) => {
  const { mode, searchTerm, year, startDate, endDate } = req.body;

  // Base query: always restrict to budgets with status 'Draft' or 'Back to Draft'
  let sql = `
    SELECT 
      id, 
      name, 
      updated_at, 
      name, 
      type,
      relating_id,
      decision
    FROM approval
  `;

  let conditions = [];
  let params = [];

  // Mandatory condition for status
  conditions.push("decision IS NOT NULL");

  // Additional filtering based on mode
  if (mode === "Search") {
    conditions.push("name LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern);
  } else if (mode === "Filter") {
    conditions.push("YEAR(updated_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("updated_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("updated_at <= ?");
      params.push(endDate);
    }
  } else if (mode === "Mixed") {
    conditions.push("(name LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern);
    conditions.push("YEAR(updated_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("updated_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("updated_at <= ?");
      params.push(endDate);
    }
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  sql += `
    ORDER BY updated_at DESC
  `;

  oms_db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching draft budgets:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    const data = results.map((decidedApprovals) => {
      decidedApprovals.updated_at = formatDateTableNoTime(
        decidedApprovals.updated_at
      );
      if (decidedApprovals.type === "Budget") {
        decidedApprovals.relating_id =
          "Budget ID - " + decidedApprovals.relating_id;
      } else if (decidedApprovals.type === "Payment") {
        decidedApprovals.relating_id =
          "Payment ID - " + decidedApprovals.relating_id;
      } else if (decidedApprovals.type === "Event") {
        decidedApprovals.relating_id =
          "Event ID - " + decidedApprovals.relating_id;
      }

      return decidedApprovals;
    });

    return res.json({ status: true, data: data });
  });
});

app.post("/budget-approval-decision", (req, res) => {
  const { approval_id, decision_message, decision, id } = req.body;
  if (!approval_id || !decision_message || !decision || !id) {
    return res
      .status(400)
      .json({ status: false, error: "Missing required fields" });
  }

  // First, update the approval record with the decision and decision_message
  const updateApprovalSql = `
    UPDATE approval 
    SET decision_message = ?, decision = ?
    WHERE id = ?
  `;
  oms_db.query(
    updateApprovalSql,
    [decision_message, decision, approval_id],
    (err, result) => {
      if (err) {
        console.error("Error updating approval record:", err);
        return res
          .status(500)
          .json({ status: false, error: "Internal Server Error" });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ status: false, error: "Approval record not found" });
      }

      // Determine the new status for the budget record based on the decision
      let newStatus = "";
      if (decision === "Approved") {
        newStatus = "Ready to Publish";
      } else if (decision === "Disapproved") {
        newStatus = "Back to Draft";
      } else {
        return res
          .status(400)
          .json({ status: false, error: "Invalid decision value" });
      }

      // Set the approval_id update value: null if disapproved, otherwise leave unchanged (approval_id)
      const approvalIdUpdate = decision === "Disapproved" ? null : approval_id;

      // Update the corresponding budget record where id matches the provided id
      const updateBudgetSql = `
        UPDATE budget 
        SET status = ?, approved_at = NOW(), approval_id = ?
        WHERE id = ?
      `;
      oms_db.query(
        updateBudgetSql,
        [newStatus, approvalIdUpdate, id],
        (err2, budgetResult) => {
          if (err2) {
            console.error("Error updating budget record:", err2);
            return res
              .status(500)
              .json({ status: false, error: "Internal Server Error" });
          }
          if (budgetResult.affectedRows === 0) {
            return res
              .status(404)
              .json({ status: false, error: "Budget record not found" });
          }
          return res.json({
            status: true,
            message: "Decision submitted and budget updated successfully",
          });
        }
      );
    }
  );
});

app.post("/publish-budget", (req, res) => {
  const { id, approval_id, payments, approved_at, user_data, include_payment } =
    req.body;

  if (
    !id ||
    !approval_id ||
    !payments ||
    !Array.isArray(payments) ||
    !user_data
  ) {
    return res
      .status(400)
      .json({ status: false, error: "Missing required fields" });
  }

  let userObj;
  try {
    userObj = JSON.parse(user_data);
  } catch (err) {
    return res.status(400).json({ status: false, error: "Invalid user_data" });
  }

  // Function to insert a single payment record

  const insertPayment = (payment) => {
    if (include_payment) {
      return new Promise((resolve, reject) => {
        const sql = `
          INSERT INTO payment 
            (status, name, amount, description, due_date, approved_at, issued_at, budget_id, approval_id, user_id)
          VALUES 
            ('Issued', ?, ?, ?, ?, ?, NOW(), ?, ?, ?)
        `;
        const params = [
          payment.paymentName, // payment name
          payment.amount, // amount
          payment.description, // description
          payment.dueDate, // due date
          approved_at, // approved_at provided in the request
          id, // budget_id from request
          approval_id, // approval record id
          userObj.id, // user_id from parsed user_data
        ];
        oms_db.query(sql, params, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result.insertId);
        });
      });
    }
  };

  // Insert all payments and collect their inserted IDs.
  Promise.all(payments.map(insertPayment))
    .then((paymentIds) => {
      const updateBudgetSql = `
        UPDATE budget 
        SET published_at = NOW(), payment_ids = ?, status = 'Published', show_other_officers = 0
        WHERE id = ?
      `;
      oms_db.query(
        updateBudgetSql,
        [JSON.stringify(paymentIds), id],
        (err, result) => {
          if (err) {
            console.error("Error updating budget:", err);
            return res
              .status(500)
              .json({ status: false, error: "Internal Server Error" });
          }
          if (result.affectedRows === 0) {
            return res
              .status(404)
              .json({ status: false, error: "Budget not found" });
          }
          return res.json({
            status: true,
            message: "Budget published successfully",
            paymentIds: paymentIds,
          });
        }
      );
    })
    .catch((err) => {
      console.error("Error inserting payments:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    });
});

app.post("/delete-draft-budget", (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res
      .status(400)
      .json({ status: false, error: "Budget ID is required" });
  }

  // Optionally, fetch the budget details first (for logging or further deletion of related data)
  const selectSql = "SELECT id, payments FROM budget WHERE id = ?";
  oms_db.query(selectSql, [id], (selectErr, selectResults) => {
    if (selectErr) {
      console.error("Error selecting draft budget:", selectErr);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    if (selectResults.length === 0) {
      return res
        .status(404)
        .json({ status: false, error: "Draft budget not found" });
    }

    // Delete the draft budget record from the budget table
    const deleteSql = "DELETE FROM budget WHERE id = ?";
    oms_db.query(deleteSql, [id], (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error("Error deleting draft budget:", deleteErr);
        return res
          .status(500)
          .json({ status: false, error: "Internal Server Error" });
      }
      if (deleteResult.affectedRows === 0) {
        return res
          .status(404)
          .json({ status: false, error: "Draft budget not found" });
      }
      return res.json({
        status: true,
        message: "Draft budget deleted successfully",
      });
    });
  });
});

app.post("/fetch-planned-budgets", (req, res) => {
  const { mode, searchTerm, year, startDate, endDate } = req.body;

  // Base query: always restrict to budgets with status 'Draft' or 'Back to Draft'
  let sql = `
    SELECT 
      id, 
      name, 
      updated_at, 
      amount, 
      status
    FROM budget
  `;

  let conditions = [];
  let params = [];

  // Mandatory condition for status
  conditions.push("show_other_officers = 1");

  // Additional filtering based on mode
  if (mode === "Search") {
    conditions.push("(CAST(amount AS CHAR) LIKE ? OR name LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern);
  } else if (mode === "Filter") {
    conditions.push("YEAR(updated_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("updated_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("updated_at <= ?");
      params.push(endDate);
    }
  } else if (mode === "Mixed") {
    conditions.push("(CAST(amount AS CHAR) LIKE ? OR name LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern);
    conditions.push("YEAR(updated_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("updated_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("updated_at <= ?");
      params.push(endDate);
    }
  }

  // If any conditions exist, append them in the WHERE clause
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  // Order so that 'Back to Draft' comes first then 'Draft', and order by updated_at descending.
  sql += `
    ORDER BY 
      CASE status 
        WHEN 'Ready to Publish' THEN 0 
        WHEN 'Sent for Approval' THEN 1 
        WHEN 'Back to Draft' THEN 2
        WHEN 'Draft' THEN 3
        ELSE 4
      END,
      updated_at DESC
  `;

  oms_db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching draft budgets:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    // Format created_at for each budget record if not null.
    const data = results.map((budget) => {
      if (budget.updated_at !== null) {
        budget.updated_at = formatDateTableNoTime(budget.updated_at);
      }
      budget.amount = "₱ " + budget.amount;
      return budget;
    });

    return res.json({ status: true, data: data });
  });
});

app.post("/fetch-draft-payments", (req, res) => {
  const { mode, searchTerm, year, startDate, endDate } = req.body;

  // Base query: always restrict to budgets with status 'Draft' or 'Back to Draft'
  let sql = `
    SELECT 
      id, 
      name, 
      created_at, 
      amount, 
      status
    FROM payment
  `;

  let conditions = [];
  let params = [];

  // Mandatory condition for status
  conditions.push(
    "status IN ('Draft', 'Back to Draft', 'Sent for Approval', 'Ready to Issue')"
  );

  // Additional filtering based on mode
  if (mode === "Search") {
    conditions.push("(CAST(amount AS CHAR) LIKE ? OR name LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern);
  } else if (mode === "Filter") {
    conditions.push("YEAR(updated_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("updated_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("updated_at <= ?");
      params.push(endDate);
    }
  } else if (mode === "Mixed") {
    conditions.push("(CAST(amount AS CHAR) LIKE ? OR name LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern);
    conditions.push("YEAR(updated_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("updated_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("updated_at <= ?");
      params.push(endDate);
    }
  }

  // If any conditions exist, append them in the WHERE clause
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  // Order so that 'Back to Draft' comes first then 'Draft', and order by updated_at descending.
  sql += `
    ORDER BY 
      CASE status 
        WHEN 'Ready to Issue' THEN 0 
        WHEN 'Sent for Approval' THEN 1 
        WHEN 'Back to Draft' THEN 2
        WHEN 'Draft' THEN 3
        ELSE 4
      END,
      updated_at DESC
  `;

  oms_db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching draft budgets:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    // Format created_at for each budget record if not null.
    const data = results.map((budget) => {
      budget.created_at = formatDateTableNoTime(budget.created_at);
      budget.amount = "₱ " + budget.amount;
      return budget;
    });

    return res.json({ status: true, data: data });
  });
});

app.post("/fetch-issued-payments", (req, res) => {
  const { mode, searchTerm, year, startDate, endDate } = req.body;

  // Base query: always restrict to budgets with status 'Draft' or 'Back to Draft'
  let sql = "SELECT id, name, issued_at, amount FROM payment";

  let conditions = [];
  let params = [];

  // Mandatory condition for status
  conditions.push("status = 'Issued'");

  // Additional filtering based on mode
  if (mode === "Search") {
    conditions.push("(CAST(amount AS CHAR) LIKE ? OR name LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern);
  } else if (mode === "Filter") {
    conditions.push("YEAR(issued_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("issued_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("issued_at <= ?");
      params.push(endDate);
    }
  } else if (mode === "Mixed") {
    conditions.push("(CAST(amount AS CHAR) LIKE ? OR name LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern);
    conditions.push("YEAR(issued_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("issued_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("issued_at <= ?");
      params.push(endDate);
    }
  }

  // If any conditions exist, append them in the WHERE clause
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  // Order so that 'Back to Draft' comes first then 'Draft', and order by updated_at descending.
  sql += `
    ORDER BY issued_at DESC
  `;

  oms_db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching published payment:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    // Format created_at for each budget record if not null.
    const data = results.map((payment) => {
      payment.issued_at = formatDateTableNoTime(payment.issued_at);
      payment.amount = "₱ " + payment.amount;
      return payment;
    });

    return res.json({ status: true, data: data });
  });
});

// Route to check if a payment with the given name already exists
app.post("/check-payment-exist", (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res
      .status(400)
      .json({ status: false, error: "Payment name is required" });
  }
  const sql = "SELECT id FROM payment WHERE name = ? LIMIT 1";
  oms_db.query(sql, [name], (err, results) => {
    if (err) {
      console.error("Error checking payment exist:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    return res.json({ exists: results.length > 0 });
  });
});

// Route to create a new payment record (as Draft)
app.post("/create-payment", (req, res) => {
  const { user_data, name, description } = req.body;
  if (!user_data || !name || !description) {
    return res
      .status(400)
      .json({ status: false, error: "Missing required fields" });
  }

  let userObj;
  try {
    userObj = JSON.parse(user_data);
  } catch (err) {
    return res.status(400).json({ status: false, error: "Invalid user data" });
  }

  // Insert a new payment record with status 'Draft'
  const sql = `
    INSERT INTO payment (user_id, name, description, status)
    VALUES (?, ?, ?, 'Draft')
  `;
  oms_db.query(sql, [userObj.id, name, description], (err, result) => {
    if (err) {
      console.error("Error creating payment:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    return res.json({
      status: true,
      id: result.insertId,
      message: "Payment created successfully",
    });
  });
});

app.post("/fetch-payment-details", (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res
      .status(400)
      .json({ status: false, error: "Payment ID is required" });
  }
  const sql = "SELECT * FROM payment WHERE id = ?";
  oms_db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching payment details:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    if (results.length === 0) {
      return res
        .status(404)
        .json({ status: false, error: "Payment not found" });
    }
    const data = results.map((draftBudget) => {
      draftBudget.updated_at = formatDate(draftBudget.updated_at);
      draftBudget.created_at = formatDate(draftBudget.created_at);
      draftBudget.amount = "₱ " + draftBudget.amount;

      if (draftBudget.approved_at !== null) {
        draftBudget.approved_at = formatDate(draftBudget.approved_at);
      }

      if (draftBudget.published_at !== null) {
        draftBudget.published_at = formatDate(draftBudget.published_at);
      }

      return draftBudget;
    });

    return res.json({ status: true, data: data[0] });
  });
});

app.post("/update-payment", (req, res) => {
  const {
    user_data,
    id,
    name,
    description,
    amount,
    due_date,
    status,
    request_message,
  } = req.body;
  if (status === "Sent for Approval") {
    if (!id || !name || !description || !amount || !due_date) {
      return res
        .status(400)
        .json({ status: false, error: "All fields are required" });
    }
  }

  let userObj;
  try {
    userObj = JSON.parse(user_data);
  } catch (err) {
    return res.status(400).json({ status: false, error: "Invalid user data" });
  }

  if (status === "Sent for Approval") {
    // Create an approval record for the payment.
    const approvalName = "Approval for Payment: " + name;
    const approvalSql = `
      INSERT INTO approval (name, type, relating_id, request_message, user_id)
      VALUES (?, 'Payment', ?, ?, ?)
    `;
    oms_db.query(
      approvalSql,
      [approvalName, id, request_message, userObj.id],
      (approvalErr, approvalResult) => {
        if (approvalErr) {
          console.error("Error creating payment approval record:", approvalErr);
          return res
            .status(500)
            .json({ status: false, error: "Internal Server Error" });
        }
        const approval_id = approvalResult.insertId;
        // Now update the payment record including the approval_id.
        const sql = `
          UPDATE payment
          SET name = ?, 
              description = ?, 
              amount = ?,
              due_date = ?,
              status = ?,
              approval_id = ?
          WHERE id = ?
        `;
        oms_db.query(
          sql,
          [name, description, amount, due_date, status, approval_id, id],
          (err, result) => {
            if (err) {
              console.error("Error updating payment with approval:", err);
              return res
                .status(500)
                .json({ status: false, error: "Internal Server Error" });
            }
            if (result.affectedRows === 0) {
              return res
                .status(404)
                .json({ status: false, error: "Payment not found" });
            }
            // Fetch the updated payment record.
            const fetchSql = "SELECT * FROM payment WHERE id = ?";
            oms_db.query(fetchSql, [id], (fetchErr, fetchResults) => {
              if (fetchErr) {
                console.error("Error fetching updated payment:", fetchErr);
                return res
                  .status(500)
                  .json({ status: false, error: "Internal Server Error" });
              }
              return res.json({ status: true, data: fetchResults[0] });
            });
          }
        );
      }
    );
  } else {
    // Normal update without creating an approval record.
    const sql = `
      UPDATE payment
      SET name = ?, 
          description = ?, 
          amount = ?,
          due_date = ?,
          status = ?
      WHERE id = ?
    `;
    oms_db.query(
      sql,
      [name, description, amount, due_date, status, id],
      (err, result) => {
        if (err) {
          console.error("Error updating payment:", err);
          return res
            .status(500)
            .json({ status: false, error: "Internal Server Error" });
        }
        if (result.affectedRows === 0) {
          return res
            .status(404)
            .json({ status: false, error: "Payment not found" });
        }
        const fetchSql = "SELECT * FROM payment WHERE id = ?";
        oms_db.query(fetchSql, [id], (fetchErr, fetchResults) => {
          if (fetchErr) {
            console.error("Error fetching updated payment:", fetchErr);
            return res
              .status(500)
              .json({ status: false, error: "Internal Server Error" });
          }
          return res.json({ status: true, data: fetchResults[0] });
        });
      }
    );
  }
});

app.post("/cancel-payment-approval", (req, res) => {
  const { id, approval_id, user_data } = req.body;
  if (!id || !approval_id || !user_data) {
    return res
      .status(400)
      .json({ status: false, error: "Missing required fields" });
  }

  let userObj;
  try {
    userObj = JSON.parse(user_data);
  } catch (err) {
    return res.status(400).json({ status: false, error: "Invalid user data" });
  }

  const decision_message = `Cancelled by ${userObj.full_name} - (${userObj.student_id}) ${userObj.designation}`;

  // First update the approval record
  const updateApprovalSql = `
    UPDATE approval 
    SET decision_message = ?, decision = 'Cancelled' 
    WHERE id = ?
  `;
  oms_db.query(
    updateApprovalSql,
    [decision_message, approval_id],
    (err, approvalResult) => {
      if (err) {
        console.error("Error updating approval record:", err);
        return res
          .status(500)
          .json({ status: false, error: "Internal Server Error" });
      }
      // Then update the payment record: revert status to draft and clear approval_id.
      const updatePaymentSql = `
        UPDATE payment 
        SET status = 'Back to Draft', 
            approval_id = NULL 
        WHERE id = ?
      `;
      oms_db.query(updatePaymentSql, [id], (err, paymentResult) => {
        if (err) {
          console.error("Error updating payment record:", err);
          return res
            .status(500)
            .json({ status: false, error: "Internal Server Error" });
        }
        return res.json({
          status: true,
          message: "Payment approval cancelled successfully",
        });
      });
    }
  );
});

app.post("/payment-approval-decision", (req, res) => {
  const { approval_id, decision_message, decision, id } = req.body;
  if (!approval_id || !decision_message || !decision || !id) {
    return res
      .status(400)
      .json({ status: false, error: "Missing required fields" });
  }

  // First, update the approval record with the decision and decision_message
  const updateApprovalSql = `
    UPDATE approval 
    SET decision_message = ?, decision = ?
    WHERE id = ?
  `;
  oms_db.query(
    updateApprovalSql,
    [decision_message, decision, approval_id],
    (err, result) => {
      if (err) {
        console.error("Error updating approval record:", err);
        return res
          .status(500)
          .json({ status: false, error: "Internal Server Error" });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ status: false, error: "Approval record not found" });
      }

      // Determine the new status for the payment record based on the decision
      let newStatus = "";
      if (decision === "Approved") {
        newStatus = "Ready to Issue";
      } else if (decision === "Disapproved") {
        newStatus = "Back to Draft";
      } else {
        return res
          .status(400)
          .json({ status: false, error: "Invalid decision value" });
      }

      // Set the approval_id update value: null if disapproved, otherwise leave unchanged (approval_id)
      const approvalIdUpdate = decision === "Disapproved" ? null : approval_id;

      // Update the corresponding payment record where id matches the provided id
      const updatePaymentSql = `
        UPDATE payment 
        SET status = ?, approved_at = NOW(), approval_id = ?
        WHERE id = ?
      `;
      oms_db.query(
        updatePaymentSql,
        [newStatus, approvalIdUpdate, id],
        (err2, paymentResult) => {
          if (err2) {
            console.error("Error updating payment record:", err2);
            return res
              .status(500)
              .json({ status: false, error: "Internal Server Error" });
          }
          if (paymentResult.affectedRows === 0) {
            return res
              .status(404)
              .json({ status: false, error: "Payment record not found" });
          }
          return res.json({
            status: true,
            message: "Decision submitted and payment updated successfully",
          });
        }
      );
    }
  );
});

app.post("/issue-payment", (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res
      .status(400)
      .json({ status: false, error: "Payment ID is required" });
  }

  const sql = `
    UPDATE payment 
    SET issued_at = NOW(),
        status = 'Issued'
    WHERE id = ?
  `;
  oms_db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error issuing payment:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ status: false, error: "Payment not found" });
    }
    return res.json({ status: true, message: "Payment issued successfully" });
  });
});

app.post("/delete-draft-payment", (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res
      .status(400)
      .json({ status: false, error: "Payment ID is required" });
  }

  // First, check if the draft payment exists
  const selectSql =
    "SELECT id FROM payment WHERE id = ? AND status IN ('Draft', 'Back to Draft')";
  oms_db.query(selectSql, [id], (selectErr, selectResults) => {
    if (selectErr) {
      console.error("Error selecting draft payment:", selectErr);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    if (selectResults.length === 0) {
      return res
        .status(404)
        .json({ status: false, error: "Draft payment not found" });
    }

    // Delete the draft payment record from the payment table
    const deleteSql = "DELETE FROM payment WHERE id = ?";
    oms_db.query(deleteSql, [id], (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error("Error deleting draft payment:", deleteErr);
        return res
          .status(500)
          .json({ status: false, error: "Internal Server Error" });
      }
      if (deleteResult.affectedRows === 0) {
        return res
          .status(404)
          .json({ status: false, error: "Draft payment not found" });
      }
      return res.json({
        status: true,
        message: "Draft payment deleted successfully",
      });
    });
  });
});

app.post("/event-approval-decision", (req, res) => {
  const { approval_id, decision_message, decision, id } = req.body;
  if (!approval_id || !decision_message || !decision || !id) {
    return res
      .status(400)
      .json({ status: false, error: "Missing required fields" });
  }

  // First, update the approval record with the decision and decision_message
  const updateApprovalSql = `
    UPDATE approval 
    SET decision_message = ?, decision = ?
    WHERE id = ?
  `;
  oms_db.query(
    updateApprovalSql,
    [decision_message, decision, approval_id],
    (err, result) => {
      if (err) {
        console.error("Error updating approval record:", err);
        return res
          .status(500)
          .json({ status: false, error: "Internal Server Error" });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ status: false, error: "Approval record not found" });
      }

      // Determine the new status for the event record based on the decision
      let newStatus = "";
      if (decision === "Approved") {
        newStatus = "Ready to Publish";
      } else if (decision === "Disapproved") {
        newStatus = "Back To Draft";
      } else {
        return res
          .status(400)
          .json({ status: false, error: "Invalid decision value" });
      }

      // Set the approval_id update value: null if disapproved, otherwise leave unchanged (approval_id)
      const approvalIdUpdate = decision === "Disapproved" ? null : approval_id;

      // Update the corresponding event record where id matches the provided id
      const updateEventSql = `
        UPDATE event 
        SET status = ?, approved_at = NOW(), approval_id = ?
        WHERE id = ?
      `;
      oms_db.query(
        updateEventSql,
        [newStatus, approvalIdUpdate, id],
        (err2, eventResult) => {
          if (err2) {
            console.error("Error updating event record:", err2);
            return res
              .status(500)
              .json({ status: false, error: "Internal Server Error" });
          }
          if (eventResult.affectedRows === 0) {
            return res
              .status(404)
              .json({ status: false, error: "Event record not found" });
          }
          return res.json({
            status: true,
            message: "Decision submitted and event updated successfully",
          });
        }
      );
    }
  );
});

// Route to check if an event group with the given name already exists
app.post("/check-event-exist", (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res
      .status(400)
      .json({ status: false, error: "Event group name is required" });
  }
  const sql = "SELECT id FROM event WHERE name = ? LIMIT 1";
  oms_db.query(sql, [name], (err, results) => {
    if (err) {
      console.error("Error checking event group exist:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    return res.json({ exists: results.length > 0 });
  });
});

// Route to create a new event group
app.post("/create-event", (req, res) => {
  const { user_data, name, description } = req.body;
  if (!user_data || !name || !description) {
    return res.status(400).json({
      status: false,
      error: "Event group name, description, and user data are required",
    });
  }

  let userObj;
  try {
    userObj = JSON.parse(user_data);
  } catch (err) {
    return res.status(400).json({ status: false, error: "Invalid user data" });
  }

  const sql = "INSERT INTO event (name, user_id, description) VALUES (?, ?, ?)";
  oms_db.query(sql, [name, userObj.id, description], (err, result) => {
    if (err) {
      console.error("Error creating event group:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    return res.json({ status: true, id: result.insertId });
  });
});

app.post("/fetch-draft-events", (req, res) => {
  const { mode, searchTerm, year, startDate, endDate } = req.body;

  // Base query: always restrict to events with status 'Draft' or 'Back to Draft'
  let sql = `
    SELECT 
      id, 
      name, 
      date,
      created_at, 
      status
    FROM event
  `;

  let conditions = [];
  let params = [];

  // Mandatory condition for status
  conditions.push("status IN ('Draft', 'Back to Draft')");

  // Additional filtering based on mode
  if (mode === "Search") {
    conditions.push("name LIKE ?");
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern);
  } else if (mode === "Filter") {
    conditions.push("YEAR(created_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("created_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("created_at <= ?");
      params.push(endDate);
    }
  } else if (mode === "Mixed") {
    conditions.push("(name LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern);
    conditions.push("YEAR(created_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("created_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("created_at <= ?");
      params.push(endDate);
    }
  }

  // Append conditions if they exist
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  // Order so that 'Back to Draft' comes first then 'Draft', and order by updated_at descending.
  sql += `
    ORDER BY 
      CASE status 
        WHEN 'Back to Draft' THEN 0 
        WHEN 'Draft' THEN 1 
        ELSE 2 
      END,
      updated_at DESC
  `;

  oms_db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching draft events:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    const data = results.map((event) => {
      if (event.created_at !== null) {
        event.created_at = formatDateTableNoTime(event.created_at);
      }

      if (event.date === null) {
        event.date = "Not Set";
      } else [(event.date = formatDateTableNoTime(event.date))];

      return event;
    });

    return res.json({ status: true, data: data });
  });
});

app.post("/fetch-pending-event-approvals", (req, res) => {
  const { mode, searchTerm, year, startDate, endDate } = req.body;

  // Base query: always restrict to events with status 'Ready to Publish' or 'Sent for Approval'
  let sql = `
    SELECT 
      id, 
      name, 
      date,
      created_at, 
      updated_at,
      status
    FROM event
  `;

  let conditions = [];
  let params = [];

  // Mandatory condition for status
  conditions.push("status IN ('Ready to Publish', 'Sent for Approval')");

  // Additional filtering based on mode
  if (mode === "Search") {
    conditions.push("name LIKE ?");
    const pattern = `%${searchTerm}%`;
    params.push(pattern);
  } else if (mode === "Filter") {
    conditions.push("YEAR(created_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("created_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("created_at <= ?");
      params.push(endDate);
    }
  } else if (mode === "Mixed") {
    conditions.push("(name LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern);
    conditions.push("YEAR(created_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("created_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("created_at <= ?");
      params.push(endDate);
    }
  }

  // Append conditions if they exist
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  // Order so that 'Ready to Publish' comes first then 'Sent for Approval', and order by updated_at descending.
  sql += `
    ORDER BY 
      CASE status 
        WHEN 'Ready to Publish' THEN 0 
        WHEN 'Sent for Approval' THEN 1 
        ELSE 2 
      END,
      updated_at DESC
  `;

  oms_db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching pending event approvals:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    const data = results.map((event) => {
      if (event.created_at !== null) {
        event.created_at = formatDateTableNoTime(event.created_at);
      }

      if (event.date === null) {
        event.date = "Not Set";
      } else {
        event.date = formatDateTableNoTime(event.date);
      }

      return event;
    });

    return res.json({ status: true, data: data });
  });
});

app.post("/fetch-draft-event-details", (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res
      .status(400)
      .json({ status: false, error: "Event ID is required" });
  }

  const sql =
    "SELECT *, approved_at as approved_at_orig FROM event WHERE id = ?";
  oms_db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching event details:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ status: false, error: "Event not found" });
    }

    const data = results.map((draftEvent) => {
      draftEvent.updated_at = formatDate(draftEvent.updated_at);
      draftEvent.created_at = formatDate(draftEvent.created_at);

      if (draftEvent.approved_at !== null) {
        draftEvent.approved_at = formatDate(draftEvent.approved_at);
      }

      if (draftEvent.published_at !== null) {
        draftEvent.published_at = formatDate(draftEvent.published_at);
      }

      // Parse time_period (format: "HH:MM-HH:MM") if available
      if (draftEvent.time_period) {
        const [start, end] = draftEvent.time_period.split("-");
        draftEvent.start_time = start ? start.trim() : null;
        draftEvent.end_time = end ? end.trim() : null;
      } else if (draftEvent.start_date && draftEvent.end_date) {
        // Fallback to parsing from start_date/end_date for backward compatibility
        draftEvent.start_time = formatTimeOnly(draftEvent.start_date);
        draftEvent.end_time = formatTimeOnly(draftEvent.end_date);
      } else {
        draftEvent.start_time = null;
        draftEvent.end_time = null;
      }

      // Parse date from date field or start_date for backward compatibility
      if (draftEvent.date) {
        draftEvent.date = formatDateTableNoTime(draftEvent.date);
      } else if (draftEvent.start_date) {
        draftEvent.date = formatDateTableNoTime(draftEvent.start_date);
      } else {
        draftEvent.date = null;
      }

      // Parse attendances JSON if stored as string
      if (typeof draftEvent.attendances === "string") {
        try {
          draftEvent.attendances = JSON.parse(draftEvent.attendances);
        } catch (e) {
          draftEvent.attendances = [];
        }
      }

      // For backward compatibility, also expose breakdown field if attendances exists
      if (draftEvent.attendances && !draftEvent.breakdown) {
        draftEvent.breakdown = draftEvent.attendances;
      }

      return draftEvent;
    });

    return res.json({ status: true, data: data[0] });
  });
});

app.post("/update-draft-event", (req, res) => {
  const {
    user_data,
    id,
    name,
    description,
    date,
    start_time,
    end_time,
    time_period,
    status,
    request_message,
  } = req.body;

  // Parse user_data first
  let userObj;
  try {
    userObj = JSON.parse(user_data);
  } catch (err) {
    return res.status(400).json({ status: false, error: "Invalid user data" });
  }

  // For "Sent for Approval" status, require all fields
  if (status === "Sent for Approval") {
    if (!id || !name || !description || !date || !status) {
      return res
        .status(400)
        .json({ status: false, error: "All fields are required" });
    }
  }

  // For "Draft" status, allow partial updates (auto-save)
  if (status === "Sent for Approval") {
    // Accept attendance JSON under multiple keys for backward compatibility
    const breakdownData =
      req.body.breakdown || req.body.attendances || req.body.attendance || [];
    // First create an approval record for the event.
    if (!id || !name || !description || !date || !status) {
      return res
        .status(400)
        .json({ status: false, error: "All fields are required" });
    }
    const approvalName = "Approval for " + name;
    const approvalSql = `
      INSERT INTO approval (name, type, relating_id, request_message, user_id)
      VALUES (?, 'Event', ?, ?, ?)
    `;
    oms_db.query(
      approvalSql,
      [approvalName, id, request_message, userObj.id],
      (approvalErr, approvalResult) => {
        if (approvalErr) {
          console.error("Error creating approval record:", approvalErr);
          return res
            .status(500)
            .json({ status: false, error: "Internal Server Error" });
        }
        const approval_id = approvalResult.insertId;

        // Parse time_period if provided (format: "HH:MM-HH:MM"), otherwise use start_time/end_time
        let timePeriodStr = time_period;
        if (!timePeriodStr && start_time && end_time) {
          timePeriodStr = `${start_time}-${end_time}`;
        }

        // Build start_date and end_date from date and time range (for backward compatibility)
        const startDatetime = start_time
          ? `${date} ${start_time}:00`
          : `${date} 00:00:00`;
        const endDatetime = end_time
          ? `${date} ${end_time}:00`
          : `${date} 23:59:59`;

        // Accept attendance JSON under multiple keys for backward compatibility
        const breakdownData =
          req.body.breakdown ||
          req.body.attendances ||
          req.body.attendance ||
          [];

        // Now update the event with the new approval_id.
        const sql = `
        UPDATE event
        SET name = ?, 
            description = ?, 
            attendances = ?, 
            time_period = ?,
            status = ?, 
            approval_id = ?
        WHERE id = ?
      `;
        oms_db.query(
          sql,
          [
            name,
            description,
            JSON.stringify(breakdownData),
            timePeriodStr || null,
            status,
            approval_id,
            id,
          ],
          (err, result) => {
            if (err) {
              console.error("Error updating event with approval:", err);
              return res
                .status(500)
                .json({ status: false, error: "Internal Server Error" });
            }
            if (result.affectedRows === 0) {
              return res
                .status(404)
                .json({ status: false, error: "Event not found" });
            }
            // Fetch the updated event record.
            const fetchSql = "SELECT * FROM event WHERE id = ?";
            oms_db.query(fetchSql, [id], (fetchErr, fetchResults) => {
              if (fetchErr) {
                console.error("Error fetching updated event:", fetchErr);
                return res
                  .status(500)
                  .json({ status: false, error: "Internal Server Error" });
              }
              const data = fetchResults.map((event) => {
                event.updated_at = formatDate(event.updated_at);
                event.created_at = formatDate(event.created_at);
                // Parse time_period into start_time and end_time
                if (event.time_period) {
                  const [start, end] = event.time_period.split("-");
                  event.start_time = start.trim();
                  event.end_time = end.trim();
                } else {
                  event.start_time = null;
                  event.end_time = null;
                }
                event.date = formatDateTableNoTime(event.date);
                // Parse attendances JSON if needed
                if (typeof event.attendances === "string") {
                  try {
                    event.attendances = JSON.parse(event.attendances);
                  } catch (e) {
                    event.attendances = [];
                  }
                }
                return event;
              });
              return res.json({ status: true, data: data[0] });
            });
          }
        );
      }
    );
  } else if (status === "Draft") {
    // Draft auto-save: allow partial updates, don't require all fields
    if (!id) {
      return res
        .status(400)
        .json({ status: false, error: "Event ID is required" });
    }

    // Parse time_period if provided (format: "HH:MM-HH:MM"), otherwise use start_time/end_time
    let timePeriodStr = time_period;
    if (!timePeriodStr && start_time && end_time) {
      timePeriodStr = `${start_time}-${end_time}`;
    }

    // Accept attendance JSON under multiple keys for backward compatibility
    const breakdownData =
      req.body.breakdown || req.body.attendances || req.body.attendance || [];

    // Build dynamic SQL for partial updates
    let updateFields = [];
    let updateValues = [];

    if (name !== undefined) {
      updateFields.push("name = ?");
      updateValues.push(name);
    }
    if (description !== undefined) {
      updateFields.push("description = ?");
      updateValues.push(description);
    }
    if (date !== undefined) {
      updateFields.push("date = ?");
      updateValues.push(date);
    }
    if (timePeriodStr !== undefined) {
      updateFields.push("time_period = ?");
      updateValues.push(timePeriodStr || null);
    }
    if (breakdownData && breakdownData.length > 0) {
      updateFields.push("attendances = ?");
      updateValues.push(JSON.stringify(breakdownData));
    }
    if (status !== undefined) {
      updateFields.push("status = ?");
      updateValues.push(status);
    }

    // Always update updated_at timestamp
    updateFields.push("updated_at = NOW()");

    updateValues.push(id);

    if (updateFields.length === 1) {
      // Only updated_at, still proceed
      updateFields.push("id = id"); // No-op to ensure valid SQL
    }

    const sql = `
      UPDATE event 
      SET ${updateFields.join(", ")}
      WHERE id = ?
    `;

    oms_db.query(sql, updateValues, (err, result) => {
      if (err) {
        console.error("Error updating draft event:", err);
        return res
          .status(500)
          .json({ status: false, error: "Internal Server Error" });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ status: false, error: "Event not found" });
      }

      // Fetch the updated event record
      const fetchSql = "SELECT * FROM event WHERE id = ?";
      oms_db.query(fetchSql, [id], (fetchErr, fetchResults) => {
        if (fetchErr) {
          console.error("Error fetching updated draft event:", fetchErr);
          return res
            .status(500)
            .json({ status: false, error: "Internal Server Error" });
        }

        const data = fetchResults.map((event) => {
          event.updated_at = formatDate(event.updated_at);
          event.created_at = formatDate(event.created_at);
          // Parse time_period into start_time and end_time
          if (event.time_period) {
            const [start, end] = event.time_period.split("-");
            event.start_time = start.trim();
            event.end_time = end.trim();
          } else {
            event.start_time = null;
            event.end_time = null;
          }
          event.date = formatDateTableNoTime(event.date);
          // Parse attendances JSON if needed
          if (typeof event.attendances === "string") {
            try {
              event.attendances = JSON.parse(event.attendances);
            } catch (e) {
              event.attendances = [];
            }
          }
          return event;
        });
        return res.json({ status: true, data: data[0] });
      });
    });
  } else {
    // Unknown status
    return res
      .status(400)
      .json({ status: false, error: "Invalid status provided" });
  }
});

app.post("/fetch-your-total-unpaid-payment", (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const sql = `
    SELECT IFNULL(SUM(amount), 0) AS totalUnpaid 
    FROM payment 
    WHERE status = 'Issued'
  `;

  oms_db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching total unpaid payment:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    const total = parseFloat(results[0].totalUnpaid) || 0;
    const formatted = "₱ " + total;
    return res.json({
      status: true,
      data: { your_total_unpaid_payment: formatted },
    });
  });
});

app.post("/fetch-servicing", (req, res) => {
  const { mode, searchTerm, year, startDate, endDate } = req.body;

  let sql = `
    SELECT 
      student_user_id, 
      points, 
      created_at
    FROM servicing
  `;
  let conditions = [];
  let params = [];

  // Apply various filtering modes.
  if (mode === "Search") {
    conditions.push("(CAST(points AS CHAR) LIKE ? OR user_id LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern);
  } else if (mode === "Filter") {
    conditions.push("YEAR(created_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("created_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("created_at <= ?");
      params.push(endDate);
    }
  } else if (mode === "Mixed") {
    conditions.push("(CAST(points AS CHAR) LIKE ? OR user_id LIKE ?)");
    const pattern = `%${searchTerm}%`;
    params.push(pattern, pattern);
    conditions.push("YEAR(created_at) = ?");
    params.push(year);
    if (startDate) {
      conditions.push("created_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("created_at <= ?");
      params.push(endDate);
    }
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }
  sql += " ORDER BY created_at DESC";

  oms_db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching servicing records:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
    // Format the created_at field (using your helper function)
    const data = results.map((record) => {
      record.created_at = formatDateTableNoTime(record.created_at);
      return record;
    });
    return res.json({ status: true, data });
  });
});

app.post("/fetch-user-options", (req, res) => {
  const sql = "SELECT id, full_name FROM user_account ORDER BY full_name";

  oms_db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching user options:", err);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }

    return res.json({ status: true, data: results });
  });
});

app.post("/create-servicing", (req, res) => {
  const { user_data, student_user_id, points, reason } = req.body;
  if (!user_data || !student_user_id || !points || !reason) {
    return res
      .status(400)
      .json({ status: false, error: "Missing required fields" });
  }

  let userObj;
  try {
    userObj = JSON.parse(user_data);
  } catch (err) {
    return res.status(400).json({ status: false, error: "Invalid user data" });
  }

  // Insert into servicing table
  const insertSql = `
    INSERT INTO servicing (user_id, student_user_id, points, reason)
    VALUES (?, ?, ?, ?)
  `;
  oms_db.query(
    insertSql,
    [userObj.id, student_user_id, points, reason],
    (err, result) => {
      if (err) {
        console.error("Error inserting servicing record:", err);
        return res
          .status(500)
          .json({ status: false, error: "Internal Server Error" });
      }

      // Update the servicing_points of the user_account where id equals student_user_id
      const updateSql = `
      UPDATE user_account 
      SET servicing_points = IFNULL(servicing_points, 0) + ?
      WHERE id = ?
    `;
      oms_db.query(
        updateSql,
        [points, student_user_id],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Error updating servicing points:", updateErr);
            return res
              .status(500)
              .json({ status: false, error: "Internal Server Error" });
          }

          return res.json({
            status: true,
            message: "Servicing record created and points updated",
          });
        }
      );
    }
  );
});

app.use("/proofs", express.static(path.join(__dirname, "proofs")));
app.use("/documents", express.static(path.join(__dirname, "documents")));
app.use("/e-signatures", express.static(path.join(__dirname, "e-signatures")));
app.use(
  "/qr-codes/attendance",
  express.static(path.join(__dirname, "qr-codes/attendance"))
);
app.use(
  "/qr-codes/users",
  express.static(path.join(__dirname, "qr-codes/users"))
);
app.use("/receipts", express.static(path.join(__dirname, "receipts")));
app.use("/profile-pic", express.static(path.join(__dirname, "profile-pic")));

// ============================================================================
// 🔹 SESSION DETECTION ENDPOINTS (Server-side session tracking)
// ============================================================================

// Start Session (called when user logs in)
app.post("/api/sessions/start", (req, res) => {
  try {
    const { userId, platform = "web" } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId required" });
    }

    // Generate unique session ID
    const sessionId = uuidv4();

    // Register session in manager
    const session = sessionManager.registerSession(sessionId, userId, platform);

    res.json({
      success: true,
      sessionId,
      message: "Session started",
    });
  } catch (error) {
    console.error("[API] Error starting session:", error);
    res.status(500).json({ error: "Failed to start session" });
  }
});

// Heartbeat endpoint (called every 7 seconds from frontend)
app.post("/api/sessions/heartbeat", (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "sessionId required" });
    }

    // Update heartbeat timestamp
    const updated = sessionManager.updateHeartbeat(sessionId);

    if (!updated) {
      return res.status(401).json({ error: "Session not found" });
    }

    res.json({
      success: true,
      message: "Heartbeat received",
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("[API] Error processing heartbeat:", error);
    res.status(500).json({ error: "Failed to process heartbeat" });
  }
});

// Explicit logout endpoint
app.post("/api/sessions/end", (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "sessionId required" });
    }

    // Destroy session
    const session = sessionManager.destroySession(sessionId);

    if (!session) {
      return res.status(401).json({ error: "Session not found" });
    }

    // First, fetch current user status to check both platforms
    const fetchUserSql =
      "SELECT is_login_web, is_login_mobile FROM user_account WHERE id = ?";
    oms_db.query(fetchUserSql, [session.userId], (fetchErr, userResults) => {
      if (fetchErr || !userResults || userResults.length === 0) {
        console.error("[Session] Error fetching user status:", fetchErr);
        return res.json({
          success: true,
          message: "Session ended",
          userId: session.userId,
        });
      }

      const currentUser = userResults[0];
      let updateSql = "UPDATE user_account SET ";
      const updates = [];

      // Update platform-specific login status
      if (session.platform === "web") {
        updates.push("is_login_web = 0");
      } else if (session.platform === "mobile") {
        updates.push("is_login_mobile = 0");
      }

      // Check if user will have any active logins after this update
      let willHaveActiveLogins = false;
      if (session.platform === "web") {
        // User is logging out from web, check if mobile is still logged in
        willHaveActiveLogins = currentUser.is_login_mobile === 1;
      } else if (session.platform === "mobile") {
        // User is logging out from mobile, check if web is still logged in
        willHaveActiveLogins = currentUser.is_login_web === 1;
      }

      // If no active logins will remain, set is_online = 0
      if (!willHaveActiveLogins) {
        updates.push("is_online = 0");
      }

      if (updates.length > 0) {
        updateSql += updates.join(", ") + " WHERE id = ?";
        oms_db.query(updateSql, [session.userId], (updateErr) => {
          if (updateErr) {
            console.error("[Session] Error updating user status:", updateErr);
          } else {
            console.log(
              `[Session] Updated user ${session.userId}: ${updates.join(", ")}`
            );
          }
        });
      }

      res.json({
        success: true,
        message: "Session ended",
        userId: session.userId,
      });
    });
  } catch (error) {
    console.error("[API] Error ending session:", error);
    res.status(500).json({ error: "Failed to end session" });
  }
});

// Check session status
app.get("/api/sessions/status/:sessionId", (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = sessionManager.getSession(sessionId);

    if (!session) {
      return res.json({
        active: false,
        message: "Session not found",
      });
    }

    res.json({
      active: true,
      userId: session.userId,
      platform: session.platform,
      lastHeartbeat: session.lastHeartbeat,
      timeSinceLastHeartbeat: Date.now() - session.lastHeartbeat,
    });
  } catch (error) {
    console.error("[API] Error checking session status:", error);
    res.status(500).json({ error: "Failed to check session status" });
  }
});

// Admin monitoring - session stats
app.get("/api/admin/session-stats", (req, res) => {
  try {
    const stats = sessionManager.getStats();
    const allSessions = sessionManager.getAllSessions();
    const userSessionSummary = sessionManager.getUserSessionSummary();
    const uniqueUserCount = sessionManager.getUniqueActiveUserCount();

    res.json({
      stats: {
        ...stats,
        uniqueActiveUsers: uniqueUserCount,
      },
      userSessionSummary,
      sessions: allSessions,
      serverTime: Date.now(),
    });
  } catch (error) {
    console.error("[API] Error getting session stats:", error);
    res.status(500).json({ error: "Failed to get session stats" });
  }
});

// ============================================================================
// 🔹 BACKGROUND TASKS (Session monitoring & cleanup)
// ============================================================================

const INACTIVITY_TIMEOUT = 1800000; // 30 minutes (1800000 ms) - configurable
const CHECK_INTERVAL = 60000; // Check every 60 seconds (1 minute) - configurable

const inactivityCheckInterval = setInterval(() => {
  const inactiveSessions = sessionManager.checkInactiveSessions(
    INACTIVITY_TIMEOUT,
    (session, sessionId) => {
      // Called for each inactive session detected
      console.log(
        `[Auto-Logout] Session inactive: ${sessionId} (user: ${session.userId}, platform: ${session.platform})`
      );

      // Fetch current user status to check both platforms
      const fetchUserSql =
        "SELECT is_login_web, is_login_mobile FROM user_account WHERE id = ?";
      oms_db.query(fetchUserSql, [session.userId], (fetchErr, userResults) => {
        if (fetchErr || !userResults || userResults.length === 0) {
          console.error("[Session] Error fetching user status:", fetchErr);
          return;
        }

        const currentUser = userResults[0];
        let updateSql = "UPDATE user_account SET ";
        const updates = [];

        // Update platform-specific login status
        if (session.platform === "web") {
          updates.push("is_login_web = 0");
        } else if (session.platform === "mobile") {
          updates.push("is_login_mobile = 0");
        }

        // Check if user will have any active logins after this update
        let willHaveActiveLogins = false;
        if (session.platform === "web") {
          // User is logging out from web, check if mobile is still logged in
          willHaveActiveLogins = currentUser.is_login_mobile === 1;
        } else if (session.platform === "mobile") {
          // User is logging out from mobile, check if web is still logged in
          willHaveActiveLogins = currentUser.is_login_web === 1;
        }

        // If no active logins will remain, set is_online = 0
        if (!willHaveActiveLogins) {
          updates.push("is_online = 0");
        }

        if (updates.length > 0) {
          updateSql += updates.join(", ") + " WHERE id = ?";
          oms_db.query(updateSql, [session.userId], (updateErr) => {
            if (updateErr) {
              console.error("[Session] Error updating user status:", updateErr);
            } else {
              console.log(
                `[Session] Updated user ${session.userId}: ${updates.join(
                  ", "
                )}`
              );

              // 🔹 Broadcast user-offline event when user becomes completely offline due to inactivity
              if (!willHaveActiveLogins) {
                io.to("online-users").emit("user-left", {
                  userId: session.userId,
                  platform: session.platform,
                  timestamp: Date.now(),
                  reason: "inactivity",
                });

                // 🔹 Broadcast stats-updated for online cards
                io.emit("stats-updated", {
                  event: "inactivity",
                  userId: session.userId,
                  platform: session.platform,
                  timestamp: Date.now(),
                });

                console.log(
                  `[Socket.IO] Broadcasting user-left and stats-updated for user ${session.userId} (inactivity)`
                );
              }
            }
          });
        }
      });
    }
  );

  if (inactiveSessions.length > 0) {
    console.log(
      `[Session] Detected ${inactiveSessions.length} inactive sessions`
    );
  }
}, CHECK_INTERVAL);

// Stats logging every 60 seconds
const statsLogInterval = setInterval(() => {
  const stats = sessionManager.getStats();
  const userSummary = sessionManager.getUserSessionSummary();

  // Count users active on both platforms
  const usersOnBothPlatforms = Object.values(userSummary).filter(
    (u) => u.isActiveOnBothPlatforms
  ).length;

  console.log(
    `[Session Stats] Sessions: ${stats.totalActiveSessions}, Users: ${stats.totalActiveUsers} ` +
      `(${usersOnBothPlatforms} on both platforms), Platforms: ${JSON.stringify(
        stats.platformBreakdown
      )}`
  );
}, 60000);

// Cleanup intervals on server shutdown
process.on("SIGTERM", () => {
  clearInterval(inactivityCheckInterval);
  clearInterval(statsLogInterval);
  sessionManager.shutdown();
  console.log("[Session] Manager shutdown on SIGTERM");
});

process.on("SIGINT", () => {
  clearInterval(inactivityCheckInterval);
  clearInterval(statsLogInterval);
  sessionManager.shutdown();
  console.log("[Session] Manager shutdown on SIGINT");
  process.exit(0);
});

// ============================================================================
// Sync user online status from session backup on server startup
// ============================================================================
async function syncUserSessionStatus() {
  try {
    console.log("[Startup] Syncing user session status from backup...");

    // Get all sessions from backup
    const sessionSummary = sessionManager.getUserSessionSummary();

    if (Object.keys(sessionSummary).length === 0) {
      console.log(
        "[Startup] No active sessions in backup. Resetting all users offline."
      );

      // Reset all users to offline
      const resetQuery =
        "UPDATE user_account SET is_online = 0, is_login_web = 0, is_login_mobile = 0";
      oms_db.query(resetQuery, (err) => {
        if (err) {
          console.error("[Startup] Error resetting user statuses:", err);
        } else {
          console.log("[Startup] All users reset to offline status.");
        }
      });

      return;
    }

    // For each user with active sessions, update their online status based on platforms
    const updatePromises = Object.entries(sessionSummary).map(
      ([userId, userInfo]) => {
        return new Promise((resolve) => {
          const is_online = 1; // User has active session
          const is_login_web = userInfo.webSessions > 0 ? 1 : 0;
          const is_login_mobile = userInfo.mobileSessions > 0 ? 1 : 0;

          const updateQuery =
            "UPDATE user_account SET is_online = ?, is_login_web = ?, is_login_mobile = ? WHERE id = ?";

          oms_db.query(
            updateQuery,
            [is_online, is_login_web, is_login_mobile, userId],
            (err) => {
              if (err) {
                console.error(
                  `[Startup] Error updating user ${userId} status:`,
                  err
                );
              } else {
                console.log(
                  `[Startup] Updated user ${userId}: online=${is_online}, web=${is_login_web}, mobile=${is_login_mobile}`
                );
              }
              resolve();
            }
          );
        });
      }
    );

    // Wait for all updates to complete
    await Promise.all(updatePromises);

    // Get all users and reset those not in active sessions
    const getAllUsersQuery = "SELECT id FROM user_account";
    oms_db.query(getAllUsersQuery, (err, results) => {
      if (err) {
        console.error("[Startup] Error fetching all users:", err);
        return;
      }

      const activeUserIds = new Set(Object.keys(sessionSummary));

      results.forEach((user) => {
        if (!activeUserIds.has(String(user.id))) {
          // User not in active sessions, reset their status
          const resetUserQuery =
            "UPDATE user_account SET is_online = 0, is_login_web = 0, is_login_mobile = 0 WHERE id = ?";
          oms_db.query(resetUserQuery, [user.id], (err) => {
            if (err) {
              console.error(
                `[Startup] Error resetting user ${user.id} status:`,
                err
              );
            }
          });
        }
      });

      console.log(
        `[Startup] Session sync complete. ${
          Object.keys(sessionSummary).length
        } users online, ${
          results.length - Object.keys(sessionSummary).length
        } users offline.`
      );
    });
  } catch (error) {
    console.error("[Startup] Error syncing session status:", error);
  }
}

// 🔹 Start Express Server
const PORT = process.env.PORT || 8081;
server.listen(PORT, () => {
  // Initialize session manager (load persisted sessions)
  sessionManager.initialize();

  // Sync user online status with database
  syncUserSessionStatus();

  console.log(`Server running on http://localhost:${PORT}`);
});

// ============================================================================
// Socket.IO Connection Handler - for real-time online user updates
// ============================================================================
io.on("connection", (socket) => {
  console.log(`[Socket.IO] User connected: ${socket.id}`);

  // When client joins the "online-users" room for live updates
  socket.on("join-online-users", (data) => {
    socket.join("online-users");
    console.log(`[Socket.IO] ${socket.id} joined online-users room`);
  });

  // When a user comes online (emitted from /api/sessions/start)
  socket.on("user-online", (data) => {
    const { userId, platform } = data;
    console.log(
      `[Socket.IO] User ${userId} came online on ${platform} (${socket.id})`
    );

    // Broadcast to all clients in the room
    io.to("online-users").emit("user-joined", {
      userId,
      platform,
      timestamp: Date.now(),
    });
  });

  // When a user goes offline (emitted from /api/sessions/end)
  socket.on("user-offline", (data) => {
    const { userId } = data;
    console.log(`[Socket.IO] User ${userId} went offline (${socket.id})`);

    // Broadcast to all clients in the room
    io.to("online-users").emit("user-left", {
      userId,
      timestamp: Date.now(),
    });
  });

  // Request full list of online users
  socket.on("request-online-users", () => {
    const sql = `
      SELECT 
        u.id,
        u.profile_pic,
        u.student_id,
        u.full_name,
        CASE 
          WHEN u.is_login_web = 1 AND u.is_login_mobile = 1 THEN 'Web & Mobile'
          WHEN u.is_login_web = 1 THEN 'Web'
          WHEN u.is_login_mobile = 1 THEN 'Mobile'
          ELSE 'Unknown'
        END AS platform,
        u.updated_at
      FROM user_account u
      WHERE u.is_online = 1 
        AND u.designation <> 'Admin'
      ORDER BY u.updated_at DESC
    `;

    oms_db.query(sql, [], (err, results) => {
      if (err) {
        console.error("[Socket.IO] Error fetching online users:", err);
        socket.emit("online-users-list", { data: [], error: err });
        return;
      }

      socket.emit("online-users-list", { data: results });
    });
  });

  socket.on("disconnect", () => {
    console.log(`[Socket.IO] User disconnected: ${socket.id}`);
  });
});
