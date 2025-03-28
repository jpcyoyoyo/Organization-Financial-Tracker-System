import { useOutletContext } from "react-router-dom";
import MainContent from "../../components/ui/MainContent";
import SearchListCard from "../../components/ui/SearchListCard";
import { motion } from "framer-motion";

export default function Budgets() {
  const { isCollapsed } = useOutletContext();

  const listConfig = {
    columns: [
      { type: "icon", iconUrl: "/assets/icon.png" },
      {
        type: "double",
        w_expand: "w-full md:w-8/15 lg:w-9/12",
        w_collapse: "w-full md:w-5/7 lg:w-4/5",
        variables: [
          { key: "", name: "budgetName" },
          { key: "Total Budget:", name: "totalBudget" },
        ],
      },
      {
        type: "single",
        w_expand: "w-7/15 lg:w-3/12",
        w_collapse: "md:w-2/7 lg:lg:w-1/5",
        key: "Date Approved:",
        name: "dateApproved",
      },
    ],
  };

  return (
    <MainContent
      titletab="Budgets - Organization Financial Tracker"
      contentName="BUDGETS"
    >
      <SearchListCard
        cardName="APPROVED BUDGETS"
        listConfig={listConfig}
        fetchUrl="http://your-api.com/approved-budgets"
        isCollapsed={isCollapsed}
      />
    </MainContent>
  );
}
