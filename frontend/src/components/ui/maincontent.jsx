import { Helmet } from "react-helmet-async";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { memo } from "react";

function MainContent({
  titletab,
  contentName,
  showContentNameMobileOnly,
  children,
  textFormat,
}) {
  return (
    <div
      className={`px-3 pt-3 md:px-4 ${
        !showContentNameMobileOnly ? "md:pt-4" : "md:pt-0"
      } transition-all`}
    >
      <Helmet>
        <title>{titletab}</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full"
      >
        <h1
          className={`h-12 ${textFormat} md:text-5xl font-bold mt-2.5 md:mt-2 mb-5 md:mb-4 ml-16 md:ml-6 truncate ${
            showContentNameMobileOnly ? "md:hidden" : "block"
          }`}
        >
          {contentName}
        </h1>

        <div
          className={`overflow-auto h-[calc(100vh-92px)] pb-3 md:pb-4 ${
            showContentNameMobileOnly
              ? "mt-3 md:h-[calc(100vh)]"
              : "mt-4 md:h-[calc(100vh-86px)]"
          }`}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}

MainContent.propTypes = {
  titletab: PropTypes.string.isRequired,
  contentName: PropTypes.string.isRequired,
  children: PropTypes.node,
  showContentNameMobileOnly: PropTypes.bool,
  textFormat: PropTypes.string,
};

// Wrap MainContent with React.memo to prevent unnecessary re-renders
export default memo(MainContent);
