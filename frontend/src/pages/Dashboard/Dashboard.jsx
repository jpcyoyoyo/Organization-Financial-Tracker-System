import { useOutletContext } from "react-router-dom";
import MainContent from "../../components/ui/MainContent";
import TableCard from "../../components/ui/TableCard";
import DataCard from "../../components/ui/DataCard";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { isCollapsed } = useOutletContext();

  const tableConfig = {
    columns: [
      { header: "Payment Name", fraction: "13/25", variable: "full_name" },
      { header: "Amount", fraction: "6/25", variable: "student_id" },
      { header: "Due On", fraction: "6/25", variable: "email" },
    ],
  };

  const userData = JSON.stringify(sessionStorage.getItem("user"));

  return (
    <MainContent
      titletab="Dashboard - Organization Financial Tracker"
      contentName="DASHBOARD"
    >
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
            fetchUrl="http://192.168.100.42:8081/fetch"
            navUrl="/your-payments"
            userData={userData}
            h="h-43 md:h-57"
            w={`w-full ${isCollapsed ? "lg:w-11/25" : "xl:w-11/25 lg:w-full"}`}
          />
          <TableCard
            title="YOUR PAYMENTS"
            tableConfig={tableConfig}
            fetchUrl="http://192.168.100.42:8081/fetch-users"
            navUrl="/your-payments"
            userData={userData}
            h="h-43 md:h-57"
            w={`w-full ${isCollapsed ? "lg:w-14/25" : "xl:w-14/25 lg:w-full"}`}
          />
        </div>
        <div
          className={`pt-3 md:pt-4 grid ${
            isCollapsed
              ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
              : "sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
          }  w-full gap-x-3 gap-y-3 md:gap-x-4 md:gap-y-4`}
        >
          <DataCard title="CURRENT ORG DEPOSIT" />
          <DataCard title="LATEST ORG DEPOSIT" />
          <DataCard title="LATEST ORG EXPENSE" />
          <DataCard title="ACCUMULATED PAYMENT" />
          <DataCard title="ACCUMULATED DEPOSIT" />
          <DataCard title="ACCUMULATED EXPENSE" />
        </div>
      </motion.div>
    </MainContent>
  );
}
