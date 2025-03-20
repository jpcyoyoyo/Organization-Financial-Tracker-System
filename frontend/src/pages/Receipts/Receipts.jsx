import { Helmet } from "react-helmet-async";

export default function Receipts() {
  return (
    <div className="p-4">
      <Helmet>
        <title>Receipts - Organization Financial Tracker</title>
      </Helmet>
      <h1 className="text-5xl font-bold mt-2 ml-6">RECEIPTS</h1>
    </div>
  );
}
