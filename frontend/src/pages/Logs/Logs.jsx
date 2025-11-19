import { useOutletContext } from "react-router-dom";
import MainContent from "../../components/ui/maincontent";
import AdminTableCard from "../../components/ui/admintablecard";
import { IpContext } from "../../context/IpContext";
import { useContext } from "react";
import ViewLogModal from "./ViewLogModal";

const tableConfig = {
  createButton: { iconUrl: "src/assets/react.svg", name: "Create Section" },
  columns: [
    { type: "icon", iconUrl: "src/assets/react.svg" },
    {
      type: "data",
      header: "LOG ID",
      w_expand: "w-1/2 lg:w-1/7",
      w_collapse: "w-1/6 xl:w-1/7",
      alignment: "justify-center",
      text_size: "text-sm md:text-base",
      mobile: true,
      name: "id",
      default: "N/A",
    },
    {
      type: "data",
      header: "USER",
      w_expand: "w-7/15 lg:w-1/7",
      w_collapse: "w-2/6 xl:w-1/7",
      alignment: "justify-start",
      text_size: "font-bold sm:text-lg md:text-xl xl:text-2xl xl:pl-3",
      mobile: true,
      name: "student_id",
      default: "Server",
    },
    {
      type: "log-status",
      header: "SUMMARY",
      w_expand: "w-7/15 lg:w-3/7",
      w_collapse: "w-3/6 xl:w-3/7",
      alignment: "justify-start",
      text_alignment: "text-start",
      mobile: true,
      text_size: "text-sm md:text-base",
      name: "status",
      name_2: "summary",
      default: "0",
    },
    {
      type: "data",
      header: "CREATED",
      w_expand: "hidden xl:flex w-7/15 lg:w-2/7",
      w_collapse: "hidden xl:flex md:w-2/6 lg:w-2/7",
      alignment: "justify-center",
      mobile: true,
      text_size: "text-sm md:text-base",
      name: "created_at",
      default: "N/A",
    },

    { type: "hidden", name: "id" },
    { type: "action", name: "View", iconUrl: "src/assets/react.svg" },
  ],
};

const userData = JSON.stringify(sessionStorage.getItem("user"));

export default function Logs() {
  const { isCollapsed } = useOutletContext();
  const ip = useContext(IpContext);
  const fetchUrl = `${ip}/fetch-logs`;

  const testData = {
    data: [
      {
        id: 1,
        user_id: "23-20000",
        name: "101",
        created_at: "2025-04-24 10:35:18",
        activity: "Organization Properties",
        status: 0,
      },
    ],
    years: [2021, 2022, 2023],
  };

  return (
    <MainContent
      titletab="Logs - Organization Financial Tracker"
      contentName="LOGS"
      textFormat="text-3xl pt-1"
      showContentNameMobileOnly={true}
    >
      <AdminTableCard
        cardName="ALL LOGS"
        userData={userData}
        tableConfig={tableConfig}
        fetchUrl={fetchUrl}
        isCollapsed={isCollapsed}
        testMode={false}
        testData={testData}
        itemsPerPage={12}
        viewModal={ViewLogModal}
        cardSize="h-124"
      />
    </MainContent>
  );
}
