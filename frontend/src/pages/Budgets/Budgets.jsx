import { useOutletContext } from "react-router-dom";
import MainContent from "../../components/ui/maincontent";
import SearchListCard from "../../components/ui/searchlistcard";
import { useContext } from "react";
import { IpContext } from "../../context/IpContext";
import ViewBudgetModal from "./ViewBudgetModal";

export default function Budgets() {
  const { isCollapsed } = useOutletContext();
  const ip = useContext(IpContext);

  const listConfig = {
    columns: [
      { type: "hidden", name: "id" },
      { type: "icon", iconUrl: "src/assets/react.svg" },
      {
        type: "double",
        w_expand: "w-full md:w-8/15 lg:w-9/12",
        w_collapse: "w-full md:w-5/7 lg:w-4/5",
        variables: [
          { key: "", name: "name", mobile: true },
          { key: "Total Budget", name: "amount", mobile: true },
        ],
        mobile: true,
      },
      {
        type: "single",
        w_expand: "w-7/15 lg:w-3/12",
        w_collapse: "md:w-2/7 lg:w-1/5",
        key: "Date Published",
        name: "published_at",
        mobile: true,
      },
    ],
  };

  const testData = {
    data: [
      {
        id: 1,
        budgetName: "Test Budget 1",
        totalBudget: "$1,000",
        dateApproved: "2021-01-01",
      },
      {
        id: 2,
        budgetName: "Test Budget 2",
        totalBudget: "$2,000",
        dateApproved: "2021-02-01",
      },
      {
        id: 3,
        budgetName: "Test Budget 3",
        totalBudget: "$1,000",
        dateApproved: "2021-03-01",
      },
      {
        id: 4,
        budgetName: "Test Budget 4",
        totalBudget: "$2,000",
        dateApproved: "2021-04-01",
      },
      {
        id: 5,
        budgetName: "Test Budget 5",
        totalBudget: "$1,000",
        dateApproved: "2021-05-01",
      },
      {
        id: 6,
        budgetName: "Test Budget 6",
        totalBudget: "$1,000",
        dateApproved: "2021-06-01",
      },
    ],
    years: [2021, 2022, 2023],
  };

  return (
    <MainContent
      titletab="Budgets - Organization Financial Tracker"
      contentName="BUDGETS"
      textFormat="text-3xl pt-1"
      showContentNameMobileOnly={true}
    >
      <SearchListCard
        cardName="PUBLISHED BUDGETS"
        listConfig={listConfig}
        fetchUrl={`${ip}/fetch-published-budgets`}
        isCollapsed={isCollapsed}
        testMode={false}
        testData={testData}
        viewModal={ViewBudgetModal}
      />
    </MainContent>
  );
}
