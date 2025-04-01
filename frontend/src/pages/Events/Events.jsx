import { useOutletContext } from "react-router-dom";
import MainContent from "../../components/ui/MainContent";

export default function Events() {
  const { isCollapsed } = useOutletContext();

  return (
    <MainContent
      titletab="Events - Organization Financial Tracker"
      contentName="EVENTS"
      textFormat="text-3xl pt-1"
    ></MainContent>
  );
}
