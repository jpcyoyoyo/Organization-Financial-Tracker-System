import { Helmet } from "react-helmet-async";

export default function ManageDeposits() {
  return (
    <div className="p-4">
      <Helmet>
        <title>Manage Deposits - Organization Financial Tracker</title>
      </Helmet>
      <h1 className="text-5xl font-bold mt-2 ml-6">MANAGE DEPOSITS</h1>
    </div>
  );
}
