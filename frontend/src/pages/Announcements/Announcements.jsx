import { useOutletContext } from "react-router-dom";
import MainContent from "../../components/ui/maincontent";
import SearchListCard from "../../components/ui/searchlistcard";

const testData = {
  data: [
    {
      announcementName: "New Policy Update",
      dateAnnounced: "2023-07-10",
    },
    {
      announcementName: "Team Building Event",
      dateAnnounced: "2023-06-05",
    },
    {
      announcementName: "Office Relocation",
      dateAnnounced: "2023-05-20",
    },
    {
      announcementName: "Holiday Schedule",
      dateAnnounced: "2023-04-15",
    },
    {
      announcementName: "New Hire Announcement",
      dateAnnounced: "2023-03-30",
    },
  ],
  years: ["2021", "2022", "2023"],
};

export default function Announcements() {
  const { isCollapsed } = useOutletContext();

  const listConfig = {
    columns: [
      { type: "icon", iconUrl: "/assets/icon.png" },
      {
        type: "single",
        w_expand: "w-full md:w-8/15 lg:w-9/12",
        w_collapse: "w-full md:w-5/7 lg:w-4/5",
        key: "",
        name: "announcementName",
        mobile: true,
      },
      {
        type: "single",
        w_expand: "w-7/15 lg:w-3/12",
        w_collapse: "md:w-2/7 lg:lg:w-1/5",
        key: "Date Announced",
        name: "dateAnnounced",
        mobile: true,
      },
    ],
  };

  return (
    <MainContent
      titletab="Announcements - Organization Financial Tracker"
      contentName="ANNOUNCEMENTS"
      textFormat="text-2xl sm:text-3xl pt-2 sm:pt-1"
      showContentNameMobileOnly={true}
    >
      <SearchListCard
        cardName="ANNOUNCEMENTS"
        listConfig={listConfig}
        fetchUrl="http://your-api.com/announcements"
        isCollapsed={isCollapsed}
        testMode={true}
        testData={testData}
      />
    </MainContent>
  );
}
