import { useOutletContext } from "react-router-dom";
import MainContent from "../../components/ui/MainContent";

export default function AnnouncementRequests() {
  const { isCollapsed } = useOutletContext();

  return (
    <MainContent
      titletab="Announcement Requests - Organization Financial Tracker"
      contentName="ANNOUUMENT REQUESTS"
      textFormat="text-3xl pt-1"
    ></MainContent>
  );
}
