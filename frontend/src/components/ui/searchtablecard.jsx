import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import searchIcon from "../../assets/search.svg";
import filterIcon from "../../assets/filter.svg";
import nextIcon from "../../assets/next.svg";
import prevIcon from "../../assets/prev.svg";
import { motion } from "framer-motion";
import FilterPopup from "../../components/ui/filterpopup";
import Parser from "html-react-parser";
import { icons } from "../../assets/icons";

/**
 * Example tableConfig:
 * {
 *   createButton: { iconUrl: "src/assets/react.svg" },
 *   columns: [
 *     { type: "icon", iconUrl: "src/assets/react.svg" },
 *     {
 *       type: "data",
 *       header: "AMOUNT",
 *       w_expand: "w-7/15 lg:w-4/12",
 *       w_collapse: "w-2/5 sm:w-2/5 md:w-2/6 lg:w-2/6",
 *       alignment: "justify-start",
 *       text_size: "font-bold sm:text-lg md:text-2xl sm:pl-5",
 *       mobile: true,
 *       name: "amount",
 *     },
 *     {
 *       type: "data",
 *       header: "DATE DEPOSIT",
 *       w_expand: "w-1/2 lg:w-4/12",
 *       w_collapse: "w-3/5 sm:w-3/5 md:w-2/6 lg:w-2/6",
 *       alignment: "justify-center",
 *       text_size: "text-sm md:text-base",
 *       mobile: true,
 *       name: "dateDeposited",
 *     },
 *     {
 *       type: "data",
 *       header: "SOURCE",
 *       w_expand: "hidden lg:block w-7/15 lg:w-4/12",
 *       w_collapse: "hidden md:block md:w-2/6 lg:w-2/6",
 *       alignment: "justify-center",
 *       mobile: false,
 *       text_size: "text-sm md:text-base",
 *       name: "source",
 *     },
 *     { type: "hidden", name: "id" },
 *     { type: "action", name: "View", iconUrl: "src/assets/react.svg" },
 *   ],
 * }
 */

export default function SearchTableCard({
  cardName,
  userData, // JSON string with user data
  tableConfig,
  fetchUrl,
  isCollapsed,
  itemsPerPage = 7,
  viewModal: ViewModal, // Custom modal component for viewing
  createModal: CreateModal, // Custom modal component for creating
  updateModal: UpdateModal, // Custom modal component for updating
  deleteModal: DeleteModal, // Custom modal component for deleting
  testMode,
  testData, // { data: [...], years: [...] }
  cardSize = "h-113 md:h-117",
}) {
  // ------------------------------
  // State: Data, Loading, Filters
  // ------------------------------
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [year, setYear] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  // State to track window width for mobile detection
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // ------------------------------
  // State: Modals (Create, View, etc.)
  // ------------------------------
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function getMode() {
    const hasSearch = searchTerm.trim().length > 0;
    const hasFilter = year || startDate || endDate;
    if (hasSearch && hasFilter) return "Mixed";
    if (hasSearch) return "Search";
    if (hasFilter) return "Filter";
    return "Populate";
  }

  function buildRequestBody(mode) {
    let parsedUser = {};
    try {
      parsedUser = JSON.parse(userData || "{}");
    } catch (e) {
      console.warn("Invalid userData JSON:", e);
    }
    const body = { mode, user: parsedUser };
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
      const sortedData = fetchedData.sort(
        (a, b) =>
          new Date(b.dateDeposited || b.dateApproved) -
          new Date(a.dateDeposited || a.dateApproved)
      );
      setData(sortedData);
      setAvailableYears(Array.isArray(result.years) ? result.years : []);
    } catch (error) {
      console.error("Error fetching table data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (testMode && testData && Array.isArray(testData.data)) {
      const sortedTestData = [...testData.data].sort(
        (a, b) =>
          new Date(b.dateDeposited || b.dateApproved) -
          new Date(a.dateDeposited || a.dateApproved)
      );
      setData(sortedTestData);
      setAvailableYears(testData.years || []);
    } else {
      fetchData("Populate");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testMode, testData]);

  function handleSearch() {
    if (testMode && testData && Array.isArray(testData.data)) {
      // Local filtering using testData
      let filteredData = [...testData.data];

      // Apply search filter (if searchTerm is provided)
      if (searchTerm.trim()) {
        filteredData = filteredData.filter((item) =>
          Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase())
        );
      }

      // Apply year filter if provided
      if (year) {
        filteredData = filteredData.filter(
          (item) => new Date(item.dateDeposited).getFullYear() === Number(year)
        );
      }

      // Apply start date filter if provided
      if (startDate) {
        filteredData = filteredData.filter(
          (item) => new Date(item.dateDeposited) >= new Date(startDate)
        );
      }

      // Apply end date filter if provided
      if (endDate) {
        filteredData = filteredData.filter(
          (item) => new Date(item.dateDeposited) <= new Date(endDate)
        );
      }

      // Sort the filtered data (newest first)
      const sortedData = filteredData.sort(
        (a, b) =>
          new Date(b.dateDeposited || b.dateApproved) -
          new Date(a.dateDeposited || a.dateApproved)
      );
      setData(sortedData);
      setAvailableYears(testData.years || []);
      setCurrentPage(1);
    } else {
      // Normal behavior
      if (!searchTerm.trim()) {
        fetchData("Populate");
        return;
      }
      setCurrentPage(1);
      fetchData(getMode());
    }
  }

  useEffect(() => {
    if (!searchTerm.trim() && !testMode) {
      fetchData("Populate");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  function handleApplyFilter() {
    setFilterOpen(false);
    setCurrentPage(1);
    fetchData(getMode());
  }

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = data.slice(startIndex, startIndex + itemsPerPage);

  function handlePageChange(page) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  function handleView(rowData) {
    setSelectedRow(rowData);
    setShowViewModal(true);
  }

  function refreshData() {
    fetchData("Populate");
  }

  // ------------------------------
  // Render
  // ------------------------------
  return (
    <div className="font-[archivo] text-gray-800 relative">
      {/* Filter Popup */}
      {filterOpen && (
        <FilterPopup
          availableYears={availableYears}
          year={year}
          startDate={startDate}
          endDate={endDate}
          onYearChange={setYear}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onApply={handleApplyFilter}
          onCancel={() => setFilterOpen(false)}
        />
      )}

      {/* CREATE MODAL */}
      {CreateModal && (
        <CreateModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          refreshData={refreshData} // Added refresh callback
        />
      )}

      {/* VIEW MODAL */}
      {ViewModal && (
        <ViewModal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          id={selectedRow?.id || null}
          updateModal={UpdateModal}
          deleteModal={DeleteModal}
          refreshData={refreshData}
        />
      )}

      {/* TOP BAR: Card Name + Create Button */}
      <div className="flex items-center justify-between bg-[#EA916E] rounded-t-xl px-4 py-2">
        <h1 className="text-2xl md:text-3xl font-bold">{cardName}</h1>
        {CreateModal && (
          <Button
            onClick={() => setShowCreateModal(true)}
            className="transition-all duration-300 bg-[#ff7d32] text-white md:hover:bg-[#a55121] cursor-pointer p-2 md:px-3 md:py-1 rounded-md flex flex-row hover:-translate-y-0.5"
          >
            {tableConfig.createButton?.iconUrl ? (
              <img
                src={
                  icons[tableConfig.createButton.iconUrl] ||
                  tableConfig.createButton.iconUrl
                }
                alt="create icon"
                width="20"
              />
            ) : (
              "+"
            )}
            {tableConfig.createButton?.name ? (
              <span
                className={`hidden mx-2 text-lg ${
                  isCollapsed ? "md:block" : "lg:block"
                }`}
              >
                {tableConfig.createButton.name}
              </span>
            ) : (
              "Create"
            )}
          </Button>
        )}
      </div>

      {/* MAIN CONTENT: List Rows */}
      <div className="bg-white p-4 rounded-b-xl">
        {/* SEARCH & FILTER BAR */}
        <div className="flex items-center justify-end sm:justify-between pb-4 w-full">
          {/* RECORD COUNT (aligned left) */}
          <div className="hidden sm:block text-sm sm:text-base text-gray-600 pl-2">
            Total Records: {totalItems}
          </div>
          {/* SEARCH & FILTER (aligned right) */}
          <div className="transition-all flex space-x-2 justify-between sm:justify-end items-center w-full sm:w-auto">
            <div className="flex flex-row w-88/100 sm:w-auto">
              <Input
                type="text"
                placeholder="Search"
                className={`transition-all bg-white text-sm sm:text-base self-stretch rounded-l-md w-86/100 sm:w-100 border border-gray-400 ${
                  isCollapsed ? "md:w-90 lg:w-120" : "md:w-45 lg:w-100"
                } h-7`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <Button
                onClick={handleSearch}
                className="px-2 py-1 bg-blue-600 w-14/100 sm:w-auto text-white rounded-r-md hover:bg-blue-700 justify-items-center cursor-pointer"
              >
                <img src={searchIcon} width="20" alt="search icon" />
              </Button>
            </div>
            <Button
              onClick={() => setFilterOpen(true)}
              className="w-12/100 sm:w-auto px-2 py-1 bg-gray-300 text-black rounded-md hover:bg-gray-400 justify-items-center cursor-pointer h-7"
            >
              <img src={filterIcon} width="20" alt="filter icon" />
            </Button>
          </div>
        </div>

        {/* HEADER ROW FOR THE LIST */}
        <div
          className={`hidden ${
            isCollapsed ? "md:flex" : "lg:flex"
          } flex-row bg-[#EA916E] border border-gray-300 shadow-sm text-white  font-bold rounded-lg py-0.5`}
        >
          {tableConfig.columns.map((col, index) => {
            if (col.type === "hidden") return null;
            if (col.type === "icon") {
              return (
                <div key={index} className="w-16 text-center">
                  {/* Blank header for icon column */}
                </div>
              );
            }
            if (col.type === "action") {
              return (
                <div key={index} className="text-center w-16 md:w-30">
                  {col.header || ""}
                </div>
              );
            }
            if (col.type === "data") {
              return (
                <div
                  key={index}
                  className={`px-2 flex items-center justify-center ${
                    isCollapsed ? col.w_collapse : col.w_expand
                  }`}
                >
                  <h1
                    className={`text-sm text-center ${
                      isCollapsed ? "md:text-base" : "lg:text-base"
                    }`}
                  >
                    {col.header || ""}
                  </h1>
                </div>
              );
            }
            return null;
          })}
        </div>

        {loading && (
          <motion.div
            initial={{ opacity: 0.1, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 2 }}
            transition={{ duration: 1 }}
            className="mt-2 h-124 md:h-128 flex items-center justify-center"
          >
            <p className="text-center py-2">Loading...</p>
          </motion.div>
        )}

        {/* For screens sm and up, use standard layout */}
        <div className={`hidden ${isCollapsed ? "md:block" : "lg:block"}`}>
          {!loading && currentItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0.5, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 2 }}
              transition={{ duration: 0.5 }}
              className={`space-y-2 mt-2 ${cardSize}`}
            >
              {currentItems.map((rowData, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex flex-row h-15 bg-gray-50 border border-gray-300 hover:bg-gray-100 rounded-lg overflow-hidden shadow-sm transition-all md:hover:-translate-y-0.5 cursor-pointer sm:cursor-default"
                >
                  {tableConfig.columns.map((col, colIndex) => {
                    if (col.type === "hidden") {
                      return (
                        <input
                          key={colIndex}
                          type="hidden"
                          name={col.name}
                          value={rowData[col.name] || ""}
                          readOnly
                        />
                      );
                    }
                    if (col.type === "icon") {
                      return (
                        <div
                          key={colIndex}
                          className="bg-red-600 w-16 flex items-center justify-center text-white"
                        >
                          {col.iconUrl ? (
                            <img
                              src={icons[col.iconUrl] || col.iconUrl}
                              alt="icon"
                              className="w-6 h-6"
                            />
                          ) : (
                            <span className="text-xs font-bold">ICON</span>
                          )}
                        </div>
                      );
                    }
                    if (col.type === "data") {
                      return (
                        <div
                          key={colIndex}
                          className={`px-2 py-2 flex items-center ${
                            col.alignment
                          } ${isCollapsed ? col.w_collapse : col.w_expand}`}
                        >
                          <h1
                            className={`${col.text_size} text-center align-middle`}
                          >
                            {rowData[col.name] ?? "N/A"}
                          </h1>
                        </div>
                      );
                    }
                    if (col.type === "action") {
                      if (!ViewModal) return null;
                      return (
                        <div
                          key={colIndex}
                          className="text-center w-16 md:w-30 flex items-center justify-center"
                        >
                          <Button
                            className="text-black cursor-pointer flex flex-row"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleView(rowData);
                            }}
                          >
                            <img
                              src={col.iconUrl}
                              alt="create icon"
                              width="18"
                            />
                            <h1 className="ml-1">{col.name || "View"}</h1>
                          </Button>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* For screens smaller than sm: single-column layout */}
        <div className={`block ${isCollapsed ? "md:hidden" : "lg:hidden"}`}>
          {!loading && data.length > 0 && (
            <motion.div
              initial={{ opacity: 0.5, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 2 }}
              transition={{ duration: 0.5 }}
              className="space-y-2 mt-2 overflow-y-auto h-120"
            >
              {data.map((rowData, rowIndex) => {
                // For mobile, we combine all data columns where col.mobile is true.
                const combinedData = tableConfig.columns
                  .filter((col) => col.type === "data" && col.mobile)
                  .map(
                    (col) =>
                      `<h1 className="overflow-hidden text-ellipsis"><strong>${
                        col.header
                      }</strong>: ${rowData[col.name] ?? "N/A"}</h1>`
                  )
                  .join("");
                return (
                  <div
                    key={rowIndex}
                    className="flex flex-row bg-gray-50 border border-gray-300 hover:bg-gray-100 rounded-lg overflow-hidden shadow-sm transition-all cursor-pointer"
                    onClick={() => handleView(rowData)}
                  >
                    {/** Icon Column */}
                    {tableConfig.columns.find((col) => col.type === "icon") && (
                      <div className="bg-red-600 w-16 flex items-center justify-center text-white mr-2">
                        {tableConfig.columns.find((col) => col.type === "icon")
                          .iconUrl ? (
                          <img
                            src={
                              tableConfig.columns.find(
                                (col) => col.type === "icon"
                              ).iconUrl
                            }
                            alt="icon"
                            className="w-6 h-6"
                          />
                        ) : (
                          <span className="text-xs font-bold">ICON</span>
                        )}
                      </div>
                    )}
                    <div className="flex-1 whitespace-pre-line py-2">
                      <div className="text-sm md:text-base overflow-hidden truncate">
                        {Parser(combinedData)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </div>

        {!loading && data.length === 0 && (
          <motion.div
            initial={{ opacity: 0.1, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 2 }}
            transition={{ duration: 0.75 }}
            className="mt-2 h-124 md:h-128 flex items-center justify-center"
          >
            <p className="text-sm text-gray-600">No data found.</p>
          </motion.div>
        )}

        {!loading &&
          data.length > 0 &&
          windowWidth >= (isCollapsed ? 768 : 640) && (
            <motion.div
              initial={{ opacity: 0.1, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 2 }}
              transition={{ duration: 0.75 }}
              className="mt-4 font-[inter]"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(startIndex + itemsPerPage, totalItems)} of{" "}
                  {totalItems} entries
                </p>
                <div className="flex space-x-2 items-center">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={`px-1.5 py-0.5 ${
                      isCollapsed ? "md:px-3 md:py-1" : "lg:px-3 lg:py-1"
                    } rounded-l-md text-sm bg-[#DEE1E6] transition-all duration-150 hover:bg-gray-400 cursor-pointer transform hover:scale-105`}
                  >
                    <span
                      className={`hidden ${
                        isCollapsed ? "md:block" : "lg:block"
                      }`}
                    >
                      Previous
                    </span>
                    <img
                      src={prevIcon}
                      width="20"
                      className={`block ${
                        isCollapsed ? "md:hidden" : "lg:hidden"
                      }`}
                      alt="prev icon"
                    />
                  </Button>
                  <h1
                    className={`font-semibold text-base bg-[#DEE1E6] w-8 text-center ${
                      isCollapsed
                        ? "md:text-base md:h-7 md:p-0.5"
                        : "lg:text-base lg:h-7 lg:p-0.5"
                    }`}
                  >
                    {currentPage}
                  </h1>
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={`px-1.5 py-0.5 ${
                      isCollapsed ? "md:px-3 md:py-1" : "lg:px-3 lg:py-1"
                    } rounded-r-md text-sm bg-[#DEE1E6] transition-all duration-150 hover:bg-gray-400 cursor-pointer transform hover:scale-105`}
                  >
                    <span
                      className={`hidden ${
                        isCollapsed ? "md:block" : "lg:block"
                      }`}
                    >
                      Next
                    </span>
                    <img
                      src={nextIcon}
                      width="20"
                      className={`block ${
                        isCollapsed ? "md:hidden" : "lg:hidden"
                      }`}
                      alt="next icon"
                    />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
      </div>
    </div>
  );
}

SearchTableCard.propTypes = {
  cardName: PropTypes.string.isRequired,
  userData: PropTypes.string,
  tableConfig: PropTypes.shape({
    createButton: PropTypes.shape({
      iconUrl: PropTypes.string,
      name: PropTypes.string,
    }),
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(["icon", "data", "hidden", "action"]).isRequired,
        iconUrl: PropTypes.string,
        header: PropTypes.string,
        w_expand: PropTypes.string,
        w_collapse: PropTypes.string,
        alignment: PropTypes.string,
        text_size: PropTypes.string,
        mobile: PropTypes.bool,
        name: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
  isCollapsed: PropTypes.bool,
  itemsPerPage: PropTypes.number,
  fetchUrl: PropTypes.string.isRequired,
  viewModal: PropTypes.elementType,
  createModal: PropTypes.elementType,
  updateModal: PropTypes.elementType,
  deleteModal: PropTypes.elementType,
  testMode: PropTypes.bool,
  testData: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.object),
    years: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
  }),
  cardSize: PropTypes.string,
};
