import { useOutletContext } from "react-router-dom";
import MainContent from "../../components/ui/maincontent";
import SearchListCard from "../../components/ui/searchlistcard";
import { useContext, useState } from "react";
import { IpContext } from "../../context/IpContext";
import CreateDraftPaymentModal from "./CreateDraftPaymentModal";
import EditDraftPaymentModal from "./EditDraftPaymentModal";
import DeleteDraftPaymentModal from "./DeleteDraftPaymentModal";

export default function DraftPayments() {
  const { isCollapsed } = useOutletContext();
  const ip = useContext(IpContext);

  const [globalRefresh, setGlobalRefresh] = useState(0);
  const refreshAll = () => setGlobalRefresh((prev) => prev + 1);

  const issuedListConfig = {
    columns: [
      { type: "hidden", name: "id" },
      { type: "icon", iconUrl: "src/assets/react.svg" },
      {
        type: "double",
        w_expand: "w-full md:w-8/15 lg:w-9/12",
        w_collapse: "w-full md:w-5/7 lg:w-4/5",
        variables: [
          {
            key: "",
            name: "name",
            mobile: true,
            nameStyle: "font-semibold text-base",
          },
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

  const listConfig = {
    createButton: {
      iconUrl: "src/assets/react.svg",
      name: "Create Payment",
    },
    columns: [
      { type: "hidden", name: "id" },
      { type: "icon", iconUrl: "src/assets/react.svg" },
      {
        type: "double",
        w_expand: "w-full md:w-8/15 lg:w-6/12",
        w_collapse: "w-full md:w-5/7 lg:w-4/7",
        variables: [
          {
            key: "",
            name: "name",
            mobile: true,
            nameStyle: "font-semibold text-base",
          },
          {
            key: "",
            name: "amount",
            mobile: true,
            nameStyle: "font-normal text-sm",
          },
        ],
        mobile: true,
      },
      {
        type: "single",
        w_expand: "w-7/15 lg:w-3/12",
        w_collapse: "md:w-2/7 lg:lg:w-2/7",
        key: "Date Created",
        name: "created_at",
        mobile: true,
        default: "Not Yet Issued",
      },
      {
        type: "single",
        w_expand: "w-7/15 lg:w-3/12",
        w_collapse: "md:w-2/7 lg:w-2/7",
        key: "Status",
        name: "status",
        mobile: true,
        default: "Status",
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

  return (
    <MainContent
      titletab="Draft Payments - Organization Financial Tracker"
      contentName="DRAFT PAYMENTS"
      textFormat="text-3xl pt-1"
      showContentNameMobileOnly={true}
    >
      <div className="space-y-6">
        <SearchListCard
          cardName="PAYMENTS DRAFTS"
          listConfig={listConfig}
          fetchUrl={`${ip}/fetch-draft-payments`}
          isCollapsed={isCollapsed}
          testMode={false}
          testData={testData}
          createModal={CreateDraftPaymentModal}
          viewModal={EditDraftPaymentModal}
          deleteModal={DeleteDraftPaymentModal}
          itemsPerPage={4}
          cardSize="h-87 md:h-76"
          mobileCardSize="h-85"
          refreshGlobalData={refreshAll}
          globalRefresh={globalRefresh}
        />
        <SearchListCard
          cardName="ISSUED PAYMENTS"
          listConfig={issuedListConfig}
          fetchUrl={`${ip}/fetch-issued-payments`}
          isCollapsed={isCollapsed}
          viewModal={EditDraftPaymentModal}
          testMode={false}
          testData={testData}
          refreshGlobalData={refreshAll}
          globalRefresh={globalRefresh}
        />
      </div>
    </MainContent>
  );
}
