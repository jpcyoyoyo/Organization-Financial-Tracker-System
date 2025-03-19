import { HelmetProvider, Helmet } from "react-helmet-async";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import LoginPage from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check session variable
    const userSession = sessionStorage.getItem("authToken");
    setIsAuthenticated(!!userSession); // Convert to boolean
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Organization Financial Tracker</title>
        <meta
          name="description"
          content="Track your organization's finances efficiently."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route
            path="/login"
            element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
          />

          {/* Protected Route */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
            }
          />

          {/* Redirect Unknown Routes */}
          <Route
            path="*"
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
            }
          />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}
