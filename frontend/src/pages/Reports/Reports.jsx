import { useOutletContext } from "react-router-dom";
import MainContent from "../../components/ui/MainContent";
import SearchTableCard from "../../components/ui/SearchTableCard";
import ViewReportsModal from "./ViewReportsModal";

const tableConfig = {
  createButton: { iconUrl: "src/assets/react.svg", name: "Deposit" },
  columns: [
    { type: "icon", iconUrl: "src/assets/react.svg" },
    {
      type: "data",
      header: "NAME",
      w_expand: "w-1/2 lg:w-5/14",
      w_collapse: "w-3/5 sm:w-3/5 md:w-3/7 lg:w-6/14",
      alignment: "justify-start",
      text_size: "font-bold text-start text-sm md:text-base lg:text-lg",
      mobile: true,
      name: "name",
    },
    {
      type: "data",
      header: "DATE PUBLISHED",
      w_expand: "w-7/15 lg:w-5/14",
      w_collapse: "md:w-2/7 lg:w-6/14",
      alignment: "justify-center",
      mobile: true,
      text_size: "font-bold text-sm md:text-base",
      name: "datePublished",
    },
    {
      type: "data",
      header: "REPORT TYPE",
      w_expand: "hidden md:block w-7/15 lg:w-4/14",
      w_collapse: "hidden lg:block w-2/5 sm:w-2/5 md:w-2/6 lg:w-4/14",
      alignment: "justify-center",
      text_size: "font-bold text-sm md:text-base",
      mobile: false,
      name: "reportType",
    },
    { type: "hidden", name: "id" },
    { type: "action", name: "View", iconUrl: "src/assets/react.svg" },
  ],
};

const userData = JSON.stringify(sessionStorage.getItem("user"));
const itemsPerPage = 7;

export default function Reports() {
  const { isCollapsed } = useOutletContext();

  const testData = {
    data: [
      {
        id: 1,
        datePublished: "2023-08-01",
        reportType: "REPORT TYPE",
        name: "A SAMPLE OF A REPORT NAME WITH TWO LINES",
      },
      {
        id: 2,
        datePublished: "2023-07-15",
        reportType: "REPORT TYPE",
        name: "A SAMPLE OF A REPORT NAME WITH TWO LINES",
      },
      {
        id: 3,
        datePublished: "2023-08-01",
        reportType: "REPORT TYPE",
        name: "A SAMPLE OF A REPORT NAME WITH TWO LINES",
      },
      {
        id: 4,
        datePublished: "2023-07-15",
        reportType: "REPORT TYPE",
        name: "A SAMPLE OF A REPORT NAME WITH TWO LINES",
      },
      {
        id: 5,
        datePublished: "2023-08-01",
        reportType: "REPORT TYPE",
        name: "A SAMPLE OF A REPORT NAME WITH TWO LINES",
      },
      {
        id: 6,
        datePublished: "2023-07-15",
        reportType: "REPORT TYPE",
        name: "A SAMPLE OF A REPORT NAME WITH TWO LINES",
      },
      {
        id: 7,
        datePublished: "2023-08-01",
        reportType: "REPORT TYPE",
        name: "A SAMPLE OF A REPORT NAME WITH TWO LINES",
      },
      {
        id: 8,
        datePublished: "2023-07-15",
        reportType: "REPORT TYPE",
        name: "A SAMPLE OF A REPORT NAME WITH TWO LINES",
      },
    ],
    years: [2021, 2022, 2023],
  };

  return (
    <MainContent
      titletab="Reports - Organization Financial Tracker"
      contentName="REPORTS"
      textFormat="text-3xl pt-1"
      showContentNameMobileOnly={true}
    >
      <SearchTableCard
        cardName="PUBLISH REPORTS"
        userData={userData}
        tableConfig={tableConfig}
        fetchUrl="http://your-api.com/deposits"
        isCollapsed={isCollapsed}
        viewModal={ViewReportsModal}
        testMode={true}
        testData={testData}
        itemsPerPage={itemsPerPage}
      />
    </MainContent>
  );
}
