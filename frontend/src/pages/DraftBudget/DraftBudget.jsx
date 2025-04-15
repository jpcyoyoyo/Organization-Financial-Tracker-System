import { useOutletContext } from "react-router-dom";
import MainContent from "../../components/ui/MainContent";

export default function DraftBudget() {
  const { isCollapsed } = useOutletContext();

  return (
    <MainContent
      titletab="Draft Budgets - Organization Financial Tracker"
      contentName="DRART BUDGETS"
      textFormat="text-3xl pt-1"
    ></MainContent>
  );
}
