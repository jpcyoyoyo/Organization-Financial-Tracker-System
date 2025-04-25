import { useOutletContext } from "react-router-dom";
import MainContent from "../../components/ui/maincontent";
import AdminTableCard from "../../components/ui/admintablecard";
import { IpContext } from "../../context/IpContext";
import { useContext } from "react";
import ViewSectionModal from "./ViewSectionModal";
import CreateSectionModal from "./CreateSectionModal";

const tableConfig = {
  createButton: { iconUrl: "src/assets/react.svg", name: "Create Section" },
  columns: [
    { type: "icon", iconUrl: "src/assets/react.svg" },
    {
      type: "data",
      header: "SECTION NAME",
      w_expand: "w-7/15 lg:w-2/7",
      w_collapse: "w-2/5 sm:w-2/5 md:w-2/6 lg:w-2/7",
      alignment: "justify-start",
      text_size: "font-bold sm:text-lg md:text-xl xl:text-2xl xl:pl-3",
      mobile: true,
      name: "name",
      default: "N/A",
    },

    {
      type: "data",
      header: "NUMBER",
      w_expand: "hidden md:block w-7/15 lg:w-1/7",
      w_collapse: "hidden lg:block md:w-2/6 lg:w-1/7",
      alignment: "justify-center",
      mobile: true,
      text_size: "text-sm md:text-base",
      name: "section_no",
      default: "N/A",
    },
    {
      type: "data",
      header: "YEAR",
      w_expand: "w-1/2 lg:w-1/7",
      w_collapse: "w-3/5 sm:w-3/5 md:w-2/6 lg:w-1/7",
      alignment: "justify-center",
      text_size: "text-sm md:text-base",
      mobile: true,
      name: "year",
      default: "N/A",
    },
    {
      type: "data",
      header: "REPRESENTATIVE",
      w_expand: "hidden lg:block w-7/15 lg:w-3/7",
      w_collapse: "hidden md:block md:w-2/6 lg:w-3/7",
      alignment: "justify-center",
      mobile: true,
      text_size: "text-sm md:text-base",
      name: "representative_full_name",
      default: "Not Assigned",
    },
    { type: "hidden", name: "id" },
    { type: "action", name: "View", iconUrl: "src/assets/react.svg" },
  ],
};

const userData = JSON.stringify(sessionStorage.getItem("user"));

export default function Sections() {
  const { isCollapsed } = useOutletContext();
  const ip = useContext(IpContext);
  const fetchUrl = `${ip}/fetch-sections`;

  const testData = {
    data: [
      {
        id: 1,
        name: "101",
        section_no: "1",
        year: "1",
        representative_full_name: "John Paul Cadavez",
      },
      {
        id: 2,
        name: "101",
        section_no: "1",
        year: "1",
        representative_full_name: "John Paul Cadavez",
      },
      {
        id: 3,
        name: "101",
        section_no: "1",
        year: "1",
        representative_full_name: "John Paul Cadavez",
      },
      {
        id: 4,
        name: "101",
        section_no: "1",
        year: "1",
        representative_full_name: "John Paul Cadavez",
      },
      {
        id: 5,
        name: "101",
        section_no: "1",
        year: "1",
        representative_full_name: "John Paul Cadavez",
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
        fetchUrl={fetchUrl}
        isCollapsed={isCollapsed}
        testMode={false}
        testData={testData}
        itemsPerPage={10}
        viewModal={ViewSectionModal}
        createModal={CreateSectionModal}
        cardSize="h-124"
      />
    </MainContent>
  );
}
