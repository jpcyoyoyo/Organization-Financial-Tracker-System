/**
 * Session API Endpoints - Reference Implementation
 * Copy these endpoints into server.js where other API routes are defined
 *
 * Required at top of server.js:
 *   const sessionManager = require("./session-manager");
 *   const { v4: uuidv4 } = require('uuid');
 */

// ============================================================================
// ENDPOINT 1: Start Session (called when user logs in)
// ============================================================================
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

// ============================================================================
// ENDPOINT 2: Heartbeat (called every 7 seconds from frontend)
// ============================================================================
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

// ============================================================================
// ENDPOINT 3: Explicit Logout (called when user clicks logout button)
// ============================================================================
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

    // Update database if needed
    // const result = await db.query("UPDATE users SET is_online = 0 WHERE user_id = ?", [session.userId]);

    res.json({
      success: true,
      message: "Session ended",
      userId: session.userId,
    });
  } catch (error) {
    console.error("[API] Error ending session:", error);
    res.status(500).json({ error: "Failed to end session" });
  }
});

// ============================================================================
// ENDPOINT 4: Session Status (check if session is still active)
// ============================================================================
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

// ============================================================================
// ENDPOINT 5: Session Stats (admin monitoring)
// ============================================================================
app.get("/api/admin/session-stats", (req, res) => {
  try {
    const stats = sessionManager.getStats();
    const allSessions = sessionManager.getAllSessions();

    res.json({
      stats,
      sessions: allSessions,
      serverTime: Date.now(),
    });
  } catch (error) {
    console.error("[API] Error getting session stats:", error);
    res.status(500).json({ error: "Failed to get session stats" });
  }
});

// ============================================================================
// BACKGROUND TASK 1: Check for inactive sessions every 10 seconds
// Place this code after all endpoint definitions, before server.listen()
// ============================================================================
const INACTIVITY_TIMEOUT = 30000; // 30 seconds (configurable)
const CHECK_INTERVAL = 10000; // Check every 10 seconds (configurable)

const inactivityCheckInterval = setInterval(() => {
  const inactiveSessions = sessionManager.checkInactiveSessions(
    INACTIVITY_TIMEOUT,
    (session, sessionId) => {
      // Called for each inactive session detected
      console.log(
        `[Auto-Logout] Session inactive: ${sessionId} (user: ${session.userId})`
      );

      // TODO: Update database to mark user as offline
      // db.query("UPDATE users SET is_online = 0 WHERE user_id = ?", [session.userId]);

      // TODO: Optionally send notification to user's other sessions
      // io.to(`user-${session.userId}`).emit("session-ended", { reason: "inactivity" });
    }
  );

  if (inactiveSessions.length > 0) {
    console.log(
      `[Session] Detected ${inactiveSessions.length} inactive sessions`
    );
  }
}, CHECK_INTERVAL);

// ============================================================================
// BACKGROUND TASK 2: Cleanup and log stats every 60 seconds
// Place this code after inactivityCheckInterval setup, before server.listen()
// ============================================================================
const statsLogInterval = setInterval(() => {
  const stats = sessionManager.getStats();
  console.log(
    `[Session Stats] Active: ${stats.totalActiveSessions}, Platforms:`,
    stats.platformBreakdown
  );
}, 60000);

// Optional: Cleanup intervals on server shutdown
process.on("SIGTERM", () => {
  clearInterval(inactivityCheckInterval);
  clearInterval(statsLogInterval);
  sessionManager.clearAllSessions();
});
