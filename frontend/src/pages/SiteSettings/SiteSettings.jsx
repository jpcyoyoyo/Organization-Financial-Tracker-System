import { Helmet } from "react-helmet-async";

export default function SiteSettings() {
  return (
    <div className="p-4">
      <Helmet>
        <title>Site Settings - Organization Financial Tracker</title>
      </Helmet>
      <h1 className="text-5xl font-bold mt-2 ml-6">SITE SETTINGS</h1>
    </div>
  );
}
