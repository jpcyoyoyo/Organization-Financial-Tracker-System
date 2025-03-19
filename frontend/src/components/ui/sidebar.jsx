import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import configData from "../../data/sidebarConfig.json";
import Logo from "../../components/ui/logo";

// This function returns the sidebar configuration based on the user's designation
const getSidebarConfig = (designation) => {
  const topLevelTabs = configData.topLevelTabs;
  const groups = [];

  if (designation === "Admin") {
    // For Admin, include only the Admin Panel and Preferences groups
    groups.push({
      groupName: "Admin Panel",
      tabs: configData.groups["Admin Panel"],
    });
    groups.push({
      groupName: "Preferences",
      tabs: configData.groups["Preferences"],
    });
  } else {
    // For non-admin users, iterate over each group in the config
    Object.entries(configData.groups).forEach(([groupName, groupData]) => {
      // Skip admin-specific groups for non-admin users
      if (groupName === "Admin Panel") {
        return;
      }
      if (groupName === "Your Obligations") {
        // For 'Your Obligations', choose tabs based on designation
        if (designation === "Representative") {
          groups.push({ groupName, tabs: groupData["Representative"] });
        } else {
          groups.push({ groupName, tabs: groupData["default"] });
        }
      } else {
        // For other groups, groupData is an array of tabs
        groups.push({ groupName, tabs: groupData });
      }
    });
  }

  return { topLevelTabs, groups };
};

export const Sidebar = ({ user, designation }) => {
  const config = getSidebarConfig(designation);

  const userData = JSON.parse(user);

  return (
    <nav className="fixed top-0 left-0 h-screen w-78 bg-[#ffffffe6] backdrop-opacity-10 backdrop-blur-md p-3.5 transition-width duration-300 overflow-y-auto scrollbar-thin font-[inter] not-italic transition-transform transform">
      {/* Profile Section */}
      <div className="flex flex-col items-center">
        <div className="flex items-center space-y-2">
          <Logo size="44" />
          <h1 className="text-[29px] font-bold flex items-center font-[archivo] pl-2 w-60 text-center">
            COMSOC OFTS
          </h1>
        </div>

        <div className="flex items-center space-x-2 mt-5">
          <Logo size="44" />
          <div className="flex flex-col pl-2 w-40">
            <p className="text-sm font-bold">{userData.full_name}</p>
            <p className="text-xs">{designation}</p>
          </div>
          <NavLink
            to="/editprofile"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-lg text-base transition hover:-translate-y-0.5 bg-[#ffc34c] text-white font-bold ${
                isActive ? "hover:bg-[#d9ab4e]" : "hover:bg-[#9494945d]"
              }`
            }
          >
            ksodj
          </NavLink>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mt-5">
        {/* Top-level Tabs */}
        <ul className="space-y-1">
          {config.topLevelTabs.map((tab) => (
            <li key={tab.path}>
              <NavLink
                to={tab.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg text-base transition hover:-translate-y-0.5 ${
                    isActive
                      ? "bg-[#ffc34c] text-white font-bold hover:bg-[#d9ab4e]"
                      : "hover:bg-[#9494945d]"
                  }`
                }
              >
                <img src={tab.icon} alt={tab.label} className="w-6 h-6 mr-3" />
                {tab.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Grouped Tabs */}
        {config.groups.map((group) => (
          <div key={group.groupName} className="mt-5">
            <h3 className="px-3 py-1 text-xs font-semibold text-gray-700 uppercase">
              {group.groupName}
            </h3>
            <ul className="space-y-1">
              {group.tabs.map((tab) => (
                <li key={tab.path}>
                  <NavLink
                    to={tab.path}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 rounded-lg text-base transition hover:-translate-y-0.5 ${
                        isActive
                          ? "bg-[#ffc34c] text-white font-bold"
                          : "hover:bg-[#9494945d]"
                      }`
                    }
                  >
                    <img
                      src={tab.icon}
                      alt={tab.label}
                      className="w-6 h-6 mr-3"
                    />
                    {tab.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
};

Sidebar.propTypes = {
  user: PropTypes.string.isRequired,
  designation: PropTypes.oneOf([
    "President",
    "Treasurer",
    "Auditor",
    "PIO",
    "Representative",
    "Member",
  ]),
};

export default Sidebar;
