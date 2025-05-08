import { useOutletContext } from "react-router-dom";
import MainContent from "../../components/ui/maincontent";
import SearchTableCard from "../../components/ui/searchtablecard";
import ViewManageFinancialGroupingModal from "./ViewManageFinancialGroupingModal";
import CreateDepositGroupingModal from "./CreateDepositGroupingModal";
import CreateExpenseGroupingModal from "./CreateExpenseGroupingModal";
import UpdateManageFinancialGroupingModal from "./UpdateManageFinancialGroupingModal";
import { useContext } from "react";
import { IpContext } from "../../context/IpContext";

const tableDepositConfig = {
  createButton: {
    iconUrl: "src/assets/react.svg",
    name: "Create Deposit Source",
  },
  columns: [
    { type: "icon", iconUrl: "src/assets/react.svg" },
    {
      type: "data",
      header: "DATE CREATED",
      w_expand: "w-7/15 lg:w-5/14",
      w_collapse: "w-2/5 sm:w-2/5 md:w-2/6 lg:w-5/14",
      alignment: "justify-center",
      text_size: "text-sm md:text-base",
      mobile: true,
      name: "created_at",
    },
    {
      type: "data",
      header: "NAME",
      w_expand: "w-1/2 lg:w-5/14",
      w_collapse: "w-3/5 sm:w-3/5 md:w-2/6 lg:w-5/14",
      alignment: "font-bold justify-center",
      text_size: "text-sm md:text-base",
      mobile: true,
      name: "name",
    },
    {
      type: "data",
      header: "NO. OF RECORDS",
      w_expand: "hidden lg:flex w-7/15 lg:w-4/14",
      w_collapse: "hidden md:flex md:w-2/6 lg:w-4/14",
      alignment: "justify-center",
      mobile: false,
      text_size: "text-sm md:text-base",
      name: "record_no",
    },
    { type: "hidden", name: "id" },
    { type: "action", name: "View", iconUrl: "src/assets/react.svg" },
  ],
};

const tableExpenseConfig = {
  createButton: {
    iconUrl: "src/assets/react.svg",
    name: "Create Expense Category",
  },
  columns: [
    { type: "icon", iconUrl: "src/assets/react.svg" },
    {
      type: "data",
      header: "DATE CREATED",
      w_expand: "w-7/15 lg:w-5/14",
      w_collapse: "w-2/5 sm:w-2/5 md:w-2/6 lg:w-5/14",
      alignment: "justify-center",
      text_size: "text-sm md:text-base",
      mobile: true,
      name: "created_at",
    },
    {
      type: "data",
      header: "NAME",
      w_expand: "w-1/2 lg:w-5/14",
      w_collapse: "w-3/5 sm:w-3/5 md:w-2/6 lg:w-5/14",
      alignment: "font-bold justify-center",
      text_size: "text-sm md:text-base",
      mobile: true,
      name: "name",
    },
    {
      type: "data",
      header: "NO. OF RECORDS",
      w_expand: "hidden lg:flex w-7/15 lg:w-4/14",
      w_collapse: "hidden md:flex md:w-2/6 lg:w-4/14",
      alignment: "justify-center",
      mobile: false,
      text_size: "text-sm md:text-base",
      name: "record_no",
    },
    { type: "hidden", name: "id" },
    { type: "action", name: "View", iconUrl: "src/assets/react.svg" },
  ],
};

const userData = JSON.stringify(sessionStorage.getItem("user"));
const itemsPerPage = 4;

export default function ManageFinancialGrouping() {
  const { isCollapsed } = useOutletContext();
  const ip = useContext(IpContext);

  const testData = {
    data: [
      {
        id: 1,
        created_at: "2023-08-01",
        name: "Name of the Group",
        record_no: "2",
      },
      {
        id: 2,
        created_at: "2023-07-15",
        name: "Name of the Group",
        record_no: "2",
      },
      {
        id: 3,
        created_at: "2023-08-01",
        name: "Name of the Group",
        record_no: "2",
      },
      {
        id: 4,
        created_at: "2023-07-15",
        name: "Name of the Group",
        record_no: "2",
      },
      {
        id: 5,
        created_at: "2023-08-01",
        name: "Name of the Group",
        record_no: "2",
      },
      {
        id: 6,
        created_at: "2023-07-15",
        name: "Name of the Group",
        record_no: "2",
      },
      {
        id: 7,
        created_at: "2023-08-01",
        name: "Name of the Group",
        record_no: "2",
      },
      {
        id: 8,
        created_at: "2023-07-15",
        name: "Name of the Group",
        record_no: "2",
      },
    ],
    years: [2021, 2022, 2023],
  };

  return (
    <MainContent
      titletab="Manage Deposits - Organization Financial Tracker"
      contentName="FINANCIAL GROUPINGS"
      textFormat="text-[22px] sm:text-3xl pt-2 sm:pt-1"
      showContentNameMobileOnly={true}
    >
      <div className="space-y-6">
        <SearchTableCard
          cardName="DEPOSIT SOURCES"
          userData={userData}
          tableConfig={tableDepositConfig}
          fetchUrl={`${ip}/fetch-financial-groupings-deposit`}
          isCollapsed={isCollapsed}
          viewModal={ViewManageFinancialGroupingModal}
          createModal={CreateDepositGroupingModal}
          updateModal={UpdateManageFinancialGroupingModal}
          testMode={false}
          testData={testData}
          itemsPerPage={itemsPerPage}
          cardSize="h-65"
          mobileCardSize="h-65 sm:h-73"
        />
        <SearchTableCard
          cardName="EXPENSE CATEGORIES"
          userData={userData}
          tableConfig={tableExpenseConfig}
          fetchUrl={`${ip}/fetch-financial-groupings-expense`}
          isCollapsed={isCollapsed}
          viewModal={ViewManageFinancialGroupingModal}
          createModal={CreateExpenseGroupingModal}
          updateModal={UpdateManageFinancialGroupingModal}
          testMode={false}
          testData={testData}
          itemsPerPage={itemsPerPage}
          cardSize="h-65"
          mobileCardSize="h-65 sm:h-73"
        />
      </div>
    </MainContent>
  );
}
