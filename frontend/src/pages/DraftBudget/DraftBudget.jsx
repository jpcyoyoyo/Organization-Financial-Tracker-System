import { useOutletContext } from "react-router-dom";
import MainContent from "../../components/ui/maincontent";
import SearchListCard from "../../components/ui/searchlistcard";
import { useContext } from "react";
import { IpContext } from "../../context/IpContext";
import CreateDraftBudgetModal from "./CreateDraftBudgetModal";
import EditDraftBudgetModal from "./EditDraftBudgetModal";
import ViewDraftBudgetModal from "./ViewDraftBudgetModal";

export default function DraftBudget() {
  const { isCollapsed } = useOutletContext();
  const ip = useContext(IpContext);

  const publishedListConfig = {
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
        key: "Date Created",
        name: "created_at",
        mobile: true,
        default: "Not Yet Issued",
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
      titletab="Draft Budgets - Organization Financial Tracker"
      contentName="DRAFT BUDGETS"
      textFormat="text-3xl pt-1"
      showContentNameMobileOnly={true}
    >
      <div className="space-y-6">
        <SearchListCard
          cardName="BUDGET DRAFTS"
          listConfig={listConfig}
          fetchUrl={`${ip}/fetch-draft-budgets`}
          isCollapsed={isCollapsed}
          testMode={false}
          testData={testData}
          createModal={CreateDraftBudgetModal}
          viewModal={EditDraftBudgetModal}
          itemsPerPage={3}
          cardSize="h-87 md:h-56"
          mobileCardSize="h-85"
        />
        <SearchListCard
          cardName="PENDING BUDGET APPROVALS"
          listConfig={listConfig}
          fetchUrl={`${ip}/fetch-pending-budget-approvals`}
          isCollapsed={isCollapsed}
          testMode={false}
          testData={testData}
          viewModal={ViewDraftBudgetModal}
          itemsPerPage={2}
          cardSize="h-87 md:h-37"
          mobileCardSize="h-56.5"
        />
        <SearchListCard
          cardName="PUBLISHED BUDGETS"
          listConfig={publishedListConfig}
          fetchUrl={`${ip}/fetch-published-budgets`}
          isCollapsed={isCollapsed}
          testMode={false}
          testData={testData}
          viewModal={ViewDraftBudgetModal}
        />
      </div>
    </MainContent>
  );
}
