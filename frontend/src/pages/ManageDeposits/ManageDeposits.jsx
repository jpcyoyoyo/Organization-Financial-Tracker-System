import { useOutletContext } from "react-router-dom";
import MainContent from "../../components/ui/maincontent";
import SearchListCard from "../../components/ui/searchlistcard";
import { useContext } from "react";
import CreateDepositModal from "./CreateDepositModal";
import ViewManageDepositModal from "./ViewManageDepositModal";
import UpdateDepositModal from "./UpdateDepositModal";
import DeleteDepositModal from "./DeleteDepositModal";
import { IpContext } from "../../context/IpContext";

const listConfig = {
  createButton: {
    iconUrl: "src/assets/react.svg",
    name: "Create Deposit",
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
      w_expand: "w-7/15 lg:w-4/12",
      w_collapse: "md:w-2/7 lg:lg:w-2/7",
      key: "Date Issued",
      name: "issued_at",
      mobile: true,
      default: "Not Yet Issued",
    },
    {
      type: "single",
      w_expand: "w-7/15 lg:w-2/12",
      w_collapse: "md:w-2/7 lg:lg:w-1/7",
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
      name: "DEPOSIT-20250504-00001",
      amount: "$1,000",
      issued_at: "Not Yet Issued",
      status: "Draft",
    },
    {
      id: 2,
      name: "DEPOSIT-20250504-00002",
      amount: "$2,000",
      issued_at: "2021-01-01",
      status: "Issued",
    },
    {
      id: 3,
      name: "DEPOSIT-20250504-00003",
      amount: "$1,000",
      issued_at: "2021-01-01",
      status: "Issued",
    },
    {
      id: 4,
      name: "DEPOSIT-20250504-00004",
      amount: "$2,000",
      issued_at: "2021-01-01",
      status: "Issued",
    },
    {
      id: 5,
      name: "DEPOSIT-20250504-00005",
      amount: "$1,000",
      issued_at: "2021-01-01",
      status: "Issued",
    },
    {
      id: 6,
      name: "DEPOSIT-20250504-00006",
      amount: "$1,000",
      issued_at: "2021-01-01",
      status: "Issued",
    },
  ],
  years: [2021],
};

export default function ManageDeposits() {
  const { isCollapsed } = useOutletContext();
  const ip = useContext(IpContext);

  return (
    <MainContent
      titletab="Manage Deposits - Organization Financial Tracker"
      contentName="MANAGE DEPOSITS"
      textFormat="text-3xl pt-1"
      showContentNameMobileOnly={true}
    >
      <SearchListCard
        cardName="DEPOSIT MANAGEMENT"
        listConfig={listConfig}
        fetchUrl={`${ip}/fetch-manage-deposits`}
        isCollapsed={isCollapsed}
        testMode={false}
        testData={testData}
        createModal={CreateDepositModal}
        viewModal={ViewManageDepositModal}
        updateModal={UpdateDepositModal}
        deleteModal={DeleteDepositModal}
      />
    </MainContent>
  );
}
