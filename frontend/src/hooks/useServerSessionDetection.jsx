/**
 * useServerSessionDetection Hook
 *
 * Manages server-side session detection by sending heartbeat requests
 * every 7 seconds to keep the server informed the user is still active.
 *
 * If heartbeats stop (tab closed, crash, network failure), the server
 * will automatically log out the user after 30 seconds.
 *
 * Usage in App.jsx:
 *   const sessionId = useMemo(() => localStorage.getItem("sessionId") || uuidv4(), []);
 *   useServerSessionDetection(sessionId, currentIp);
 */

import { useEffect, useRef, useCallback, useContext, useState } from "react";
import { IpContext } from "../context/IpContext";

const useServerSessionDetection = (initialSessionId) => {
  const contextIp = useContext(IpContext);
  const [serverIp, setServerIp] = useState(null);
  const [activeSessionId, setActiveSessionId] = useState(initialSessionId);
  const heartbeatIntervalRef = useRef(null);
  const isVisibleRef = useRef(true);

  // Monitor sessionId changes from login
  useEffect(() => {
    const storedSessionId = sessionStorage.getItem("sessionId");
    if (storedSessionId && storedSessionId !== activeSessionId) {
      console.log(
        "[Session] Session ID updated from storage:",
        storedSessionId?.substring(0, 8)
      );
      setActiveSessionId(storedSessionId);
    }
  }, [activeSessionId]);

  // Sync with context and sessionStorage for IP
  useEffect(() => {
    // Always prioritize sessionStorage as it's the source of truth
    const storedIp = sessionStorage.getItem("currentIp");
    if (storedIp) {
      setServerIp(storedIp);
      console.log("[Session] Using IP from sessionStorage:", storedIp);
    } else if (contextIp) {
      // Fallback to context if sessionStorage not available
      setServerIp(contextIp);
      console.log("[Session] Using IP from context:", contextIp);
    } else {
      console.log(
        "[Session] Waiting for IP from IpProvider or sessionStorage..."
      );
    }
  }, [contextIp]);

  // Poll for IP if not available yet
  useEffect(() => {
    if (serverIp) return; // Already have IP

    const pollInterval = setInterval(() => {
      const storedIp = sessionStorage.getItem("currentIp");
      if (storedIp) {
        setServerIp(storedIp);
        console.log("[Session] IP found from polling:", storedIp);
        clearInterval(pollInterval);
      }
    }, 500); // Check every 500ms

    return () => clearInterval(pollInterval);
  }, [serverIp]);

  // Track visibility changes (tab not in focus, minimize, etc)
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;

      if (isVisibleRef.current) {
        console.log("[Session] Tab became visible - resuming heartbeats");
      } else {
        console.log("[Session] Tab became hidden - pausing heartbeats");
      }
    };

    // Listen for storage changes (logout in another tab)
    const handleStorageChange = (e) => {
      if (e.key === "authToken" && !e.newValue) {
        console.log(
          "[Session] Auth token cleared in another tab - stopping heartbeats"
        );
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
          heartbeatIntervalRef.current = null;
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("storage", handleStorageChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Send heartbeat to server
  const sendHeartbeat = useCallback(async () => {
    // Check if still authenticated
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      console.log("[Session] User logged out - stopping heartbeats");
      return;
    }

    const currentSessionId =
      sessionStorage.getItem("sessionId") || activeSessionId;
    if (!currentSessionId || !serverIp || !isVisibleRef.current) {
      console.warn("[Session] Cannot send heartbeat - Missing:", {
        sessionId: !currentSessionId,
        ip: !serverIp,
        visible: !isVisibleRef.current,
        currentSessionId: currentSessionId?.substring(0, 8),
      });
      return; // Skip if no session, no IP, or not visible
    }

    try {
      console.log(
        "[Session] Sending heartbeat with sessionId:",
        currentSessionId?.substring(0, 8)
      );
      const response = await fetch(`${serverIp}/api/sessions/heartbeat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId: currentSessionId }),
        timeout: 5000, // 5 second timeout
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn(
          `[Session] Heartbeat failed with status: ${response.status}`,
          errorData
        );

        // If session not found (401), user session expired on server - auto-logout
        if (response.status === 401) {
          console.warn(
            "[Session] Session not found on server - Auto-logging out user"
          );
          // Clear auth token and sessionId to trigger logout and redirect to login
          sessionStorage.removeItem("authToken");
          sessionStorage.removeItem("sessionId");
          sessionStorage.removeItem("user");

          // Dispatch custom event for same-tab detection
          window.dispatchEvent(
            new CustomEvent("session-expired", {
              detail: { reason: "Session not found on server" },
            })
          );

          // Also dispatch storage event for cross-tab detection
          window.dispatchEvent(
            new StorageEvent("storage", {
              key: "authToken",
              newValue: null,
              oldValue: token,
              storageArea: sessionStorage,
            })
          );
        }
      } else {
        console.log("[Session] Heartbeat sent successfully");
      }
    } catch (error) {
      console.warn("[Session] Heartbeat error:", error.message);
      // Continue anyway - server will detect inactivity if heartbeats stop
    }
  }, [activeSessionId, serverIp]);

  // Start heartbeat interval - only if authenticated
  useEffect(() => {
    // Check if user is still authenticated (this is the key check)
    const token = sessionStorage.getItem("authToken");
    const currentSessionId =
      sessionStorage.getItem("sessionId") || activeSessionId;
    const isCurrentlyAuthenticated = !!token;

    console.log("[Session] Heartbeat effect triggered:", {
      authenticated: isCurrentlyAuthenticated,
      hasSessionId: !!currentSessionId,
      sessionIdPrefix: currentSessionId?.substring(0, 8),
      hasIp: !!serverIp,
    });

    if (!isCurrentlyAuthenticated || !currentSessionId || !serverIp) {
      // Stop heartbeat if not authenticated or missing params
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        console.log(
          "[Session] Stopped heartbeat interval - Not authenticated or missing params"
        );
        heartbeatIntervalRef.current = null;
      }
      return;
    }

    // Only start heartbeat if we're authenticated
    if (heartbeatIntervalRef.current) {
      console.log(
        "[Session] Heartbeat interval already running, skipping restart"
      );
      return;
    }

    console.log(
      "[Session] Starting heartbeat interval with authenticated sessionId:",
      currentSessionId?.substring(0, 8)
    );

    // Send initial heartbeat immediately
    sendHeartbeat();

    // Then send every 7 seconds (must be less than 30 second server timeout)
    heartbeatIntervalRef.current = setInterval(() => {
      sendHeartbeat();
    }, 60000);

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        console.log("[Session] Cleanup: Stopped heartbeat interval");
        heartbeatIntervalRef.current = null;
      }
    };
  }, [activeSessionId, serverIp, sendHeartbeat]);

  return {
    sessionId: activeSessionId,
    isHeartbeatActive: heartbeatIntervalRef.current !== null,
  };
};

export default useServerSessionDetection;
