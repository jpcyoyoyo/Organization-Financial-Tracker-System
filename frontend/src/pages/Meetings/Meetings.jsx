import { useOutletContext } from "react-router-dom";
import MainContent from "../../components/ui/MainContent";

export default function Meetings() {
  const { isCollapsed } = useOutletContext();

  return (
    <MainContent
      titletab="Meetings - Organization Financial Tracker"
      contentName="MEETINGS"
      textFormat="text-3xl pt-1"
    ></MainContent>
  );
}
