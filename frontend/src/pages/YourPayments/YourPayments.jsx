import { useOutletContext } from "react-router-dom";
import MainContent from "../../components/ui/maincontent";
import SearchListCard from "../../components/ui/searchlistcard";
import { useContext } from "react";
import { IpContext } from "../../context/IpContext";
import EditDraftPaymentModal from "../DraftPayments/EditDraftPaymentModal";

const issuedListConfig = {
  columns: [
    { type: "hidden", name: "id" },
    { type: "icon", iconUrl: "src/assets/react.svg" },
    {
      type: "double",
      w_expand: "w-full md:w-8/15 lg:w-9/12",
      w_collapse: "w-full md:w-5/7 lg:w-4/5",
      variables: [
        { key: "", name: "name", mobile: true },
        { key: "Total Payment", name: "amount", mobile: true },
      ],
      mobile: true,
    },
    {
      type: "single",
      w_expand: "w-7/15 lg:w-3/12",
      w_collapse: "md:w-2/7 lg:w-1/5",
      key: "Date Issued",
      name: "issued_at",
      mobile: true,
    },
  ],
};

const testData = {
  data: [
    {
      id: 1,
      name: "Draft Budget 1",
      amount: "$1,000",
      created_at: "2021-01-01",
    },
    {
      id: 2,
      name: "Draft Budget 2",
      amount: "$2,000",
      created_at: "2021-02-01",
    },
    {
      id: 3,
      name: "Draft Budget 3",
      amount: "$1,000",
      created_at: "2021-03-01",
    },
    {
      id: 4,
      name: "Draft Budget 4",
      amount: "$2,000",
      created_at: "2021-04-01",
    },
    {
      id: 5,
      name: "Draft Budget 5",
      amount: "$1,000",
      created_at: "2021-05-01",
    },
    {
      id: 6,
      name: "Draft Budget 6",
      amount: "$1,000",
      created_at: "2021-06-01",
    },
  ],
  years: [2021, 2022, 2023],
};

export default function YourPayments() {
  const { isCollapsed } = useOutletContext();
  const ip = useContext(IpContext);

  return (
    <MainContent
      titletab="Budgets - Organization Financial Tracker"
      contentName="BUDGETS"
      textFormat="text-3xl pt-1"
      showContentNameMobileOnly={true}
    >
      <div className="space-y-6">
        <SearchListCard
          cardName="ISSUED PAYMENTS"
          listConfig={issuedListConfig}
          fetchUrl={`${ip}/fetch-issued-payments`}
          isCollapsed={isCollapsed}
          viewModal={EditDraftPaymentModal}
          testMode={false}
          testData={testData}
        />
      </div>
    </MainContent>
  );
}
