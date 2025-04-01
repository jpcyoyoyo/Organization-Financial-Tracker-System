import { useOutletContext } from "react-router-dom";
import MainContent from "../../components/ui/MainContent";
import SearchTableCard from "../../components/ui/SearchTableCard";
import ViewExpenseModal from "./ViewExpenseModal";

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
      text_size:
        "font-bold sm:text-lg md:text-xl xl:text-2xl md:pl-1.5 xl:pl-3",
      mobile: true,
      name: "amount",
    },
    {
      type: "data",
      header: "DATE RECORDED",
      w_expand: "w-1/2 lg:w-5/14",
      w_collapse: "w-3/5 sm:w-3/5 md:w-2/6 lg:w-5/14",
      alignment: "justify-center",
      text_size: "text-sm md:text-base",
      mobile: true,
      name: "dateRecorded",
    },
    {
      type: "data",
      header: "SOURCE",
      w_expand: "hidden lg:block w-7/15 lg:w-5/14",
      w_collapse: "hidden md:block md:w-2/6 lg:w-5/14",
      alignment: "justify-center",
      mobile: false,
      text_size: "text-sm md:text-base",
      name: "source",
    },
    { type: "hidden", name: "id" },
    { type: "action", name: "View", iconUrl: "src/assets/react.svg" },
  ],
};

const userData = JSON.stringify(sessionStorage.getItem("user"));
const itemsPerPage = 7;

export default function Expenses() {
  const { isCollapsed } = useOutletContext();

  const testData = {
    data: [
      { id: 1, dateRecorded: "2023-08-01", amount: "1,000,000.00" },
      { id: 2, dateRecorded: "2023-07-15", amount: "1000.00" },
      { id: 3, dateRecorded: "2023-08-01", amount: "1000.00" },
      { id: 4, dateRecorded: "2023-07-15", amount: "1000.00" },
      { id: 5, dateRecorded: "2023-08-01", amount: "1000.00" },
      { id: 6, dateRecorded: "2023-07-15", amount: "1000.00" },
      { id: 7, dateRecorded: "2023-08-01", amount: "1000.00" },
      { id: 8, dateRecorded: "2023-07-15", amount: "1000.00" },
    ],
    years: [2021, 2022, 2023],
  };

  return (
    <MainContent
      titletab="Expenses - Organization Financial Tracker"
      contentName="EXPENSE"
      textFormat="text-3xl pt-1"
      showContentNameMobileOnly={true}
    >
      <SearchTableCard
        cardName="EXPENSE RECORDS"
        userData={userData}
        tableConfig={tableConfig}
        fetchUrl="http://your-api.com/deposits"
        isCollapsed={isCollapsed}
        viewModal={ViewExpenseModal}
        testMode={true}
        testData={testData}
        itemsPerPage={itemsPerPage}
      />
    </MainContent>
  );
}
