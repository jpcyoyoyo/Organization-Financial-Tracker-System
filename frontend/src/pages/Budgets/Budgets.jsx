import { Helmet } from "react-helmet-async";

export default function Budgets() {
  return (
    <div className="p-4">
      <Helmet>
        <title>Budgets - Organization Financial Tracker</title>
      </Helmet>
      <h1 className="text-5xl font-bold mt-2 ml-6">BUDGETS</h1>
    </div>
  );
}
