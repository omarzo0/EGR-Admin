import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BellIcon from "@heroicons/react/24/outline/BellIcon";
import Bars3Icon from "@heroicons/react/24/outline/Bars3Icon";
import ArrowLeftOnRectangleIcon from "@heroicons/react/24/outline/ArrowLeftOnRectangleIcon";
import { openRightDrawer } from "../features/common/rightDrawerSlice";
import { RIGHT_DRAWER_TYPES } from "../utils/globalConstantUtil";
import { clearAuthData } from "../features/common/authSlice";
import axios from "axios";

function Header() {
  const dispatch = useDispatch();
  const [notificationCount, setNotificationCount] = useState(0);
  const authState = useSelector((state) => state.auth);
  const adminId = authState?.adminId || localStorage.getItem("adminId");

  // Fetch unread notification count

  const handleNotificationClick = async () => {
    dispatch(
      openRightDrawer({
        header: "Notifications",
        bodyType: RIGHT_DRAWER_TYPES.NOTIFICATION,
      })
    );
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminId");
    dispatch(clearAuthData());
    window.location.href = "/login";
  };

  return (
    <div className="navbar sticky top-0 bg-base-100 z-10 shadow-md">
      <div className="flex-1">
        <label
          htmlFor="left-sidebar-drawer"
          className="btn btn-primary drawer-button lg:hidden"
        >
          <Bars3Icon className="h-5 inline-block w-5" />
        </label>
      </div>

      <div className="flex-none">
        <button
          className="btn btn-ghost ml-4 btn-circle relative"
          onClick={handleNotificationClick}
        >
          <BellIcon className="h-6 w-6" />
        </button>

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
  );
}

export default Header;
