import { useOutletContext } from "react-router-dom";
import MainContent from "../../components/ui/maincontent";
import TableCard from "../../components/ui/tablecard";
import DataCard from "../../components/ui/datacard";
import TextCard from "../../components/ui/textcard";
import { motion } from "framer-motion";
import { useMemo, useContext } from "react";
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

  const fetchUrls = useMemo(
    () => ({
      totalAccounts: `${ip}/fetch-total-accounts`,
      onlineAccounts: `${ip}/fetch-online-accounts`,
      onlineWeb: `${ip}/fetch-online-web`,
      onlineMobile: `${ip}/fetch-online-mobile`,
      totalLogs: `${ip}/fetch-total-logs`,
      logsToday: `${ip}/fetch-logs-today`,
      currentOrgBal: `${ip}/fetch-current-org-balance`,
      latestOrgDeposit: `${ip}/fetch-latest-org-deposit`,
      latestOrgExpense: `${ip}/fetch-latest-org-expense`,
      yourTotalPaidPayment: `${ip}/fetch-your-total-paid-payment`,
      yourTotalUnpaidPayment: `${ip}/fetch-your-total-unpaid-payment`,
      yourServicingPoints: `${ip}/fetch-your-servicing-points`,
    }),
    [ip]
  );

  console.log("Dashboard re-rendered"); // Debugging log

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
              h="h-47 md:h-57"
              w={`w-full ${
                isCollapsed ? "lg:w-11/25" : "xl:w-11/25 lg:w-full"
              }`}
            />
            <TextCard
              title="ANNOUNCEMENTS"
              fetchUrl={`${ip}/fetch-users`}
              navUrl="/your-payments"
              userData={userData}
              h="h-47 md:h-57"
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
            <DataCard
              title="CURRENT ORG BALANCE"
              fetchUrl={fetchUrls.currentOrgBal}
              id={userData.id}
              name="current_org_bal"
            />
            <DataCard
              title="LATEST ORG DEPOSIT"
              fetchUrl={fetchUrls.latestOrgDeposit}
              id={userData.id}
              name="latest_org_deposit"
            />
            <DataCard
              title="LATEST ORG EXPENSE"
              fetchUrl={fetchUrls.latestOrgExpense}
              id={userData.id}
              name="latest_org_expense"
            />
            <DataCard
              title="YOUR TOTAL PAID PAYMENT"
              fetchUrl={fetchUrls.yourTotalPaidPayment}
              id={userData.id}
              name="your_total_paid_payment"
            />
            <DataCard
              title="YOUR TOTAL UNPAID PAYMENT"
              fetchUrl={fetchUrls.yourTotalUnpaidPayment}
              id={userData.id}
              name="your_total_unpaid_payment"
            />
            <DataCard
              title="YOUR SERVICING POINTS"
              fetchUrl={fetchUrls.yourServicingPoints}
              id={userData.id}
              name="your_servicing_points"
            />
          </div>
        </motion.div>
      ) : (
        // Dashboard content for admin users – you can customize this section as needed.
        <motion.div
          initial={{ opacity: 0.5, x: 4 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -4 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className={`pt-3 md:pt-4 grid sm:grid-cols-2 ${
              isCollapsed
                ? "lg:grid-cols-3 xl:grid-cols-3"
                : "md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
            } w-full gap-x-3 gap-y-3 md:gap-x-4 md:gap-y-4`}
          >
            <DataCard
              title="Total Accounts"
              fetchUrl={fetchUrls.totalAccounts}
              id={userData.id}
              name="total_accounts"
            />
            <DataCard
              title="Online Accounts"
              fetchUrl={fetchUrls.onlineAccounts}
              id={userData.id}
              name="online_accounts"
            />
            <DataCard
              title="Online Web"
              fetchUrl={fetchUrls.onlineWeb}
              id={userData.id}
              name="online_web"
            />
            <DataCard
              title="Online Mobile"
              fetchUrl={fetchUrls.onlineMobile}
              id={userData.id}
              name="online_mobile"
            />
            <DataCard
              title="Total Logs"
              fetchUrl={fetchUrls.totalLogs}
              id={userData.id}
              name="total_logs"
            />
            <DataCard
              title="Logs Today"
              fetchUrl={fetchUrls.logsToday}
              id={userData.id}
              name="logs_today"
            />
          </div>
        </motion.div>
      )}
    </MainContent>
  );
}
