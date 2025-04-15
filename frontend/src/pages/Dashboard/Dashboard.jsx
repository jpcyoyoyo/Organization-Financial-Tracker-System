import { useOutletContext } from "react-router-dom";
import MainContent from "../../components/ui/MainContent";
import TableCard from "../../components/ui/TableCard";
import DataCard from "../../components/ui/DataCard";
import TextCard from "../../components/ui/textcard";
import { motion } from "framer-motion";
import { useContext } from "react";
import { IpContext } from "../../context/IpContext";

export default function Dashboard() {
  const { isCollapsed } = useOutletContext();
  const ip = useContext(IpContext);

  // Parse the stored user data from sessionStorage
  const rawUserData = sessionStorage.getItem("user");
  const userData = rawUserData ? JSON.parse(rawUserData) : {};

  // Table config to be used for non-admin dashboard
  const tableConfig = {
    columns: [
      { header: "Payment Name", fraction: "13/25", variable: "name" },
      { header: "Amount", fraction: "6/25", variable: "amount" },
      { header: "Due On", fraction: "6/25", variable: "date_due" },
    ],
  };

  return (
    <MainContent
      titletab="Dashboard - Organization Financial Tracker"
      contentName="DASHBOARD"
      textFormat="text-3xl pt-1"
    >
      {userData.designation !== "Admin" ? (
        // Dashboard content for non-admin users
        <motion.div
          initial={{ opacity: 0.5, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 2 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className={`flex flex-col ${
              isCollapsed ? "lg:flex-row" : "xl:flex-row lg:flex-col"
            } w-full gap-x-3 gap-y-3 md:gap-x-4 md:gap-y-4`}
          >
            <TableCard
              title="YOUR PAYMENTS"
              tableConfig={tableConfig}
              fetchUrl={`${ip}/fetch-your-payments`}
              navUrl="/your-payments"
              userData={userData}
              h="h-43 md:h-57"
              w={`w-full ${
                isCollapsed ? "lg:w-11/25" : "xl:w-11/25 lg:w-full"
              }`}
            />
            <TextCard
              title="ANNOUNCEMENTS"
              fetchUrl={`${ip}/fetch-users`}
              navUrl="/your-payments"
              userData={userData}
              h="h-43 md:h-57"
              w={`w-full ${
                isCollapsed ? "lg:w-14/25" : "xl:w-14/25 lg:w-full"
              }`}
            />
          </div>
          <div
            className={`pt-3 md:pt-4 grid ${
              isCollapsed
                ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
                : "sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
            } w-full gap-x-3 gap-y-3 md:gap-x-4 md:gap-y-4`}
          >
            <DataCard title="CURRENT ORG DEPOSIT" />
            <DataCard title="LATEST ORG DEPOSIT" />
            <DataCard title="LATEST ORG EXPENSE" />
            <DataCard title="ACCUMULATED PAYMENT" />
            <DataCard title="ACCUMULATED DEPOSIT" />
            <DataCard title="ACCUMULATED EXPENSE" />
          </div>
        </motion.div>
      ) : (
        // Dashboard content for admin users – you can customize this section as needed.
        <motion.div
          initial={{ opacity: 0.5, x: 4 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -4 }}
          transition={{ duration: 0.5 }}
        ></motion.div>
      )}
    </MainContent>
  );
}
