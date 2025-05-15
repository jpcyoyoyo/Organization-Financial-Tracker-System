import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import searchIcon from "../../assets/search.svg";
import filterIcon from "../../assets/filter.svg";
import nextIcon from "../../assets/next.svg";
import prevIcon from "../../assets/prev.svg";
import { motion } from "framer-motion";
import FilterPopup from "../../components/ui/filterpopup";
import { icons } from "../../assets/icons";
import deepEqual from "fast-deep-equal";

/**
 * Example listConfig structure:
 * {
 *   columns: [
 *     { type: "icon", iconUrl: "iconUrl" },
 *     {
 *       type: "double",
 *       w_expand: "w-full md:w-8/15 lg:w-9/12",
 *       w_collapse: "w-full md:w-5/7 lg:w-4/5",
 *       variables: [
 *         { key: "Key 1: ", name: "value1" },
 *         { key: "Key 2:", name: "value2" }
 *       ]
 *     },
 *     { type: "single", key: "Key", name: "value" }
 *   ]
 * }
 */

export default function SearchListCard({
  cardName,
  userData,
  listConfig,
  fetchUrl,
  isCollapsed,
  viewModal: ViewModal, // Custom modal component for viewing
  createModal: CreateModal, // Custom modal component for creating
  updateModal: UpdateModal, // Custom modal component for updating
  deleteModal: DeleteModal, // Custom modal component for deleting
  testMode,
  testData, // Expected shape: { data, years }
  cardSize = "h-87 md:h-97",
  mobileCardSize = "h-120",
  itemsPerPage = 5,
}) {
  // ------------------------------
  // State: Data, Loading, Filters
  // ------------------------------
  const [data, setData] = useState([]);
  const [isNewData, setIsNewData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [year, setYear] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetching, setFetching] = useState(true);
  const [mobileItemsCount, setMobileItemsCount] = useState(itemsPerPage * 2); // Double the itemsPerPage for mobile
  const mobileContainerRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // ------------------------------
  // State: Modals (Create, View, etc.)
  // ------------------------------
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const lastDataRef = useRef(null);
  const timerRef = useRef(null);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  const getMode = useCallback(() => {
    const hasSearch = searchTerm.trim().length > 0;
    const hasFilter = year || startDate || endDate;
    if (hasSearch && hasFilter) return "Mixed";
    if (hasSearch) return "Search";
    if (hasFilter) return "Filter";
    return "Populate";
  }, [searchTerm, year, startDate, endDate]);

  const requestBody = useMemo(() => {
    const parsedUser = JSON.parse(userData || "{}");
    const body = { mode: getMode(), user: parsedUser };

    if (searchTerm.trim()) {
      body.searchTerm = searchTerm;
    }
    if (year || startDate || endDate) {
      body.year = year;
      body.startDate = startDate;
      body.endDate = endDate;
    }

    return JSON.stringify(body);
  }, [userData, searchTerm, year, startDate, endDate, getMode]);

  const fetchData = useCallback(async () => {
    if (!isVisible) {
      console.log("Current tab is not active, skipping fetch");
      setFetching(false);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(fetchUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody,
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

      if (sortedData !== data) {
        setData(sortedData);
      }
      setAvailableYears(Array.isArray(result.years) ? result.years : []);

      if (sortedData.length === 0 && data.length === 0) {
        console.warn(
          "No records found, attempting to fetch again in 5 seconds..."
        );
        timerRef.current = setTimeout(fetchData, 60000);
      }
    } catch (error) {
      console.error("Error fetching table data:", error);
      setData([]);
      setError(error.message);
      timerRef.current = setTimeout(fetchData, 60000);
      console.log("Reattempt fetching");
    } finally {
      setLoading(false);
      setFetching(false);
    }
  }, [isVisible, fetchUrl, requestBody, data]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        setFetching(false);
      }
    };
  }, []);

  useEffect(() => {
    if (
      getMode() === "Populate" &&
      !fetching &&
      lastDataRef.current.length &&
      !deepEqual(data, lastDataRef.current)
    ) {
      setIsNewData(true);
      setLoading(true);
      fetchData();
      console.log("Updating data...");
      setTimeout(() => setIsNewData(false), 800);
    }
    lastDataRef.current = data;
  }, [data, fetching, getMode, fetchData]);

  useEffect(() => {
    if (testMode && testData && Array.isArray(testData.data)) {
      const sortedTestData = [...testData.data].sort(
        (a, b) =>
          new Date(b.dateDeposited || b.dateApproved) -
          new Date(a.dateDeposited || a.dateApproved)
      );

      // Prevent infinite loop by checking if data already matches
      if (!deepEqual(data, sortedTestData)) {
        setData(sortedTestData);
      }

      setAvailableYears(testData.years || []);
    } else {
      if (fetching) {
        fetchData();
        if (!data) {
          setLoading(true);
        }
        console.log("Fetching data...");
      }
    }
  }, [testMode, testData, fetching, fetchData, data]);

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
      setCurrentPage(1);
      setLoading(true);
      setFetching(true);
    }
  }

  useEffect(() => {
    if (!searchTerm.trim() && !testMode) {
      setFetching(true);
    }
  }, [searchTerm, testMode]);

  function handleResetFilter() {
    setYear("");
    setStartDate("");
    setEndDate("");
    setFilterOpen(false);
    setLoading(true);
    setFetching(true);
  }

  function handleApplyFilter() {
    setFilterOpen(false);
    setCurrentPage(1);
    setLoading(true);
    setFetching(true);
  }

  useEffect(() => {
    if (!searchTerm.trim() && !testMode) {
      setFetching(true);
    }
  }, [setFetching, searchTerm, testMode]);

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
    if (searchTerm.trim()) {
      setSearchTerm("");
    }

    setFetching(true);
    console.log("Refreshing data...");
  }

  const handleLoadMore = useCallback(() => {
    if (mobileItemsCount < data.length) {
      setMobileItemsCount((prevCount) =>
        Math.min(prevCount + itemsPerPage * 2, data.length)
      );
    }
  }, [mobileItemsCount, data.length, itemsPerPage]);

  useEffect(() => {
    console.log(
      "[MobileScroll] effect run →",
      "windowWidth:",
      windowWidth,
      "mobileItemsCount:",
      mobileItemsCount,
      "data.length:",
      data.length,
      "mobileContainerRef",
      mobileContainerRef.current
    );

    if (
      windowWidth < (isCollapsed ? 768 : 1024) &&
      mobileContainerRef.current
    ) {
      const scrollEl = mobileContainerRef.current;

      const onScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = scrollEl;
        console.log("[MobileScroll:onScroll]", {
          scrollTop,
          clientHeight,
          scrollHeight,
        });

        if (scrollTop + clientHeight >= scrollHeight - 10) {
          console.log("[MobileScroll] bottom reached → loading more");
          handleLoadMore();
        }
      };

      scrollEl.addEventListener("scroll", onScroll);
      return () => {
        console.log("[MobileScroll] cleaning up listener");
        scrollEl.removeEventListener("scroll", onScroll);
      };
    }
  }, [windowWidth, mobileItemsCount, data.length, handleLoadMore, isCollapsed]);

  const loadingMessage = (() => {
    if (!loading) return null; // no message if not loading
    if (isNewData) return "Updating…";
    switch (getMode()) {
      case "Mixed":
        return "Searching records with filter applied…";
      case "Search":
        return "Searching records…";
      case "Filter":
        return "Filtering records…";
      default:
        return "Loading…";
    }
  })();

  // ------------------------------
  // Render
  // ------------------------------
  return (
    <div ref={containerRef} className="font-[archivo] text-gray-800 relative">
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
          onReset={handleResetFilter}
        />
      )}

      {CreateModal && (
        <CreateModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          refreshData={refreshData} // Added refresh callback
        />
      )}

      {ViewModal && (
        <ViewModal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          onGoBack={() => setShowViewModal(true)}
          id={selectedRow?.id || null}
          updateModal={UpdateModal}
          deleteModal={DeleteModal}
          refreshData={refreshData} // Added refresh callback
        />
      )}

      {/* TOP BAR: Card Name + Create Button */}
      <div className="flex items-center justify-between bg-[#EA916E] rounded-t-xl px-4 py-2">
        <h1 className="text-2xl md:text-3xl font-bold truncate">{cardName}</h1>
        {CreateModal && (
          <Button
            onClick={() => setShowCreateModal(true)}
            className={`transition-all duration-300 bg-[#ff7d32] text-white md:hover:bg-[#a55121] cursor-pointer p-2 ${
              isCollapsed ? "md:px-3 md:py-1" : "lg:px-3 lg:py-1"
            } rounded-md flex flex-row hover:-translate-y-0.5`}
          >
            {listConfig.createButton?.iconUrl ? (
              <img
                src={
                  icons[listConfig.createButton.iconUrl] ||
                  listConfig.createButton.iconUrl
                }
                alt="create icon"
                width="20"
              />
            ) : (
              "+"
            )}
            {listConfig.createButton?.name ? (
              <span
                className={`hidden mx-2 text-lg ${
                  isCollapsed ? "md:block" : "lg:block"
                }`}
              >
                {listConfig.createButton.name}
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
          <div
            className={`hidden ${
              isCollapsed ? "md:block" : "lg:block"
            } text-sm sm:text-base text-gray-600 pl-2`}
          >
            Total Records: {totalItems}
          </div>
          {/* SEARCH & FILTER (aligned right) */}
          <div
            className={`transition-all flex space-x-2 justify-between ${
              isCollapsed
                ? "md:justify-end md:w-auto"
                : "lg:justify-end lg:w-auto"
            } items-center w-full`}
          >
            <div
              className={`flex flex-row w-88/100 ${
                isCollapsed ? "md:w-auto" : "lg:w-auto"
              }`}
            >
              <Input
                type="text"
                placeholder="Search"
                className={`transition-all bg-white text-sm sm:text-base self-stretch rounded-l-md w-86/100 border border-gray-400 ${
                  isCollapsed ? "md:w-90 lg:w-120" : "md:w-150 lg:w-100"
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
                className="px-2 py-1 bg-blue-600 w-14/100 md:w-auto text-white rounded-r-md hover:bg-blue-700 justify-items-center cursor-pointer"
              >
                <img src={searchIcon} width="20" alt="search icon" />
              </Button>
            </div>
            <Button
              onClick={() => setFilterOpen(true)}
              className="w-12/100 md:w-auto px-2 py-1 bg-gray-300 text-black rounded-md hover:bg-gray-400 justify-items-center cursor-pointer h-7"
            >
              <img src={filterIcon} width="20" alt="filter icon" />
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-b-xl">
          {loading && (
            <motion.div
              initial={{ opacity: 0.1, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 2 }}
              transition={{ duration: 1 }}
              className={`mt-2 ${
                cardSize || "h-124 md:h-128"
              } flex items-center justify-center`}
            >
              <p className="text-sm text-gray-600">{loadingMessage}</p>
            </motion.div>
          )}

          <div className={`hidden ${isCollapsed ? "md:block" : "lg:block"}`}>
            {!loading && currentItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0.5, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 2 }}
                transition={{ duration: 0.5 }}
              >
                <div className={`space-y-3 ${cardSize}`}>
                  {currentItems.map((rowData, idx) => (
                    <div
                      key={idx}
                      className="flex flex-row bg-gray-50 border border-gray-300 hover:bg-gray-100 rounded-md overflow-hidden shadow-sm transition-all md:hover:-translate-y-1 cursor-pointer"
                      onClick={() => handleView(rowData)}
                    >
                      {listConfig.columns.map((col, cIndex) => {
                        if (col.type === "hidden") {
                          return (
                            <input
                              key={cIndex}
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
                              key={cIndex}
                              className="bg-red-600 w-18 flex items-center justify-center text-white"
                            >
                              {col.iconUrl ? (
                                <img
                                  src={icons[col.iconUrl] || col.iconUrl}
                                  alt="icon"
                                  className="w-8 h-8"
                                />
                              ) : (
                                <span className="text-sm font-bold">ICON</span>
                              )}
                            </div>
                          );
                        }
                        if (col.type === "double") {
                          return (
                            <div
                              key={cIndex}
                              className={`flex flex-col justify-center bg-gray-100 px-3 py-2 ${
                                isCollapsed ? col.w_collapse : col.w_expand
                              }`}
                            >
                              <p className="text-xs lg:text-sm font-bold">
                                {rowData[col.variables[0].name] ??
                                  (col.default || "N/A")}
                              </p>
                              <p className="text-base lg:text-lg">
                                <strong>
                                  {col.variables[1].key
                                    ? `${col.variables[1].key}: `
                                    : ""}
                                </strong>
                                {rowData[col.variables[1].name] ??
                                  (col.default || "N/A")}
                              </p>
                            </div>
                          );
                        }
                        if (col.type === "single") {
                          return (
                            <div
                              key={cIndex}
                              className={`hidden md:flex flex-col justify-center bg-gray-100 px-3 py-2 ${
                                isCollapsed ? col.w_collapse : col.w_expand
                              }`}
                            >
                              <p className="text-xs lg:text-sm">
                                <strong>
                                  {col.key ? `${col.key}: ` : ""}{" "}
                                </strong>
                              </p>
                              <p className="text-base lg:text-lg">
                                {rowData[col.name] ?? (col.default || "N/A")}
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
          </div>

          {/* For screens smaller than sm: single-column layout */}
          <div className={`block ${isCollapsed ? "md:hidden" : "lg:hidden"}`}>
            {!loading && data.length > 0 && (
              <motion.div
                ref={mobileContainerRef}
                initial={{ opacity: 0.5, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 2 }}
                transition={{ duration: 0.5 }}
                className={`space-y-2 mt-2 overflow-y-auto ${mobileCardSize}`}
              >
                {data.map((rowData, idx) => {
                  // Build cell elements instead of HTML strings
                  const cells = listConfig.columns
                    .filter((col) => col.mobile)
                    .map((col) => {
                      if (col.type === "double" && col.variables) {
                        const [first, second] = col.variables;
                        const elements = [];

                        if (first.mobile) {
                          elements.push(
                            <div
                              key={`${idx}-${first.name}`}
                              className="overflow-hidden truncate"
                            >
                              <strong>
                                {first.key ? `${first.key}: ` : ""}
                              </strong>
                              <span
                                className={`${
                                  !first.key && first.nameStyle
                                    ? first.nameStyle
                                    : ""
                                }`}
                              >
                                {rowData[first.name] ?? (col.default || "N/A")}
                              </span>
                            </div>
                          );
                        }
                        if (second.mobile) {
                          elements.push(
                            <div
                              key={`${idx}-${second.name}`}
                              className="overflow-hidden truncate"
                            >
                              <strong>
                                {second.key ? `${second.key}: ` : ""}
                              </strong>
                              <span
                                className={`${
                                  !second.key && second.nameStyle
                                    ? second.nameStyle
                                    : ""
                                }`}
                              >
                                {rowData[second.name] ?? (col.default || "N/A")}
                              </span>
                            </div>
                          );
                        }
                        return (
                          <div key={`double-${idx}`} className="space-y-1">
                            {elements}
                          </div>
                        );
                      } else if (col.type === "single" || col.type === "data") {
                        return (
                          <div
                            key={`${idx}-${col.name}`}
                            className="overflow-hidden truncate"
                          >
                            <strong>{col.key ? `${col.key}: ` : ""}</strong>
                            <span className={`${!col.key ? "text-base" : ""}`}>
                              {rowData[col.name] ?? (col.default || "N/A")}
                            </span>
                          </div>
                        );
                      }
                      return null;
                    });

                  const iconCol = listConfig.columns.find(
                    (col) => col.type === "icon"
                  );

                  return (
                    <div
                      key={idx}
                      className="flex flex-row bg-gray-50 border border-gray-300 hover:bg-gray-100 rounded-lg overflow-hidden shadow-sm transition-all cursor-pointer"
                      onClick={() => handleView(rowData)}
                    >
                      {iconCol && (
                        <div className="bg-red-600 w-16 flex-none flex items-center justify-center text-white p-2">
                          {iconCol.iconUrl ? (
                            <img
                              src={iconCol.iconUrl}
                              alt="icon"
                              className="w-6 h-6"
                            />
                          ) : (
                            <span className="text-xs font-bold">ICON</span>
                          )}
                        </div>
                      )}

                      <div className="flex-1 min-w-0 whitespace-pre-line py-2 px-2">
                        <div
                          className={`text-xs ${
                            isCollapsed ? "md:text-base" : "lg:text-base"
                          } space-y-1`}
                        >
                          {cells}
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
              className={`mt-2 ${
                cardSize || "h-124 md:h-128"
              } flex items-center justify-center`}
            >
              <p className="text-sm text-gray-600">
                {error ? error : "No record found."}
              </p>
            </motion.div>
          )}

          {/* Pagination: Only render on screens wider than 640px */}
          <motion.div
            initial={{ opacity: 0.1, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 2 }}
            transition={{ duration: 0.75 }}
            className={`hidden mt-4 font-[inter] h-7 ${
              isCollapsed ? "md:block" : "lg:block"
            }`}
          >
            {!loading &&
              data.length > 0 &&
              windowWidth >= (isCollapsed ? 768 : 640) && (
                <div
                  className={`mt-4 font-[inter] hidden items-center justify-between ${
                    isCollapsed ? "md:flex" : "lg:flex"
                  }`}
                >
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
                      className={`font-semibold text-base bg-[#DEE1E6] px-2.5 text-center ${
                        isCollapsed
                          ? "md:text-base md:h-7 md:py-0.5"
                          : "lg:text-base lg:h-7 lg:py-0.5"
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
              )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

SearchListCard.propTypes = {
  cardName: PropTypes.string,
  userData: PropTypes.string,
  listConfig: PropTypes.object,
  fetchUrl: PropTypes.string,
  isCollapsed: PropTypes.bool,
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
  mobileCardSize: PropTypes.string,
  itemsPerPage: PropTypes.number,
};
