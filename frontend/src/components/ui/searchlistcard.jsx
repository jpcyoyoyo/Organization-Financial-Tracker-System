import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input"; // Ensure correct import
import searchIcon from "../../assets/search.svg";
import filterIcon from "../../assets/filter.svg";
import closeIcon from "../../assets/close.svg";
import nextIcon from "../../assets/next.svg";
import prevIcon from "../../assets/prev.svg";
import { motion } from "framer-motion";

/**
 * Example listConfig structure:
 * {
 *   columns: [
 *     { type: "icon", iconUrl: "/assets/icon.png" },
 *     {
 *       type: "double",
 *       variables: [
 *         { key: "Name of the Budget:", name: "budgetName" },
 *         { key: "Total Budget:", name: "totalBudget" }
 *       ]
 *     },
 *     { type: "single", key: "Date Approved:", name: "dateApproved" },
 *     { type: "single", key: "Another Field:", name: "anotherField" }
 *   ]
 * }
 */

export default function SearchListCard({
  cardName,
  listConfig,
  fetchUrl,
  isCollapsed,
}) {
  // ------------------------------
  // State Variables
  // ------------------------------
  const [data, setData] = useState([]); // Fetched items
  const [loading, setLoading] = useState(false); // Loading state
  const [availableYears, setAvailableYears] = useState([]); // Populated at initial fetch

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [year, setYear] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // For toggling mobile layout (hamburger)
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // For toggling filter popup
  const [filterOpen, setFilterOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ------------------------------
  // Determine "mode" for fetch
  // ------------------------------
  function getMode() {
    const hasSearch = searchTerm.trim().length > 0;
    const hasFilter = year || startDate || endDate; // any filter field used?

    if (hasSearch && hasFilter) return "Mixed";
    if (hasSearch) return "Search";
    if (hasFilter) return "Filter";
    return "Populate";
  }

  // ------------------------------
  // Build request body based on mode
  // ------------------------------
  function buildRequestBody(mode) {
    const body = { mode };
    if (mode === "Search" || mode === "Mixed") {
      body.searchTerm = searchTerm;
    }
    if (mode === "Filter" || mode === "Mixed") {
      body.year = year;
      body.startDate = startDate;
      body.endDate = endDate;
    }
    return JSON.stringify(body);
  }

  // ------------------------------
  // Fetch Data from Server and sort by date (newest first)
  // ------------------------------
  async function fetchData(mode) {
    setLoading(true);
    try {
      const response = await fetch(fetchUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: buildRequestBody(mode),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      const fetchedData = Array.isArray(result.data) ? result.data : [];
      // Sort by dateApproved descending (newest first)
      const sortedData = fetchedData.sort(
        (a, b) => new Date(b.dateApproved) - new Date(a.dateApproved)
      );
      setData(sortedData);
      setAvailableYears(Array.isArray(result.years) ? result.years : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  // ------------------------------
  // Temporary Result Data (for testing)
  // Remove this effect when testing is complete.
  // ------------------------------
  useEffect(() => {
    const tempData = [
      {
        budgetName: "Test Budget 1",
        totalBudget: "$1,000",
        dateApproved: "2021-01-01",
      },
      {
        budgetName: "Test Budget 2",
        totalBudget: "$2,000",
        dateApproved: "2021-02-01",
      },
      {
        budgetName: "Test Budget 3",
        totalBudget: "$1,000",
        dateApproved: "2021-03-01",
      },
      {
        budgetName: "Test Budget 4",
        totalBudget: "$2,000",
        dateApproved: "2021-04-01",
      },
      {
        budgetName: "Test Budget 5",
        totalBudget: "$1,000",
        dateApproved: "2021-05-01",
      },
      {
        budgetName: "Test Budget 6",
        totalBudget: "$1,000",
        dateApproved: "2021-06-01",
      },
    ];
    const tempYears = [2021, 2022, 2023];
    // Sort the tempData by date descending
    const sortedTempData = tempData.sort(
      (a, b) => new Date(b.dateApproved) - new Date(a.dateApproved)
    );
    setData(sortedTempData);
    setAvailableYears(tempYears);
  }, []);

  // ------------------------------
  // 1) On mount: fetch with "Populate"
  // ------------------------------
  /*
  useEffect(() => {
    fetchData("Populate");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  */

  // ------------------------------
  // 2) Handle "Search" Button
  // ------------------------------
  function handleSearch() {
    // Prevent search if search field is blank
    if (!searchTerm.trim()) {
      // If blank, repopulate the list using "Populate" mode
      fetchData("Populate");
      return;
    }
    setCurrentPage(1);
    const mode = getMode();
    fetchData(mode);
  }

  // ------------------------------
  // 3) Auto-fetch Populate when search field is cleared
  // ------------------------------
  useEffect(() => {
    if (!searchTerm.trim()) {
      // If searchTerm becomes empty, repopulate data
      fetchData("Populate");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // ------------------------------
  // 4) Handle "Apply Filter" in Popup
  // ------------------------------
  function handleApplyFilter() {
    setFilterOpen(false);
    setCurrentPage(1);
    const mode = getMode();
    fetchData(mode);
  }

  // ------------------------------
  // Pagination Logic
  // ------------------------------
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = data.slice(startIndex, startIndex + itemsPerPage);

  function handlePageChange(page) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  // ------------------------------
  // Render
  // ------------------------------
  return (
    <div className="font-[archivo] text-gray-800 relative">
      {/* FILTER POPUP (overlay) */}
      {filterOpen && (
        <div className="fixed inset-0 bg-[#4a556584] flex items-center justify-center z-50">
          {/* Popup Container */}
          <div className="bg-white rounded-md p-4 w-11/12 md:w-1/2 max-w-lg relative">
            {/* Close Button */}
            <Button
              className="absolute top-2 right-2 text-gray-600 hover:text-black cursor-pointer"
              onClick={() => setFilterOpen(false)}
            >
              &times;
            </Button>
            <h2 className="text-xl font-bold mb-4">Filter</h2>

            {/* Year Dropdown */}
            <label className="block mb-2 text-sm font-semibold">Year</label>
            <select
              className="border border-gray-300 rounded-md px-3 py-1 w-full mb-4"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">-- Select Year --</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>

            {/* Date Range */}
            <label className="block mb-2 text-sm font-semibold">
              Start Date
            </label>
            <Input
              type="date"
              className="border border-gray-300 rounded-md px-3 py-1 w-full mb-4"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <label className="block mb-2 text-sm font-semibold">End Date</label>
            <Input
              type="date"
              className="border border-gray-300 rounded-md px-3 py-1 w-full mb-4"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />

            <div className="flex justify-end space-x-2">
              <Button
                className="px-4 py-1 bg-gray-300 text-black rounded-md hover:bg-gray-400 cursor-pointer"
                onClick={() => setFilterOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                onClick={handleApplyFilter}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER: Card Name + Search/Filter (Desktop) or Hamburger (Mobile) */}
      <div
        className={`flex flex-col transition-all md:flex-row items-start md:items-center justify-between bg-[#EA916E] rounded-t-xl px-4 ${
          isCollapsed ? "md:py-2" : "lg:py-2"
        }`}
      >
        {/* Left Section: Card Name or Hamburger for Mobile */}
        <div className="flex self-stretch">
          {/* MOBILE (below md) */}
          {!showMobileSearch && (
            <motion.div
              initial={{ opacity: 0.5, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 2 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className={`grid grid-cols-12 w-full flex-row justify-self-stretch ${
                  isCollapsed ? "md:hidden" : "lg:hidden"
                } items-center py-2`}
              >
                <h1 className="col-span-8 text-2xl md:text-3xl font-bold">
                  {cardName}
                </h1>
                <div className="col-span-4 justify-self-end">
                  <Button
                    className="ml-2 px-2 py-1 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
                    onClick={() => setShowMobileSearch(true)}
                  >
                    {/* Hamburger Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* DESKTOP (md and up) */}
          <div className={`hidden ${isCollapsed ? "md:block" : "lg:block"}`}>
            <h1 className="text-2xl md:text-3xl font-bold">{cardName}</h1>
          </div>
        </div>

        {/* Right Section: Search & Filter (Desktop only) */}
        <div
          className={`hidden transition-all ${
            isCollapsed ? "md:flex" : "lg:flex"
          } space-x-2 items-center`}
        >
          <div className="flex flex-row">
            <Input
              type="text"
              placeholder="Search"
              className={`bg-white text-sm sm:text-base ${
                isCollapsed ? "md:w-48 lg:w-85 xl:w-95" : "lg:w-50 xl:w-90"
              } rounded-l-md`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              onClick={handleSearch}
              className="px-2 py-1 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 cursor-pointer"
            >
              <img src={searchIcon} width="20" alt="search icon" />
            </Button>
          </div>
          <Button
            onClick={() => setFilterOpen(true)}
            className="px-4 py-1 bg-gray-300 text-black rounded-md hover:bg-gray-400 cursor-pointer"
          >
            <img src={filterIcon} width="20" alt="filter icon" />
          </Button>
        </div>
      </div>

      {/* MOBILE Search & Filter View (below md) */}
      {showMobileSearch && (
        <div
          className={`transition-all ${
            isCollapsed ? "md:hidden" : "lg:hidden"
          } flex flex-col space-y-2 ${
            showMobileSearch
              ? "bg-[#EA916E] rounded-t-xl px-3 py-2.5"
              : "hidden"
          }`}
        >
          <motion.div
            initial={{ opacity: 0.5, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 2 }}
            transition={{ duration: 0.75 }}
          >
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-8 flex flex-row justify-self-stretch">
                <Input
                  type="text"
                  placeholder="Search"
                  className={`bg-white text-sm sm:text-base w-4/5 ${
                    isCollapsed ? "md:w-48 lg:w-85 xl:w-95" : "lg:w-50 xl:w-90"
                  } rounded-l-md`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                  onClick={handleSearch}
                  className="w-1/5 justify-items-center px-2 py-1 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 cursor-pointer"
                >
                  <img src={searchIcon} width="20" alt="search icon" />
                </Button>
              </div>
              <Button
                onClick={() => {
                  setShowMobileSearch(false);
                  setFilterOpen(true);
                }}
                className="col-span-2 w-10 justify-self-start justify-items-center px-2 py-1 bg-gray-300 text-black rounded-md hover:bg-gray-400 cursor-pointer"
              >
                <img src={filterIcon} width="20" alt="filter icon" />
              </Button>
              <Button
                className="col-span-2 w-10 justify-self-end justify-items-center px-2 py-1 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
                onClick={() => setShowMobileSearch(false)}
              >
                <img src={closeIcon} width="20" alt="close icon" />
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="bg-white p-4 rounded-b-xl">
        {/* LOADING */}
        {loading && (
          <motion.div
            initial={{ opacity: 0.1, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 2 }}
            transition={{ duration: 1 }}
            className="h-107.5 md:h-112"
          >
            <p className="text-center py-2">Loading...</p>
          </motion.div>
        )}

        {/* LIST ITEMS */}
        {!loading && currentItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0.5, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 2 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-3 h-87 md:h-97">
              {currentItems.map((rowData, idx) => (
                <div
                  key={idx}
                  className="flex flex-row rounded-md overflow-hidden shadow-sm transition-all md:hover:-translate-y-1 cursor-pointer"
                >
                  {listConfig.columns.map((col, cIndex) => {
                    // 1) Icon column
                    if (col.type === "icon") {
                      return (
                        <div
                          key={cIndex}
                          className="bg-red-600 w-18 flex items-center justify-center text-white"
                        >
                          {col.iconUrl ? (
                            <img
                              src={col.iconUrl}
                              alt="icon"
                              className="w-8 h-8"
                            />
                          ) : (
                            <span className="text-sm font-bold">ICON</span>
                          )}
                        </div>
                      );
                    }
                    // 2) Double variable column
                    if (col.type === "double") {
                      return (
                        <div
                          key={cIndex}
                          className={`flex flex-col justify-center bg-gray-100 px-3 py-2 ${
                            isCollapsed ? col.w_collapse : col.w_expand
                          }`}
                        >
                          <p className="text-sm lg:text-base font-bold">
                            {rowData[col.variables[0].name] ?? "N/A"}
                          </p>
                          <p className="text-base lg:text-xl">
                            <strong>{col.variables[1].key} </strong>
                            {rowData[col.variables[1].name] ?? "N/A"}
                          </p>
                        </div>
                      );
                    }
                    // 3) Single variable column
                    if (col.type === "single") {
                      return (
                        <div
                          key={cIndex}
                          className={`hidden md:flex flex-col justify-center bg-gray-100 px-3 py-2 ${
                            isCollapsed ? col.w_collapse : col.w_expand
                          }`}
                        >
                          <p className="text-xs sm:text-sm lg:text-base">
                            <strong>{col.key} </strong>
                          </p>
                          <p className="text-base lg:text-xl">
                            {rowData[col.name] ?? "N/A"}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* NO DATA FOUND */}
        {!loading && data.length === 0 && (
          <motion.div
            initial={{ opacity: 0.1, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 2 }}
            transition={{ duration: 0.75 }}
            className="h-107.5 md:h-112"
          >
            <p className="text-sm text-gray-600">No data found.</p>
          </motion.div>
        )}

        {/* PAGINATION */}
        {!loading && data.length > 0 && (
          <div className="flex items-center justify-between mt-14 lg:mt-8">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}{" "}
              entries
            </p>
            <div className="flex space-x-2 items-center content-center">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                className={`px-1.5 py-0.5 ${
                  isCollapsed ? "md:px-3 md:py-1" : "lg:px-3 lg:py-1"
                } border border-gray-300 rounded-md text-sm hover:bg-gray-200 cursor-pointer`}
              >
                <span
                  className={`hidden ${isCollapsed ? "md:block" : "lg:block"}`}
                >
                  Previous
                </span>
                <img
                  src={prevIcon}
                  width="20"
                  className={`block ${isCollapsed ? "md:hidden" : "lg:hidden"}`}
                  alt="prev icon"
                />
              </Button>
              <h1
                className={`font-semibold text-base ${
                  isCollapsed ? "md:text-base" : "lg:text-base"
                }`}
              >
                {currentPage}
              </h1>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                className={`px-1.5 py-0.5 ${
                  isCollapsed ? "md:px-3 md:py-1" : "lg:px-3 lg:py-1"
                } border border-gray-300 rounded-md text-sm hover:bg-gray-200 cursor-pointer`}
              >
                <span
                  className={`hidden ${isCollapsed ? "md:block" : "lg:block"}`}
                >
                  Next
                </span>
                <img
                  src={nextIcon}
                  width="20"
                  className={`block ${isCollapsed ? "md:hidden" : "lg:hidden"}`}
                  alt="next icon"
                />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

SearchListCard.propTypes = {
  cardName: PropTypes.string,
  listConfig: PropTypes.object,
  fetchUrl: PropTypes.string,
  isCollapsed: PropTypes.bool,
};
