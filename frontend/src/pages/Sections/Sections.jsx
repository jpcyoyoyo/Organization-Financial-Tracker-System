import { useOutletContext } from "react-router-dom";
import MainContent from "../../components/ui/MainContent";
import AdminTableCard from "../../components/ui/admintablecard";
import ViewSectionModal from "./ViewSectionModal";

const tableConfig = {
  createButton: { iconUrl: "src/assets/react.svg", name: "Deposit" },
  columns: [
    { type: "icon", iconUrl: "src/assets/react.svg" },
    {
      type: "data",
      header: "NAME",
      w_expand: "w-7/15 lg:w-1/7",
      w_collapse: "w-2/5 sm:w-2/5 md:w-2/6 lg:w-1/7",
      alignment: "justify-start",
      text_size: "font-bold sm:text-lg md:text-xl xl:text-2xl xl:pl-3",
      mobile: true,
      name: "studentId",
    },
    {
      type: "data",
      header: "YEAR",
      w_expand: "w-1/2 lg:w-2/7",
      w_collapse: "w-3/5 sm:w-3/5 md:w-2/6 lg:w-2/7",
      alignment: "justify-center",
      text_size: "text-sm md:text-base",
      mobile: true,
      name: "name",
    },
    {
      type: "data",
      header: "NUMBER",
      w_expand: "hidden md:block w-7/15 lg:w-2/7",
      w_collapse: "hidden lg:block md:w-2/6 lg:w-2/7",
      alignment: "justify-center",
      mobile: true,
      text_size: "text-sm md:text-base",
      name: "loginStatus",
    },
    {
      type: "data",
      header: "REPRESENTATIVE",
      w_expand: "hidden lg:block w-7/15 lg:w-2/7",
      w_collapse: "hidden md:block md:w-2/6 lg:w-2/7",
      alignment: "justify-center",
      mobile: true,
      text_size: "text-sm md:text-base",
      name: "section",
    },
    { type: "hidden", name: "id" },
    { type: "action", name: "View", iconUrl: "src/assets/react.svg" },
  ],
};

const userData = JSON.stringify(sessionStorage.getItem("user"));

export default function Sections() {
  const { isCollapsed } = useOutletContext();

  const testData = {
    data: [
      {
        id: 1,
        studentId: "23-10034",
        name: "John Paul Cadavez",
        section: "202",
      },
      {
        id: 2,
        studentId: "ADMIN-001",
        name: "John Paul Cadavez",
        section: "202",
      },
      {
        id: 3,
        studentId: "23-10034",
        name: "John Paul Cadavez",
        section: "202",
      },
      {
        id: 4,
        studentId: "23-10034",
        name: "John Paul Cadavez",
        section: "202",
      },
      {
        id: 5,
        studentId: "23-10034",
        name: "John Paul Cadavez",
        section: "202",
      },
      {
        id: 6,
        studentId: "23-10034",
        name: "John Paul Cadavez",
        section: "202",
      },
      {
        id: 7,
        studentId: "23-10034",
        name: "John Paul Cadavez",
        section: "202",
      },
      {
        id: 8,
        studentId: "23-10034",
        name: "John Paul Cadavez",
        section: "202",
      },
      {
        id: 8,
        studentId: "23-10034",
        name: "John Paul Cadavez",
        section: "202",
      },
      {
        id: 8,
        studentId: "23-10034",
        name: "John Paul Cadavez",
        section: "202",
      },
    ],
    years: [2021, 2022, 2023],
  };

  return (
    <MainContent
      titletab="Sections - Organization Financial Tracker"
      contentName="SECTIONS"
      textFormat="text-3xl pt-1"
      showContentNameMobileOnly={true}
    >
      <AdminTableCard
        cardName="ALL SECTIONS"
        userData={userData}
        tableConfig={tableConfig}
        fetchUrl="http://your-api.com/deposits"
        isCollapsed={isCollapsed}
        viewModal={ViewSectionModal}
        testMode={true}
        testData={testData}
        itemsPerPage={10}
      />
    </MainContent>
  );
}
