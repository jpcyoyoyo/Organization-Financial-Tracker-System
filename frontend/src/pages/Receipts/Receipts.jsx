import { useOutletContext } from "react-router-dom";
import MainContent from "../../components/ui/maincontent";
import SearchTableCard from "../../components/ui/searchtablecard";
import ViewReceiptNoEditModal from "./ViewReceiptNoEditModal";
import { useContext } from "react";
import { IpContext } from "../../context/IpContext";

const tableConfig = {
  columns: [
    { type: "icon", iconUrl: "src/assets/react.svg" },
    {
      type: "data",
      header: "ID",
      w_expand: "w-7/15 lg:w-2/14",
      w_collapse: "w-2/5 sm:w-2/5 md:w-1/6 lg:w-2/14",
      alignment: "justify-center",
      text_size: "text-sm md:text-base",
      mobile: true,
      name: "id",
    },
    {
      type: "data",
      header: "TYPE",
      w_expand: "w-1/2 lg:w-3/14",
      w_collapse: "w-3/5 sm:w-3/5 md:w-2/6 lg:w-3/14",
      alignment: "justify-center",
      text_size: "text-sm md:text-base",
      mobile: true,
      name: "type",
    },
    {
      type: "data",
      header: "DATE CREATED",
      w_expand: "hidden lg:flex w-7/15 lg:w-4/14",
      w_collapse: "hidden lg:flex lg:w-4/14",
      alignment: "justify-center",
      mobile: false,
      text_size: "text-sm md:text-base",
      name: "created_at",
    },
    {
      type: "data",
      header: "ISSUED BY",
      w_expand: "hidden lg:flex w-7/15 lg:w-5/14",
      w_collapse: "hidden md:flex md:w-3/6 lg:w-5/14",
      alignment: "justify-center",
      mobile: true,
      text_size: "text-sm md:text-base",
      name: "issuer_name",
    },
    { type: "hidden", name: "id" },
    { type: "action", name: "View", iconUrl: "src/assets/react.svg" },
  ],
};

const userData = JSON.stringify(sessionStorage.getItem("user"));
const itemsPerPage = 7;

export default function Receipts() {
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
      titletab="Receipts - Organization Financial Tracker"
      contentName="RECEIPTS"
      textFormat="text-3xl pt-1"
      showContentNameMobileOnly={true}
    >
      <SearchTableCard
        cardName="ISSUED RECEIPTS"
        userData={userData}
        tableConfig={tableConfig}
        fetchUrl={`${ip}/fetch-receipts`}
        isCollapsed={isCollapsed}
        viewModal={ViewReceiptNoEditModal}
        testMode={false}
        testData={testData}
        itemsPerPage={itemsPerPage}
      />
    </MainContent>
  );
}
