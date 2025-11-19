import { useOutletContext } from "react-router-dom";
import MainContent from "../../components/ui/maincontent";
import SearchTableCard from "../../components/ui/searchtablecard";
import { useContext } from "react";
import { IpContext } from "../../context/IpContext";
import CreateServicingModal from "./CreateServicingModal";

const tableDepositConfig = {
  createButton: {
    iconUrl: "src/assets/react.svg",
    name: "Create Servicing",
  },
  columns: [
    { type: "icon", iconUrl: "src/assets/react.svg" },
    {
      type: "data",
      header: "USER ID",
      w_expand: "w-7/15 lg:w-5/14",
      w_collapse: "w-2/5 sm:w-2/5 md:w-2/6 lg:w-5/14",
      alignment: "justify-center",
      text_size: "text-sm md:text-base",
      mobile: true,
      name: "student_user_id",
    },
    {
      type: "data",
      header: "POINTS",
      w_expand: "w-1/2 lg:w-5/14",
      w_collapse: "w-3/5 sm:w-3/5 md:w-2/6 lg:w-5/14",
      alignment: "font-bold justify-center",
      text_size: "text-sm md:text-base",
      mobile: true,
      name: "points",
    },
    {
      type: "data",
      header: "DATE ISSUED",
      w_expand: "hidden lg:flex w-7/15 lg:w-4/14",
      w_collapse: "hidden md:flex md:w-2/6 lg:w-4/14",
      alignment: "justify-center",
      mobile: false,
      text_size: "text-sm md:text-base",
      name: "created_at",
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
      titletab="Servicings - Organization Financial Tracker"
      contentName="SERVICINGS"
      textFormat="text-[22px] sm:text-3xl pt-2 sm:pt-1"
      showContentNameMobileOnly={true}
    >
      <SearchTableCard
        cardName="SERVICINGS"
        userData={userData}
        tableConfig={tableDepositConfig}
        fetchUrl={`${ip}/fetch-servicing`}
        isCollapsed={isCollapsed}
        testMode={false}
        testData={testData}
        itemsPerPage={itemsPerPage}
        createModal={CreateServicingModal}
        cardSize="h-65"
        mobileCardSize="h-65 sm:h-73"
      />
    </MainContent>
  );
}
