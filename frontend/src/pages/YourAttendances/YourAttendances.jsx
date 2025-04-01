import { useOutletContext } from "react-router-dom";
import MainContent from "../../components/ui/MainContent";

export default function YourAttendances() {
  const { isCollapsed } = useOutletContext();

  return (
    <MainContent
      titletab="Your Attendances - Organization Financial Tracker"
      contentName="YOUR ATTENDANCES"
    ></MainContent>
  );
}
