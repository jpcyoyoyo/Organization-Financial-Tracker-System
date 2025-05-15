import { useOutletContext } from "react-router-dom";
import MainContent from "../../components/ui/maincontent";
import SearchListCard from "../../components/ui/searchlistcard";
import { useContext } from "react";
import { IpContext } from "../../context/IpContext";
import DecideApprovalModal from "./DecideApprovalModal";

export default function Approvals() {
  const { isCollapsed } = useOutletContext();
  const ip = useContext(IpContext);

  const pendingListConfig = {
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
            name: "relating_id",
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
        key: "Date Requested",
        name: "created_at",
        mobile: true,
      },
      {
        type: "single",
        w_expand: "w-7/15 lg:w-3/12",
        w_collapse: "md:w-2/7 lg:w-2/7",
        key: "Decision",
        name: "decision",
        mobile: true,
        default: "Pending",
      },
    ],
  };

  const decidedListConfig = {
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
            name: "relating_id",
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
        key: "Date Decision Made",
        name: "updated_at",
        mobile: true,
      },
      {
        type: "single",
        w_expand: "w-7/15 lg:w-3/12",
        w_collapse: "md:w-2/7 lg:w-2/7",
        key: "Decision",
        name: "decision",
        mobile: true,
        default: "Pending",
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
      titletab="Approvals - Organization Financial Tracker"
      contentName="APPROVALS"
      textFormat="text-3xl pt-1"
      showContentNameMobileOnly={true}
    >
      <div className="space-y-6">
        <SearchListCard
          cardName="BUDGET APPROVALS"
          listConfig={pendingListConfig}
          fetchUrl={`${ip}/fetch-budget-approvals`}
          isCollapsed={isCollapsed}
          testMode={false}
          testData={testData}
          viewModal={DecideApprovalModal}
          itemsPerPage={1}
          cardSize="h-87 md:h-18"
          mobileCardSize="h-85"
        />
        <SearchListCard
          cardName="PAYMENT APPROVALS"
          listConfig={pendingListConfig}
          fetchUrl={`${ip}/fetch-payment-approvals`}
          isCollapsed={isCollapsed}
          testMode={false}
          testData={testData}
          viewModal={DecideApprovalModal}
          itemsPerPage={2}
          cardSize="h-87 md:h-37"
          mobileCardSize="h-56.5"
        />
        <SearchListCard
          cardName="ANNOUNCEMENT APPROVALS"
          listConfig={pendingListConfig}
          fetchUrl={`${ip}/fetch-announcement-approvals`}
          isCollapsed={isCollapsed}
          testMode={false}
          testData={testData}
          viewModal={DecideApprovalModal}
          itemsPerPage={3}
          cardSize="h-87 md:h-56"
          mobileCardSize="h-85"
        />
        <SearchListCard
          cardName="DECIDED APPROVALS"
          listConfig={decidedListConfig}
          fetchUrl={`${ip}/fetch-decided-approvals`}
          isCollapsed={isCollapsed}
          testMode={false}
          testData={testData}
        />
      </div>
    </MainContent>
  );
}
