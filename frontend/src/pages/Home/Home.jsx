import { Outlet } from "react-router-dom";
import { Sidebar } from "../../components/ui/sidebar";
import BackgroundSection from "../../components/ui/background";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Home() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <BackgroundSection>
        <div className="flex overflow-hidden">
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          <main
            className={`ml-0 transition-all duration-300 top-0 h-full overflow-hidden grow ${
              isCollapsed ? "md:ml-14" : "md:ml-76"
            } w-full`}
          >
            {/* The outlet renders the nested route components */}

            <Outlet context={{ isCollapsed }} />
          </main>
        </div>
      </BackgroundSection>
    </motion.div>
  );
}
