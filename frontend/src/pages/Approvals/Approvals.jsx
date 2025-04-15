import { useOutletContext } from "react-router-dom";
import MainContent from "../../components/ui/MainContent";

export default function Approvals() {
  const { isCollapsed } = useOutletContext();

  return (
    <MainContent
      titletab="Approvals - Organization Financial Tracker"
      contentName="APPROVALS"
      textFormat="text-3xl pt-1"
    ></MainContent>
  );
}
