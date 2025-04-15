// App.jsx
import { HelmetProvider, Helmet } from "react-helmet-async";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import IpProvider from "./context/IpProvider";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import LoginPage from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Budgets from "./pages/Budgets/Budgets";
import Reports from "./pages/Reports/Reports";
import Settings from "./pages/Settings/Settings";
import HomeLayout from "./pages/Home/Home";
import Logout from "./pages/Logout/Logout";
import Deposits from "./pages/Deposits/Deposits";
import Expenses from "./pages/Expenses/Expenses";
import Meetings from "./pages/Meetings/Meetings";
import YourPayments from "./pages/YourPayments/YourPayments";
import YourCollections from "./pages/YourCollections/YourCollections";
import PlannedBudgets from "./pages/PlannedBudgets/PlannedBudgets";
import AnnouncementRequests from "./pages/AnnouncementRequests/AnnouncementRequests";
import AuditReports from "./pages/AuditReports/AuditReports";
import FinancialStatements from "./pages/FinancialStatements/FinancialStatements";
import OrganizationProperties from "./pages/OrganizationProperties/OrganizationProperties";
import Receipts from "./pages/Receipts/Receipts";
import DraftBudget from "./pages/DraftBudget/DraftBudget";
import DraftPayments from "./pages/DraftPayments/DraftPayments";
import ManageDeposits from "./pages/ManageDeposits/ManageDeposits";
import ManageExpenses from "./pages/ManageExpenses/ManageExpenses";
import ManageFinancialReports from "./pages/ManageFinancialReports/ManageFinancialReports";
import Approvals from "./pages/Approvals/Approvals";
import UserManagement from "./pages/UserManagement/UserManagement";
import Logs from "./pages/Logs/Logs";
import SiteSettings from "./pages/SiteSettings/SiteSettings";
import RequestAnnouncement from "./pages/RequestAnnouncement/RequestAnnouncement";
import ManageMeetings from "./pages/ManageMeetings/ManageMeetings";
import OrganizationDocuments from "./pages/OrganizationDocuments/OrganizationDocuments";
import Reciepts from "./pages/Receipts/Receipts";
import Announcements from "./pages/Announcements/Announcements";
import Events from "./pages/Events/Events";
import YourAttendances from "./pages/YourAttendances/YourAttendances";
import Sections from "./pages/Sections/Sections";

// Import the sidebar configuration (adjust the path as needed)
import sidebarConfig from "./data/sidebarConfig.json";

// Helper: Build allowed routes from sidebar configuration based on the user's designation.
function getAllowedRoutes(designation) {
  const allowed = new Set();

  // Add all topLevelTabs routes
  sidebarConfig.topLevelTabs.forEach((tab) => allowed.add(tab.path));

  // Iterate groups
  Object.entries(sidebarConfig.groups).forEach(([groupName, groupData]) => {
    if (groupName === "Your Obligations") {
      // groupData is an object with keys like "default", "Representative", etc.
      if (groupData[designation]) {
        groupData[designation].forEach((item) => allowed.add(item.path));
      } else if (groupData["default"]) {
        groupData["default"].forEach((item) => allowed.add(item.path));
      }
    } else {
      // Other groups: assume groupData is an array
      if (Array.isArray(groupData)) {
        groupData.forEach((item) => allowed.add(item.path));
      }
    }
  });
  return Array.from(allowed);
}

// ProtectedRoute component: If the current route is not allowed, redirect to dashboard.
function ProtectedRoute({ children, allowedRoutes }) {
  const location = useLocation();
  if (!allowedRoutes.includes(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoutes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [designation, setDesignation] = useState("");

  useEffect(() => {
    const userSession = sessionStorage.getItem("authToken");
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setDesignation(user.designation || "");
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    setIsAuthenticated(userSession ? true : false);
  }, []);

  // Get allowed routes based on user's designation
  const allowedRoutes = getAllowedRoutes(designation);

  return (
    <HelmetProvider>
      <IpProvider>
        <Helmet>
          <title>Organization Financial Tracker</title>
          <meta
            name="description"
            content="Track your organization's finances efficiently."
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Helmet>
        {isAuthenticated === null ? (
          <div>Loading...</div>
        ) : (
          <Router>
            <Routes>
              <Route
                path="/login"
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <LoginPage setIsAuthenticated={setIsAuthenticated} />
                  )
                }
              />
              <Route
                path="/logout"
                element={<Logout setIsAuthenticated={setIsAuthenticated} />}
              />
              {/* Protected Routes */}
              {isAuthenticated ? (
                <Route path="/" element={<HomeLayout />}>
                  <Route
                    index
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="dashboard"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="meetings"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <Meetings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="announcements"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <Announcements />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="events"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <Events />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="budgets"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <Budgets />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="deposits"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <Deposits />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="expenses"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <Expenses />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="reports"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <Reports />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="settings"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="your-payments"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <YourPayments />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="your-collections"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <YourCollections />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="your-attendances"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <YourAttendances />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="planned-budgets"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <PlannedBudgets />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="announcement-requests"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <AnnouncementRequests />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="audit-reports"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <AuditReports />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="financial-statements"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <FinancialStatements />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="organization-properties"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <OrganizationProperties />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="receipts"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <Receipts />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="draft-budget"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <DraftBudget />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="draft-payments"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <DraftPayments />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="manage-deposits"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <ManageDeposits />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="manage-expenses"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <ManageExpenses />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="manage-financial-reports"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <ManageFinancialReports />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="approvals"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <Approvals />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="user-management"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <UserManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="logs"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <Logs />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="site-settings"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <SiteSettings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="request-announcement"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <RequestAnnouncement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="manage-meetings"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <ManageMeetings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="organization-docs"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <OrganizationDocuments />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="reciepts"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <Reciepts />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="sections"
                    element={
                      <ProtectedRoute allowedRoutes={allowedRoutes}>
                        <Sections />
                      </ProtectedRoute>
                    }
                  />
                </Route>
              ) : (
                <Route path="*" element={<Navigate to="/login" replace />} />
              )}
            </Routes>
          </Router>
        )}
      </IpProvider>
    </HelmetProvider>
  );
}
