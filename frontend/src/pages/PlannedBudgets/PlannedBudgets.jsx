import { useOutletContext } from "react-router-dom";
import MainContent from "../../components/ui/maincontent";
import SearchListCard from "../../components/ui/searchlistcard";
import { useContext } from "react";
import { IpContext } from "../../context/IpContext";
import ViewPlannedBudgetModal from "./ViewPLannedBudgetModal";

export default function PlannedBudgets() {
  const { isCollapsed } = useOutletContext();
  const ip = useContext(IpContext);

  const listConfig = {
    createButton: {
      iconUrl: "src/assets/react.svg",
      name: "Create Budget",
    },
    columns: [
      { type: "hidden", name: "id" },
      { type: "icon", iconUrl: "src/assets/react.svg" },
      {
        type: "double",
        w_expand: "w-full md:w-8/15 lg:w-6/12",
        w_collapse: "w-full md:w-5/7 lg:w-4/7",
        variables: [
          {
            key: "",
            name: "name",
            mobile: true,
            nameStyle: "font-semibold text-base",
          },
          {
            key: "",
            name: "amount",
            mobile: true,
            nameStyle: "font-normal text-sm",
          },
        ],
        mobile: true,
      },
      {
        type: "single",
        w_expand: "w-7/15 lg:w-3/12",
        w_collapse: "md:w-2/7 lg:lg:w-2/7",
        key: "Date Updated",
        name: "updated_at",
        mobile: true,
      },
      {
        type: "single",
        w_expand: "w-7/15 lg:w-3/12",
        w_collapse: "md:w-2/7 lg:w-2/7",
        key: "Status",
        name: "status",
        mobile: true,
        default: "Status",
      },
    ],
  };

  const testData = {
    data: [
      {
        id: 1,
        name: "Draft Budget 1",
        amount: "$1,000",
        created_at: "2021-01-01",
      },
      {
        id: 2,
        name: "Draft Budget 2",
        amount: "$2,000",
        created_at: "2021-02-01",
      },
      {
        id: 3,
        name: "Draft Budget 3",
        amount: "$1,000",
        created_at: "2021-03-01",
      },
      {
        id: 4,
        name: "Draft Budget 4",
        amount: "$2,000",
        created_at: "2021-04-01",
      },
      {
        id: 5,
        name: "Draft Budget 5",
        amount: "$1,000",
        created_at: "2021-05-01",
      },
      {
        id: 6,
        name: "Draft Budget 6",
        amount: "$1,000",
        created_at: "2021-06-01",
      },
    ],
    years: [2021, 2022, 2023],
  };

  return (
    <MainContent
      titletab="Planned Budgets - Organization Financial Tracker"
      contentName="PLANNED BUDGETS"
      textFormat="text-3xl pt-1"
      showContentNameMobileOnly={true}
    >
      <div className="space-y-6">
        <SearchListCard
          cardName="PLANNED BUDGET DRAFTS"
          listConfig={listConfig}
          fetchUrl={`${ip}/fetch-planned-budgets`}
          isCollapsed={isCollapsed}
          testMode={false}
          testData={testData}
          viewModal={ViewPlannedBudgetModal}
        />
      </div>
    </MainContent>
  );
}
