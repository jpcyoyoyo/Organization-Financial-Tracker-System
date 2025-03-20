import { Helmet } from "react-helmet-async";

export default function UserManagement() {
  return (
    <div className="p-4">
      <Helmet>
        <title>User Management - Organization Financial Tracker</title>
      </Helmet>
      <h1 className="text-5xl font-bold mt-2 ml-6">USER MANAGEMENT</h1>
    </div>
  );
}
