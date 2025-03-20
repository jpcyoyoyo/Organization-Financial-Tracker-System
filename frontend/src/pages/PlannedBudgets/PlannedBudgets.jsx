import { Helmet } from "react-helmet-async";

export default function PlannedBudgets() {
  return (
    <div className="p-4">
      <Helmet>
        <title>Planned Budgets - Organization Financial Tracker</title>
      </Helmet>
      <h1 className="text-5xl font-bold mt-2 ml-6">PLANNED BUDGETS</h1>
    </div>
  );
}
