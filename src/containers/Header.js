import { themeChange } from "theme-change";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BellIcon from "@heroicons/react/24/outline/BellIcon";
import Bars3Icon from "@heroicons/react/24/outline/Bars3Icon";
import MoonIcon from "@heroicons/react/24/outline/MoonIcon";
import SunIcon from "@heroicons/react/24/outline/SunIcon";
import ArrowLeftOnRectangleIcon from "@heroicons/react/24/outline/ArrowLeftOnRectangleIcon"; // Import logout icon
import { openRightDrawer } from "../features/common/rightDrawerSlice";
import { RIGHT_DRAWER_TYPES } from "../utils/globalConstantUtil";
import Cookies from "js-cookie";
import { NavLink, Routes, Link, useLocation } from "react-router-dom";
import { clearAuthData } from "../features/common/authSlice"; // Update path as needed
function Header() {
  const dispatch = useDispatch();
  const { noOfNotifications, pageTitle } = useSelector((state) => state.header);
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("theme")
  );

  useEffect(() => {
    themeChange(false);
    if (currentTheme === null) {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        setCurrentTheme("dark");
      } else {
        setCurrentTheme("light");
      }
    }
    // 👆 false parameter is required for react project
  }, []);

  // Opening right sidebar for notification
  const openNotification = () => {
    dispatch(
      openRightDrawer({
        header: "Notifications",
        bodyType: RIGHT_DRAWER_TYPES.NOTIFICATION,
      })
    );
  };

  function logoutUser() {
    // Clear all authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("adminId");
    Cookies.remove("token");

    // Clear Redux state if needed
    dispatch(clearAuthData());

    // Force full page reload to reset application state
    window.location.href = "/login";
    window.location.reload(true);
  }

  return (
    <>
      <div className="navbar sticky top-0 bg-base-100 z-10 shadow-md">
        {/* Menu toogle for mobile view or small screen */}
        <div className="flex-1">
          <label
            htmlFor="left-sidebar-drawer"
            className="btn btn-primary drawer-button lg:hidden"
          >
            <Bars3Icon className="h-5 inline-block w-5" />
          </label>
        </div>

        <div className="flex-none">
          {/* Notification icon */}
          <button
            className="btn btn-ghost ml-4 btn-circle"
            onClick={() => openNotification()}
          >
            <div className="indicator">
              <BellIcon className="h-6 w-6" />
              {noOfNotifications > 0 ? (
                <span className="indicator-item badge badge-secondary badge-sm">
                  {noOfNotifications}
                </span>
              ) : null}
            </div>
          </button>

          {/* Logout button */}
          <button
            className="btn btn-ghost ml-4"
            onClick={logoutUser}
            title="Logout"
          >
            <ArrowLeftOnRectangleIcon className="h-6 w-6" />
            <span className="hidden md:inline-block ml-2">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Header;
