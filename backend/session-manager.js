/**
 * Session Manager - Server-side session tracking
 * Tracks active sessions and detects when users disconnect (tab close, crash, etc)
 * Provides automatic logout functionality
 * Persists sessions to file for crash recovery
 */

const fs = require("fs");
const path = require("path");

const sessions = new Map(); // { sessionId: { userId, lastHeartbeat, createdAt, platform } }

// Persistent storage configuration
const SESSION_STORE_FILE = path.join(__dirname, ".sessions-backup.json");
const SAVE_INTERVAL = 30000; // Auto-save every 30 seconds (configurable)
let saveInterval = null;

class SessionManager {
  /**
   * Initialize session persistence (call on server startup)
   */
  initialize() {
    // Load persisted sessions from file
    this.loadSessionsFromFile();

    // Start auto-save interval
    if (!saveInterval) {
      saveInterval = setInterval(() => {
        this.saveSessionsToFile();
      }, SAVE_INTERVAL);
    }

    console.log(
      `[Session] Manager initialized. Loaded ${sessions.size} sessions from backup.`
    );
  }

  /**
   * Save all current sessions to file
   */
  saveSessionsToFile() {
    try {
      const sessionsArray = Array.from(sessions.entries()).map(
        ([sessionId, session]) => ({
          sessionId,
          ...session,
        })
      );

      fs.writeFileSync(
        SESSION_STORE_FILE,
        JSON.stringify(sessionsArray, null, 2),
        "utf8"
      );

      console.log(
        `[Session] Persisted ${sessions.size} sessions to backup file`
      );
    } catch (error) {
      console.error("[Session] Error saving sessions to file:", error);
    }
  }

  /**
   * Load sessions from file (call on server startup)
   */
  loadSessionsFromFile() {
    try {
      if (!fs.existsSync(SESSION_STORE_FILE)) {
        console.log(
          "[Session] No backup file found. Starting with empty sessions."
        );
        return;
      }

      const data = fs.readFileSync(SESSION_STORE_FILE, "utf8");
      const sessionsArray = JSON.parse(data);

      if (!Array.isArray(sessionsArray)) {
        console.warn("[Session] Invalid backup file format. Starting fresh.");
        return;
      }

      let restoredCount = 0;
      const now = Date.now();

      sessionsArray.forEach(({ sessionId, ...sessionData }) => {
        // Check if session is still valid (not too old, within reasonable timeout)
        // Sessions older than 24 hours are discarded for security
        const sessionAge = now - sessionData.createdAt;
        const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours

        if (sessionAge < maxSessionAge) {
          // Restore session, but update heartbeat to current time
          sessions.set(sessionId, {
            ...sessionData,
            lastHeartbeat: now, // Reset heartbeat on server restart
            recovered: true, // Mark as recovered from crash
          });
          restoredCount++;
        }
      });

      console.log(
        `[Session] Restored ${restoredCount} sessions from backup file`
      );

      // Clean up old backup file after loading
      if (restoredCount === 0) {
        fs.unlinkSync(SESSION_STORE_FILE);
      }
    } catch (error) {
      console.error("[Session] Error loading sessions from file:", error);
    }
  }

  /**
   * Shutdown: save sessions and cleanup (call on server shutdown)
   */
  shutdown() {
    // Clear auto-save interval
    if (saveInterval) {
      clearInterval(saveInterval);
      saveInterval = null;
    }

    // Final save
    this.saveSessionsToFile();
    console.log("[Session] Manager shutdown. Sessions persisted.");
  }

  /**
   * Register a session when user logs in
   */
  registerSession(sessionId, userId, platform = "web") {
    sessions.set(sessionId, {
      userId,
      lastHeartbeat: Date.now(),
      createdAt: Date.now(),
      platform,
      isActive: true,
    });

    console.log(
      `[Session] Registered: ${sessionId} for user ${userId} (${platform})`
    );

    // Trigger save on new session
    this.saveSessionsToFile();

    return sessions.get(sessionId);
  }

  /**
   * Update heartbeat timestamp (called every 7 seconds from frontend)
   */
  updateHeartbeat(sessionId) {
    const session = sessions.get(sessionId);
    if (session) {
      session.lastHeartbeat = Date.now();
      return true;
    }
    return false;
  }

  /**
   * Get a session
   */
  getSession(sessionId) {
    return sessions.get(sessionId);
  }

  /**
   * Destroy a session
   */
  destroySession(sessionId) {
    const session = sessions.get(sessionId);
    if (session) {
      session.isActive = false;
      sessions.delete(sessionId);
      console.log(
        `[Session] Destroyed: ${sessionId} for user ${session.userId}`
      );

      // Trigger save on session destruction
      this.saveSessionsToFile();

      return session;
    }
    return null;
  }

  /**
   * Check for inactive sessions and trigger logout callback
   * Returns array of inactive sessions that were detected
   */
  checkInactiveSessions(
    inactivityTimeoutMs = 30000,
    onInactiveCallback = null
  ) {
    const now = Date.now();
    const inactiveSessions = [];
    let wasModified = false;

    sessions.forEach((session, sessionId) => {
      const timeSinceLastHeartbeat = now - session.lastHeartbeat;

      // If no heartbeat received in timeout period, session is inactive
      if (timeSinceLastHeartbeat > inactivityTimeoutMs) {
        inactiveSessions.push({
          sessionId,
          userId: session.userId,
          platform: session.platform,
          inactiveFor: timeSinceLastHeartbeat,
        });

        // Call callback if provided (for auto-logout, database updates, etc)
        if (onInactiveCallback) {
          onInactiveCallback(session, sessionId);
        }

        // Remove from active sessions
        sessions.delete(sessionId);
        wasModified = true;
      }
    });

    // Save if sessions were removed
    if (wasModified) {
      this.saveSessionsToFile();
    }

    return inactiveSessions;
  }

  /**
   * Check if a user has any active sessions on any platform
   */
  hasActiveSessionForUser(userId) {
    for (const session of sessions.values()) {
      if (session.userId === userId && session.isActive) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get all sessions for a specific user
   */
  getSessionsForUser(userId) {
    const userSessions = [];
    sessions.forEach((session, sessionId) => {
      if (session.userId === userId) {
        userSessions.push({ sessionId, ...session });
      }
    });
    return userSessions;
  }

  /**
   * Check if user has active sessions on a specific platform
   */
  hasActiveSessionForUserOnPlatform(userId, platform) {
    for (const session of sessions.values()) {
      if (
        session.userId === userId &&
        session.platform === platform &&
        session.isActive
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get all active sessions
   */
  getAllSessions() {
    return Array.from(sessions.entries()).map(([id, session]) => ({
      sessionId: id,
      ...session,
    }));
  }

  /**
   * Get count of unique active users (regardless of how many sessions they have)
   */
  getUniqueActiveUserCount() {
    const uniqueUsers = new Set();
    sessions.forEach((session) => {
      if (session.isActive) {
        uniqueUsers.add(session.userId);
      }
    });
    return uniqueUsers.size;
  }

  /**
   * Get user session summary
   * Returns object with each user and their session details across platforms
   */
  getUserSessionSummary() {
    const userSummary = {};

    sessions.forEach((session, sessionId) => {
      if (!userSummary[session.userId]) {
        userSummary[session.userId] = {
          userId: session.userId,
          totalSessions: 0,
          webSessions: 0,
          mobileSessions: 0,
          isActiveOnBothPlatforms: false,
          sessions: [],
        };
      }

      const userInfo = userSummary[session.userId];
      userInfo.totalSessions += 1;

      if (session.platform === "web") {
        userInfo.webSessions += 1;
      } else if (session.platform === "mobile") {
        userInfo.mobileSessions += 1;
      }

      userInfo.sessions.push({
        sessionId: sessionId.substring(0, 8),
        platform: session.platform,
        lastHeartbeat: session.lastHeartbeat,
        createdAt: session.createdAt,
        inactiveFor: Date.now() - session.lastHeartbeat,
      });
    });

    // Check if user is active on both platforms
    Object.values(userSummary).forEach((user) => {
      user.isActiveOnBothPlatforms =
        user.webSessions > 0 && user.mobileSessions > 0;
    });

    return userSummary;
  }

  /**
   * Get stats about current sessions
   * Treats multiple sessions of the same user as one active user
   * But tracks total sessions and platform breakdown
   */
  getStats() {
    const allSessions = this.getAllSessions();
    const platformStats = {};
    const uniqueUsers = new Set();
    const userSessionCounts = {}; // { userId: { total, web: count, mobile: count } }

    allSessions.forEach((session) => {
      // Count by platform
      platformStats[session.platform] =
        (platformStats[session.platform] || 0) + 1;

      // Track unique users
      uniqueUsers.add(session.userId);

      // Track sessions per user by platform
      if (!userSessionCounts[session.userId]) {
        userSessionCounts[session.userId] = {
          total: 0,
          web: 0,
          mobile: 0,
          sessions: [],
        };
      }
      userSessionCounts[session.userId].total += 1;
      userSessionCounts[session.userId][session.platform] += 1;
      userSessionCounts[session.userId].sessions.push({
        sessionId: session.sessionId.substring(0, 8),
        platform: session.platform,
        lastHeartbeat: session.lastHeartbeat,
        createdAt: session.createdAt,
      });
    });

    return {
      totalActiveSessions: sessions.size,
      totalActiveUsers: uniqueUsers.size,
      platformBreakdown: platformStats,
      userSessionBreakdown: userSessionCounts,
      oldestSession:
        allSessions.length > 0
          ? Math.min(...allSessions.map((s) => s.createdAt))
          : null,
    };
  }

  /**
   * Clear all sessions (for server restart/maintenance)
   */
  clearAllSessions() {
    const count = sessions.size;
    sessions.clear();
    console.log(`[Session] Cleared all ${count} sessions`);
    return count;
  }
}

module.exports = new SessionManager();
