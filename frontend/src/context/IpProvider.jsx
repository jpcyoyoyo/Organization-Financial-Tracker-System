import { IpContext } from "./IpContext";
import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";

const IpProvider = ({ children }) => {
  const [ip, setIp] = useState("http://192.168.100.21:8081");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState("unknown");
  const [isConnected, setIsConnected] = useState(false);
  const isMobileRef = useRef(
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  );
  const pollIntervalRef = useRef(null);
  const lastSuccessfulIpRef = useRef("http://192.168.100.21:8081");

  // Store current IP in sessionStorage for app-wide access (e.g., logout requests)
  useEffect(() => {
    sessionStorage.setItem("currentIp", ip);
  }, [ip]);

  // Detect connection type on mobile
  useEffect(() => {
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    if (connection) {
      const type = connection.effectiveType || "unknown";
      setConnectionType(type);

      const handleConnectionChange = () => {
        const newType = connection.effectiveType || "unknown";
        setConnectionType(newType);
        console.log(`Mobile connection type changed to: ${newType}`);
      };

      connection.addEventListener?.("change", handleConnectionChange);
      return () =>
        connection.removeEventListener?.("change", handleConnectionChange);
    }
  }, []);

  useEffect(() => {
    // Capture isMobile value at effect time (for use in cleanup function)
    const isMobile = isMobileRef.current;

    // Get initial IP
    const getLocalIP = async () => {
      if (!isOnline) {
        console.warn("Device is offline, skipping IP check");
        return false;
      }

      try {
        const response = await fetch(`${ip}/api/config`, {
          method: "GET",
          signal: AbortSignal.timeout(isMobile ? 5000 : 3000),
        });

        if (response.ok) {
          const data = await response.json();
          const newIp = `http://${data.ipAddress}:8081`;

          if (newIp !== ip) {
            console.log(
              `Network changed: ${ip} -> ${newIp} (Mobile: ${isMobile})`
            );
            setIp(newIp);
            lastSuccessfulIpRef.current = newIp;
          }
          console.log("✓ Connected to server successfully");
          setIsConnected(true);
          return true;
        }
      } catch (error) {
        console.warn("Could not connect to server:", error.message);
        setIsConnected(false);
        await tryFallbackIPs();
      }
      return false;
    };

    const tryFallbackIPs = async () => {
      // Mobile-optimized fallback IPs (prioritize common mobile-friendly addresses)
      const fallbackIPs = [
        "http://192.168.100.21:8081", // Current default
        "http://192.168.100.21:8081", // Nearby
        "http://192.168.1.100:8081", // Common router
        "http://192.168.1.1:8081", // Standard router
        "http://192.168.0.1:8081", // Alternative router
        "http://10.0.0.1:8081", // Enterprise network
        "http://127.0.0.1:8081", // Localhost
        "http://localhost:8081", // DNS localhost
      ];

      for (const fallbackIp of fallbackIPs) {
        try {
          const response = await fetch(`${fallbackIp}/api/config`, {
            method: "GET",
            signal: AbortSignal.timeout(isMobile ? 4000 : 2000),
          });

          if (response.ok) {
            const data = await response.json();
            const newIp = `http://${data.ipAddress}:8081`;

            if (newIp !== ip) {
              console.log(
                `Found server at fallback IP: ${newIp} (${connectionType})`
              );
              setIp(newIp);
              lastSuccessfulIpRef.current = newIp;
            }
            console.log("✓ Connected to server successfully via fallback");
            setIsConnected(true);
            return true;
          }
        } catch (error) {
          console.debug(`Fallback IP ${fallbackIp} failed:`, error.message);
        }
      }

      // If no fallback worked, try last successful IP
      if (lastSuccessfulIpRef.current && lastSuccessfulIpRef.current !== ip) {
        console.log(
          `Falling back to last successful IP: ${lastSuccessfulIpRef.current}`
        );
        setIp(lastSuccessfulIpRef.current);
        setIsConnected(true);
        return true;
      }

      console.error("Could not find server on any IP");
      setIsConnected(false);
      return false;
    };

    // Initial IP check
    getLocalIP();

    // Smart polling: More frequent on mobile web, but only if not connected
    const pollInterval = isMobile ? 8000 : 10000; // 8s mobile, 10s web
    if (!isConnected) {
      pollIntervalRef.current = setInterval(() => {
        if (isOnline) getLocalIP();
      }, pollInterval);
    }

    // Listen for network changes
    const handleOnline = async () => {
      console.log("Network reconnected - checking for IP change");
      setIsOnline(true);
      setIsConnected(false);
      // Immediate check on reconnect
      await getLocalIP();
    };

    const handleOffline = () => {
      console.log("Network disconnected");
      setIsOnline(false);
      setIsConnected(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Mobile-specific: Check on visibility change (critical for mobile)
    const handleVisibilityChange = async () => {
      if (!document.hidden) {
        console.log("App returned to foreground - checking for IP change");
        setIsConnected(false);
        await getLocalIP();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Page change detection: Trigger IP check on route change
    const handlePopState = async () => {
      console.log("Page changed - checking for IP change");
      setIsConnected(false);
      await getLocalIP();
    };
    window.addEventListener("popstate", handlePopState);

    // Mobile-specific: Handle page focus/blur
    const handleFocus = async () => {
      console.log("Window focused - checking IP");
      setIsConnected(false);
      await getLocalIP();
    };

    const handleBlur = () => {
      console.log("Window blurred");
    };

    if (isMobile) {
      window.addEventListener("focus", handleFocus);
      window.addEventListener("blur", handleBlur);
    }

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("popstate", handlePopState);
      if (isMobile) {
        window.removeEventListener("focus", handleFocus);
        window.removeEventListener("blur", handleBlur);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ip, isOnline, isConnected]);

  return (
    <IpContext.Provider value={ip}>
      <div
        data-network-status={isOnline ? "online" : "offline"}
        data-device-type={isMobileRef.current ? "mobile" : "desktop"}
        data-connection-type={connectionType}
      >
        {children}
      </div>
    </IpContext.Provider>
  );
};

export default IpProvider;

IpProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
