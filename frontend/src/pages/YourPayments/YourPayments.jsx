import { Helmet } from "react-helmet-async";

export default function YourPayments() {
  return (
    <div className="p-4">
      <Helmet>
        <title>Your Payments - Organization Financial Tracker</title>
      </Helmet>
      <h1 className="text-5xl font-bold mt-2 ml-6">YOUR PAYMENTS</h1>
    </div>
  );
}
