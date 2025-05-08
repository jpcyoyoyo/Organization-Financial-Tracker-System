import {
  memo,
  useEffect,
  useLayoutEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import configData from "../../data/sidebarConfig.json";
import Logo from "../../components/ui/logo";
import ProfilePic from "../../components/ui/profilepic";
import { icons } from "../../assets/icons";

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
        const roleTabs = groupData[designation] || groupData["default"];
        groups.push({ groupName, tabs: roleTabs });
      } else {
        groups.push({ groupName, tabs: groupData });
      }
    });
  }

  return { topLevelTabs, groups };
};

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const [userData, setUserData] = useState(() => {
    return JSON.parse(sessionStorage.getItem("user")) || {};
  });

  useEffect(() => {
    const updateUserData = () => {
      const updatedUser = JSON.parse(sessionStorage.getItem("user"));
      if (updatedUser) {
        setUserData(updatedUser);
      }
    };

    window.addEventListener("userUpdated", updateUserData);
    return () => window.removeEventListener("userUpdated", updateUserData);
  }, []);

  useLayoutEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsCollapsed]);

  // Memoize sidebar config based on designation
  const config = useMemo(
    () => getSidebarConfig(userData.designation || "Member"),
    [userData.designation]
  );

  // Memoize nav click handler to avoid re-creation
  const handleNavClick = useCallback(() => {
    if (window.innerWidth < 768) {
      setIsCollapsed(true);
    }
  }, [setIsCollapsed]);

  return (
    <>
      {!isCollapsed && (
        <div
          className="md:hidden fixed top-0 left-0 w-full h-full bg-gray-600 opacity-50 z-10"
          onClick={() => setIsCollapsed(true)}
        />
      )}
      <nav
        className={`fixed top-0 left-0 h-screen z-20 ${
          {
            true: "w-19 md:w-14 pt-5 md:px-1.5 px-0 md:bg-[#ffffff7e] md:shadow-xl",
            false: "w-76 md:w-76 pt-5 px-3.5 bg-[#ffffff] shadow-xl",
          }[isCollapsed]
        } md:pt-7 transition-all backdrop-opacity-10 backdrop-blur-md font-[inter] not-italic`}
      >
        <div
          className={`flex flex-col ${
            isCollapsed ? "items-center" : "items-start"
          }`}
        >
          <div className="flex items-center space-y-2 relative">
            <Logo
              size="44"
              className={`transition-all cursor-pointer ${
                isCollapsed ? "mr-0" : "mr-59"
              }`}
              bg={`md:bg-transparent rounded-2xl ${
                isCollapsed
                  ? "bg-amber-50 md:p-0 p-1 md:shadow-none shadow-xl"
                  : "bg-transparent"
              }`}
              onClick={() => setIsCollapsed(!isCollapsed)}
            />
            <span
              className={`absolute left-14 w-60 text-[29px] font-bold font-[archivo] transition-all duration-300 transform ${
                isCollapsed
                  ? "hidden opacity-0 scale-95"
                  : "block opacity-100 scale-100"
              }`}
            >
              COMSOC OMS
            </span>
          </div>

          <div
            className={`mt-3 md:mt-5 transition-opacity duration-300 ${
              isCollapsed ? "hidden md:flex" : "flex"
            } items-center space-x-2`}
          >
            <ProfilePic
              profilePic={icons[userData.profile_pic] || userData.profile_pic}
            />
            {!isCollapsed && (
              <div className="pl-2 w-40">
                <p className="text-sm font-bold">{userData.full_name}</p>
                <p className="text-xs">{userData.designation}</p>
              </div>
            )}
            {!isCollapsed && (
              <NavLink
                to="/editprofile"
                className="flex justify-items-center w-16 px-3 py-2 rounded-xl text-base text-center transition hover:-translate-y-0.5 bg-[#ffc34c] text-white font-bold hover:bg-[#d9ab4e]"
              >
                Edit
              </NavLink>
            )}
          </div>
        </div>

        <div
          className={`${
            isCollapsed ? "hidden md:block" : "block"
          } relative h-full overflow-hidden`}
        >
          <div className="mt-5 overflow-y-auto max-h-[calc(100vh-136px)]">
            <ul className="space-y-0.5">
              {config.topLevelTabs.map((tab) => (
                <li key={tab.path}>
                  <NavLink
                    to={tab.path}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `relative z-10 flex place-items-center p-2 rounded-lg text-sm md:text-base transition hover:-translate-y-0.5 mt-0.5 ${
                        isCollapsed ? "justify-center" : ""
                      } ${
                        isActive
                          ? "bg-[#ffc34c] text-white font-bold hover:bg-[#d9ab4e] -translate-y-0.5 hover:translate-y-0.5"
                          : "hover:bg-[#9494945d]"
                      }`
                    }
                  >
                    <img
                      src={icons[tab.icon] || tab.icon}
                      alt={tab.label}
                      className="w-6 h-6"
                    />
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
                <h3
                  className={`px-3 py-1 text-xs font-semibold text-gray-700 uppercase ${
                    isCollapsed ? "hidden" : "block"
                  }`}
                >
                  {group.groupName}
                </h3>
                <ul>
                  {group.tabs.map((tab) => (
                    <li key={tab.path}>
                      <NavLink
                        to={tab.path}
                        onClick={handleNavClick}
                        className={({ isActive }) =>
                          `relative z-10 flex place-items-center p-2 rounded-lg text-sm md:text-base transition hover:-translate-y-0.5 mt-0.5 ${
                            isCollapsed ? "justify-center" : ""
                          } ${
                            isActive
                              ? "bg-[#ffc34c] text-white font-bold hover:bg-[#d9ab4e] -translate-y-0.5 hover:translate-y-0.5"
                              : "hover:bg-[#9494945d]"
                          }`
                        }
                      >
                        <img
                          src={icons[tab.icon] || tab.icon}
                          alt={tab.label}
                          className="w-6 h-6"
                        />
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
            <div className="h-40"></div>
          </div>
        </div>
      </nav>
    </>
  );
};

Sidebar.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  setIsCollapsed: PropTypes.func.isRequired,
};

export default memo(Sidebar);
