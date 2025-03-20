import { Helmet } from "react-helmet-async";

export default function DraftBudget() {
  return (
    <div className="p-4">
      <Helmet>
        <title>Draft Budget - Organization Financial Tracker</title>
      </Helmet>
      <h1 className="text-5xl font-bold mt-2 ml-6">DRAFT BUDGET</h1>
    </div>
  );
}
