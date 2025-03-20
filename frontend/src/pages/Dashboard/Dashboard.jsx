import { Helmet } from "react-helmet-async";

export default function Dashboard() {
  return (
    <div className="p-4">
      <Helmet>
        <title>Dashboard - Organization Financial Tracker</title>
      </Helmet>
      <h1 className="text-5xl font-bold mt-2 ml-6">DASHBOARD</h1>
    </div>
  );
}
