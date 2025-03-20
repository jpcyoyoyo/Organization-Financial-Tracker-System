import { Helmet } from "react-helmet-async";

export default function RequestAnnouncement() {
  return (
    <div className="p-4">
      <Helmet>
        <title>Request Announcement - Organization Financial Tracker</title>
      </Helmet>
      <h1 className="text-5xl font-bold mt-2 ml-6">REQUEST ANNOUNCEMENT</h1>
    </div>
  );
}
