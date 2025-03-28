import { Helmet } from "react-helmet-async";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

export default function MainContent({ titletab, contentName, children }) {
  return (
    <div className="px-3 pt-3 md:px-4 md:pt-4 transition-all">
      <Helmet>
        <title>{titletab}</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <h1 className="text-[32px] md:text-5xl font-bold mt-3 md:mt-2 mb-5 md:mb-4 ml-16 md:ml-6">
          {contentName}
        </h1>
        <div className="overflow-auto h-[calc(100vh-92px)] pb-3 md:pb-4 md:h-[calc(100vh-88px)]">
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
};
