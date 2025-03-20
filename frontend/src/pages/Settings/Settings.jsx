import { Helmet } from "react-helmet-async";

export default function Settings() {
  return (
    <div className="p-4">
      <Helmet>
        <title>Settings - Organization Financial Tracker</title>
      </Helmet>
      <h1 className="text-5xl font-bold mt-2 ml-6">SETTINGS</h1>
    </div>
  );
}
