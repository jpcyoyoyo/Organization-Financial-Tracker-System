import { useOutletContext } from "react-router-dom";
import MainContent from "../../components/ui/MainContent";

export default function ManageExpenses() {
  const { isCollapsed } = useOutletContext();

  return (
    <MainContent
      titletab="Manage Expenses - Organization Financial Tracker"
      contentName="MANAGE EXPENSES"
      textFormat="text-3xl pt-1"
    ></MainContent>
  );
}
