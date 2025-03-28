// App.jsx
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

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const userSession = sessionStorage.getItem("authToken");
    setIsAuthenticated(userSession ? true : false);
  }, []); // Only run on mount

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

      {isAuthenticated === null ? (
        <div>Loading...</div> // Add a loading state to prevent unnecessary renders
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
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="budgets" element={<Budgets />} />
                <Route path="deposits" element={<Deposits />} />
                <Route path="expenses" element={<Expenses />} />
                <Route path="meetings" element={<Meetings />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
                <Route path="your-payments" element={<YourPayments />} />
                <Route path="your-collections" element={<YourCollections />} />
                <Route path="planned-budgets" element={<PlannedBudgets />} />
                <Route
                  path="announcement-requests"
                  element={<AnnouncementRequests />}
                />
                <Route path="audit-reports" element={<AuditReports />} />
                <Route
                  path="financial-statements"
                  element={<FinancialStatements />}
                />
                <Route
                  path="organization-properties"
                  element={<OrganizationProperties />}
                />
                <Route path="receipts" element={<Receipts />} />
                <Route path="draft-budget" element={<DraftBudget />} />
                <Route path="draft-payments" element={<DraftPayments />} />
                <Route path="manage-deposits" element={<ManageDeposits />} />
                <Route path="manage-expenses" element={<ManageExpenses />} />
                <Route
                  path="manage-financial-reports"
                  element={<ManageFinancialReports />}
                />
                <Route path="approvals" element={<Approvals />} />
                <Route path="user-management" element={<UserManagement />} />
                <Route path="logs" element={<Logs />} />
                <Route path="site-settings" element={<SiteSettings />} />
                <Route
                  path="request-announcement"
                  element={<RequestAnnouncement />}
                />
                <Route path="manage-meetings" element={<ManageMeetings />} />
                <Route
                  path="organization-docs"
                  element={<OrganizationDocuments />}
                />
                <Route path="reciepts" element={<Reciepts />} />
              </Route>
            ) : (
              <Route path="*" element={<Navigate to="/login" replace />} />
            )}
          </Routes>
        </Router>
      )}
    </HelmetProvider>
  );
}
