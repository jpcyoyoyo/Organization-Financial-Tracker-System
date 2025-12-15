import { useOutletContext } from "react-router-dom";
import MainContent from "../../components/ui/maincontent";
import CurrentlyOnlineCard from "../../components/ui/currentlyonlinecard";
import TableCard from "../../components/ui/tablecard";
import DataCard from "../../components/ui/datacard";
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
  const tableYourPaymentConfig = {
    columns: [
      { header: "Payment Name", fraction: "9/25", variable: "name" },
      { header: "Amount", fraction: "5/25", variable: "amount" },
      { header: "Due On", fraction: "11/25", variable: "date_due" },
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
              tableConfig={tableYourPaymentConfig}
              fetchUrl={`${ip}/fetch-your-payments`}
              navUrl="/your-payments"
              userData={userData}
              h="h-47 md:h-57"
              w={`w-full`}
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
              iconUrl="https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/solid/wallet.svg"
              iconBgColor="#10B981"
            />
            <DataCard
              title="LATEST ORG DEPOSIT"
              fetchUrl={fetchUrls.latestOrgDeposit}
              id={userData.id}
              name="latest_org_deposit"
              iconUrl="https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/solid/arrow-up-circle.svg"
              iconBgColor="#3B82F6"
            />
            <DataCard
              title="LATEST ORG EXPENSE"
              fetchUrl={fetchUrls.latestOrgExpense}
              id={userData.id}
              name="latest_org_expense"
              iconUrl="https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/solid/arrow-down-circle.svg"
              iconBgColor="#EF4444"
            />
            <DataCard
              title="YOUR TOTAL PAYMENTS"
              fetchUrl={fetchUrls.yourTotalUnpaidPayment}
              id={userData.id}
              name="your_total_unpaid_payment"
              iconUrl="https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/solid/credit-card.svg"
              iconBgColor="#F59E0B"
            />
            <DataCard
              title="YOUR SERVICING POINTS"
              fetchUrl={fetchUrls.yourServicingPoints}
              id={userData.id}
              name="your_servicing_points"
              iconUrl="https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/solid/star.svg"
              iconBgColor="#8B5CF6"
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
              iconUrl="https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/solid/users.svg"
              iconBgColor="#6366F1"
              socketEvent="stats-updated"
            />
            <DataCard
              title="Online Accounts"
              fetchUrl={fetchUrls.onlineAccounts}
              id={userData.id}
              name="online_accounts"
              iconUrl="https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/solid/signal.svg"
              iconBgColor="#10B981"
              socketEvent="stats-updated"
            />
            <DataCard
              title="Online Web"
              fetchUrl={fetchUrls.onlineWeb}
              id={userData.id}
              name="online_web"
              iconUrl="https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/solid/globe-alt.svg"
              iconBgColor="#3B82F6"
              socketEvent="stats-updated"
            />
            <DataCard
              title="Online Mobile"
              fetchUrl={fetchUrls.onlineMobile}
              id={userData.id}
              name="online_mobile"
              iconUrl="https://cdn.jsdelivr.net/npm/heroicons@2.1.5/24/solid/device-phone-mobile.svg"
              iconBgColor="#8B5CF6"
              socketEvent="stats-updated"
            />
            <DataCard
              title="Total Logs"
              fetchUrl={fetchUrls.totalLogs}
              id={userData.id}
              name="total_logs"
              iconUrl="https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/solid/list-bullet.svg"
              iconBgColor="#F59E0B"
              socketEvent="stats-updated"
            />
            <DataCard
              title="Logs Today"
              fetchUrl={fetchUrls.logsToday}
              id={userData.id}
              name="logs_today"
              iconUrl="https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/solid/calendar.svg"
              iconBgColor="#EC4899"
              socketEvent="stats-updated"
            />
          </div>
          <div
            className={`flex flex-col pt-3 md:pt-4 ${
              isCollapsed ? "lg:flex-row" : "xl:flex-row lg:flex-col"
            } w-full gap-x-3 gap-y-3 md:gap-x-4 md:gap-y-4`}
          >
            <CurrentlyOnlineCard
              title="CURRENTLY ONLINE"
              fetchUrl={`${ip}/fetch-currently-online`}
              navUrl="/user-management"
              userData={userData}
              h="h-47 md:h-57"
              w={`w-full`}
            />
          </div>
        </motion.div>
      )}
    </MainContent>
  );
}
