import { Helmet } from "react-helmet-async";

export default function ManageExpenses() {
  return (
    <div className="p-4">
      <Helmet>
        <title>Manage Expenses - Organization Financial Tracker</title>
      </Helmet>
      <h1 className="text-5xl font-bold mt-2 ml-6">MANAGE EXPENSES</h1>
    </div>
  );
}
