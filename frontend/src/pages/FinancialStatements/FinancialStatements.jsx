import { Helmet } from "react-helmet-async";

export default function FinancialStatements() {
  return (
    <div className="p-4">
      <Helmet>
        <title>Financial Statements - Organization Financial Tracker</title>
      </Helmet>
      <h1 className="text-5xl font-bold mt-2 ml-6">FINANCIAL STATEMENTS</h1>
    </div>
  );
}
