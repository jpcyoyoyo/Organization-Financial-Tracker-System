import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import configData from "../../data/sidebarConfig.json";
import Logo from "../../components/ui/logo";
import ProfilePic from "../../components/ui/profilepic";
import { useEffect, useState } from "react";
// This function returns the sidebar configuration based on the user's designation
const getSidebarConfig = (designation) => {
  const topLevelTabs = configData.topLevelTabs;
  const groups = [];

  if (designation === "Admin") {
    groups.push({
      groupName: "Admin Panel",
      tabs: configData.groups["Admin Panel"],
    });
    groups.push({
      groupName: "Preferences",
      tabs: configData.groups["Preferences"],
    });
  } else {
    Object.entries(configData.groups).forEach(([groupName, groupData]) => {
      if (groupName === "Admin Panel") return;
      if (groupName === "Your Obligations") {
        if (designation === "Representative") {
          groups.push({ groupName, tabs: groupData["Representative"] });
        } else if (designation === "Peace Officer") {
          groups.push({ groupName, tabs: groupData["Peace Officer"] });
        } else if (designation === "Procurement Officer") {
          groups.push({ groupName, tabs: groupData["Procurement Officer"] });
        } else if (designation === "Communication Officer") {
          groups.push({ groupName, tabs: groupData["Communication Officer"] });
        } else if (designation === "Auditor") {
          groups.push({ groupName, tabs: groupData["Auditor"] });
        } else if (designation === "Treasurer") {
          groups.push({ groupName, tabs: groupData["Treasurer"] });
        } else if (designation === "Secretary") {
          groups.push({ groupName, tabs: groupData["Secretary"] });
        } else if (designation === "Vice-President") {
          groups.push({ groupName, tabs: groupData["Vice-President"] });
        } else if (designation === "President") {
          groups.push({ groupName, tabs: groupData["President"] });
        } else {
          groups.push({ groupName, tabs: groupData["default"] });
        }
      } else {
        groups.push({ groupName, tabs: groupData });
      }
    });
  }

  return { topLevelTabs, groups };
};

export const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  // Initialize state with user data from sessionStorage
  const [userData, setUserData] = useState(() => {
    return JSON.parse(sessionStorage.getItem("user")) || {};
  });

  // Effect to update state when session storage changes
  useEffect(() => {
    const updateUserData = () => {
      const updatedUser = JSON.parse(sessionStorage.getItem("user"));
      if (updatedUser) {
        setUserData(updatedUser);
      }
    };

    window.addEventListener("userUpdated", updateUserData);

    return () => {
      window.removeEventListener("userUpdated", updateUserData);
    };
  }, []);

  const config = getSidebarConfig(userData.designation || "Member");

  return (
    <nav
      className={`fixed top-0 left-0 h-screen ${
        isCollapsed ? "w-18 px-2" : "w-76 px-3.5"
      } py-7 bg-[#ffffffe6] backdrop-opacity-10 backdrop-blur-md overflow-x-hidden transition-width duration-300 overflow-y-hidden hover:overflow-y-auto scrollbar-thin font-[inter] not-italic`}
      style={{
        scrollbarGutter: "stable", // Prevent layout shift when the scrollbar appears
      }}
    >
      {/* Profile Section */}
      <div className="flex flex-col items-center">
        <div
          className="flex items-center space-y-2 cursor-pointer relative"
          onClick={() => setIsCollapsed(!isCollapsed)} // Toggle collapse state
        >
          <Logo
            size="44"
            className={`transition-all ${isCollapsed ? "mr-0" : "mr-59"}`}
          />
          <span
            className={`absolute left-14 w-60 text-[29px] font-bold font-[archivo] 
              transition-all duration-300 transform ${
                isCollapsed ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
          >
            COMSOC OFTS
          </span>
        </div>

        <div className="flex items-center space-x-2 mt-5">
          <ProfilePic profilePic={userData.profile_pic} />
          {!isCollapsed && (
            <div className="transition-opacity duration-300 flex flex-col pl-2 w-40">
              <p className="transition-opacity duration-300 text-sm font-bold">
                {userData.full_name}
              </p>
              <p className="transition-opacity duration-300 text-xs">
                {userData.designation}
              </p>
            </div>
          )}
          {!isCollapsed && (
            <NavLink
              to="/editprofile"
              className={({ isActive }) =>
                `flex justify-items-center w-16 px-3 py-2 rounded-xl text-base text-center transition hover:-translate-y-0.5 bg-[#ffc34c] text-white font-bold ${
                  isActive ? "hover:bg-[#d9ab4e]" : "hover:bg-[#d9ab4e]"
                }`
              }
            >
              Edit
            </NavLink>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mt-5">
        <ul className="space-y-0.5">
          {config.topLevelTabs.map((tab) => (
            <li key={tab.path}>
              <NavLink
                to={tab.path}
                className={({ isActive }) =>
                  `flex place-items-center px-3 py-2 rounded-lg text-base transition hover:-translate-y-0.5 ${
                    isCollapsed ? "justify-center" : ""
                  } ${
                    isActive
                      ? "bg-[#ffc34c] text-white font-bold hover:bg-[#d9ab4e] -translate-y-0.5 hover:translate-y-0.5"
                      : "hover:bg-[#9494945d]"
                  }`
                }
              >
                <img src={tab.icon} alt={tab.label} className="w-6 h-6 block" />
                {!isCollapsed && (
                  <span className="transition-opacity duration-300 ml-3">
                    {tab.label}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {config.groups.map((group) => (
          <div key={group.groupName} className="mt-5">
            {!isCollapsed && (
              <h3 className="px-3 py-1 text-xs font-semibold text-gray-700 uppercase">
                {group.groupName}
              </h3>
            )}
            <ul>
              {group.tabs.map((tab) => (
                <li key={tab.path}>
                  <NavLink
                    to={tab.path}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 rounded-lg text-base transition hover:-translate-y-0.5 ${
                        isActive
                          ? "bg-[#ffc34c] text-white font-bold hover:bg-[#d9ab4e] -translate-y-0.5 hover:translate-y-0.5"
                          : "hover:bg-[#9494945d]"
                      }`
                    }
                  >
                    <img src={tab.icon} alt={tab.label} className="w-6 h-6" />
                    {!isCollapsed && (
                      <span className="transition-opacity duration-300 ml-3">
                        {tab.label}
                      </span>
                    )}
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
  isCollapsed: PropTypes.bool.isRequired,
  setIsCollapsed: PropTypes.func.isRequired,
};

export default Sidebar;
