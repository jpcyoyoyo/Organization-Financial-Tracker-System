import { Helmet } from "react-helmet-async";

export default function YourCollections() {
  return (
    <div className="p-4">
      <Helmet>
        <title>Your Collections - Organization Financial Tracker</title>
      </Helmet>
      <h1 className="text-5xl font-bold mt-2 ml-6">YOUR COLLECTIONS</h1>
    </div>
  );
}
// Compare this snippet from frontend/src/pages/YourCollections/YourCollections.jsx:
// import { Helmet } from "react-helmet-async";
