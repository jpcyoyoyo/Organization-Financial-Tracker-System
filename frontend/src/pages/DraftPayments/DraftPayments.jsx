import { Helmet } from "react-helmet-async";

export default function DraftPayments() {
  return (
    <div className="p-4">
      <Helmet>
        <title>Draft Payments - Organization Financial Tracker</title>
      </Helmet>
      <h1 className="text-5xl font-bold mt-2 ml-6">DRAFT PAYMENTS</h1>
    </div>
  );
}
