import { useOutletContext } from "react-router-dom";
import MainContent from "../../components/ui/maincontent";
import SearchTableCard from "../../components/ui/searchtablecard";
import ViewDepositModal from "./ViewDepositModal";
import { useContext } from "react";
import { IpContext } from "../../context/IpContext";

const tableConfig = {
  createButton: { iconUrl: "src/assets/react.svg", name: "Deposit" },
  columns: [
    { type: "icon", iconUrl: "src/assets/react.svg" },
    {
      type: "data",
      header: "AMOUNT",
      w_expand: "w-7/15 lg:w-4/14",
      w_collapse: "w-2/5 sm:w-2/5 md:w-2/6 lg:w-4/14",
      alignment: "justify-start",
      text_size: "font-bold sm:text-lg md:text-xl xl:text-2xl xl:pl-3",
      mobile: true,
      name: "amount",
    },
    {
      type: "data",
      header: "DATE DEPOSIT",
      w_expand: "w-1/2 lg:w-5/14",
      w_collapse: "w-3/5 sm:w-3/5 md:w-2/6 lg:w-5/14",
      alignment: "justify-center",
      text_size: "text-sm md:text-base",
      mobile: true,
      name: "issued_at",
    },
    {
      type: "data",
      header: "SOURCE",
      w_expand: "hidden lg:flex w-7/15 lg:w-5/14",
      w_collapse: "hidden md:flex md:w-2/6 lg:w-5/14",
      alignment: "justify-center",
      mobile: true,
      text_size: "text-sm md:text-base",
      name: "source_name",
    },
    { type: "hidden", name: "id" },
    { type: "action", name: "View", iconUrl: "src/assets/react.svg" },
  ],
};

const userData = JSON.stringify(sessionStorage.getItem("user"));
const itemsPerPage = 7;

export default function Deposits() {
  const { isCollapsed } = useOutletContext();
  const ip = useContext(IpContext);

  const testData = {
    data: [
      { id: 1, issued_at: "2023-08-01", amount: "₱ 1,000,000.00" },
      { id: 2, issued_at: "2023-07-15", amount: "₱ 1000.00" },
      { id: 3, issued_at: "2023-08-01", amount: "₱ 1000.00" },
      { id: 4, issued_at: "2023-07-15", amount: "₱ 1000.00" },
      { id: 5, issued_at: "2023-08-01", amount: "₱ 1000.00" },
      { id: 6, issued_at: "2023-07-15", amount: "₱ 1000.00" },
      { id: 7, issued_at: "2023-08-01", amount: "₱ 1000.00" },
      { id: 8, issued_at: "2023-07-15", amount: "₱ 1000.00" },
    ],
    years: [2021, 2022, 2023],
  };

  return (
    <MainContent
      titletab="Deposits - Organization Financial Tracker"
      contentName="DEPOSIT"
      textFormat="text-3xl pt-1"
      showContentNameMobileOnly={true}
    >
      <SearchTableCard
        cardName="DEPOSIT RECORDS"
        userData={userData}
        tableConfig={tableConfig}
        fetchUrl={`${ip}/fetch-deposits`}
        isCollapsed={isCollapsed}
        viewModal={ViewDepositModal}
        testMode={false}
        testData={testData}
        itemsPerPage={itemsPerPage}
      />
    </MainContent>
  );
}
