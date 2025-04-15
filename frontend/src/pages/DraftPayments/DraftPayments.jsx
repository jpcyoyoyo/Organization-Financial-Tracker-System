import { useOutletContext } from "react-router-dom";
import MainContent from "../../components/ui/MainContent";

export default function DraftPayments() {
  const { isCollapsed } = useOutletContext();

  return (
    <MainContent
      titletab="Draft Payments - Organization Financial Tracker"
      contentName="DRART PAYMENTS"
      textFormat="text-3xl pt-1"
    ></MainContent>
  );
}
