import { useContext, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import MainContent from "../../components/ui/maincontent";
import AdminTableCard from "../../components/ui/admintablecard";
import ViewAccountModal from "./ViewAccountModal";
import CreateAccountModal from "./CreateAccountModal";
import UpdateAccountModal from "./UpdateAccountModal";
import DeleteAccountModal from "./DeleteAccountModal";
import { IpContext } from "../../context/IpContext";

export default function UserManagement() {
  const ip = useContext(IpContext);
  const { isCollapsed } = useOutletContext();

  // Memoize user data to prevent unnecessary re-renders
  const userData = useMemo(
    () => JSON.stringify(sessionStorage.getItem("user")),
    []
  );

  // Memoize table configuration
  const tableConfig = useMemo(
    () => ({
      createButton: { iconUrl: "src/assets/react.svg", name: "Create Account" },
      columns: [
        { type: "icon", iconUrl: "src/assets/react.svg" },
        {
          type: "data",
          header: "ID",
          w_expand: "w-7/15 lg:w-1/7",
          w_collapse: "w-2/5 sm:w-2/5 md:w-2/6 lg:w-1/7",
          alignment: "justify-start",
          text_size: "font-bold sm:text-lg md:text-xl xl:text-2xl xl:pl-3",
          mobile: true,
          name: "student_id",
        },
        {
          type: "data",
          header: "NAME",
          w_expand: "w-1/2 lg:w-2/7",
          w_collapse: "w-3/5 sm:w-3/5 md:w-2/6 lg:w-2/7",
          alignment: "justify-center",
          text_size: "text-sm md:text-base",
          mobile: true,
          name: "full_name",
        },
        {
          type: "login-status",
          header: "LOGIN STATUS",
          w_expand: "w-7/15 lg:w-2/7",
          w_collapse: "md:w-2/6 lg:w-2/7",
          alignment: "justify-center",
          mobile: true,
          text_size: "text-sm md:text-base",
          name: "is_online",
        },
        {
          type: "data",
          header: "SECTION",
          w_expand: "hidden md:flex w-7/15 lg:w-2/7",
          w_collapse: "hidden lg:flex md:w-2/6 lg:w-2/7",
          alignment: "justify-center",
          mobile: true,
          text_size: "text-sm md:text-base",
          name: "section_name",
        },
        { type: "hidden", name: "id" },
        { type: "action", name: "View", iconUrl: "src/assets/react.svg" },
      ],
    }),
    []
  );

  // Memoize test data
  const testData = useMemo(
    () => ({
      data: [
        {
          id: 1,
          student_id: "23-10034",
          name: "John Paul Cadavez",
          section: "202",
        },
        {
          id: 2,
          student_id: "ADMIN-001",
          name: "John Paul Cadavez",
          section: "202",
        },
        {
          id: 3,
          student_id: "23-10034",
          full_name: "John Paul Cadavez",
          section: "202",
        },
        {
          id: 4,
          student_id: "23-10034",
          name: "John Paul Cadavez",
          section: "202",
        },
        {
          id: 5,
          student_id: "23-10034",
          name: "John Paul Cadavez",
          section: "202",
        },
        {
          id: 6,
          student_id: "23-10034",
          name: "John Paul Cadavez",
          section: "202",
        },
        {
          id: 7,
          student_id: "23-10034",
          name: "John Paul Cadavez",
          section: "202",
        },
        {
          id: 8,
          student_id: "23-10034",
          name: "John Paul Cadavez",
          section: "202",
        },
        {
          id: 9,
          student_id: "23-10034",
          name: "John Paul Cadavez",
          section: "202",
        },
        {
          id: 10,
          student_id: "23-10034",
          name: "John Paul Cadavez",
          section: "202",
        },
        {
          id: 11,
          student_id: "23-10034",
          name: "John Paul Cadavez",
          section: "202",
        },
        {
          id: 12,
          student_id: "23-10034",
          name: "John Paul Cadavez",
          section: "202",
        },
        {
          id: 13,
          student_id: "23-10034",
          name: "John Paul Cadavez",
          section: "202",
        },
      ],
      years: [2021, 2022, 2023],
    }),
    []
  );

  return (
    <MainContent
      titletab="User Management - Organization Financial Tracker"
      contentName="USER MANAGEMENT"
      textFormat="text-2xl pt-2"
      showContentNameMobileOnly={true}
    >
      <AdminTableCard
        cardName="USER ACCOUNTS"
        userData={userData}
        tableConfig={tableConfig}
        fetchUrl={`${ip}/fetch-users`}
        isCollapsed={isCollapsed}
        viewModal={ViewAccountModal}
        createModal={CreateAccountModal}
        updateModal={UpdateAccountModal}
        deleteModal={DeleteAccountModal}
        testMode={false}
        testData={testData}
        itemsPerPage={12}
        cardSize="h-124"
      />
    </MainContent>
  );
}
