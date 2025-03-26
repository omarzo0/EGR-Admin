import { useEffect, useState } from "react";
import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon";
import { useDispatch, useSelector } from "react-redux";
import { closeRightDrawer } from "../features/common/rightDrawerSlice";
import { RIGHT_DRAWER_TYPES } from "../utils/globalConstantUtil";

function RightSidebar() {
  const { isOpen, header } = useSelector((state) => state.rightDrawer);
  const authState = useSelector((state) => state.auth);

  // Get adminId from Redux or fallback to localStorage
  const adminId = authState?.adminId || localStorage.getItem("adminId");

  if (!adminId) {
    console.error("Admin ID is missing!");
  }

  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (isOpen && adminId) {
        setLoading(true);
        try {
          console.log(`Fetching notifications for adminId: ${adminId}`);
          const response = await fetch(
            `http://localhost:5000/api/admin/notifications/admin/${adminId}`
          );

          if (!response.ok) throw new Error("Network response was not ok");

          const data = await response.json();
          console.log("Fetched Notifications:", data);

          if (data.success) {
            setNotifications(data.data);
          } else {
            throw new Error(data.message || "Failed to fetch notifications");
          }
        } catch (err) {
          setError(err.message);
          console.error("Fetch error:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchNotifications();
  }, [isOpen, adminId]);

  const close = (e) => {
    dispatch(closeRightDrawer(e));
  };

  return (
    <div
      className={
        "fixed overflow-hidden z-20 bg-gray-900 bg-opacity-25 inset-0 transform ease-in-out " +
        (isOpen
          ? " transition-opacity opacity-100 duration-500 translate-x-0 "
          : " transition-all delay-500 opacity-0 translate-x-full ")
      }
    >
      <section
        className={
          "w-80 md:w-96 right-0 absolute bg-white h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform " +
          (isOpen ? " translate-x-0 " : " translate-x-full ")
        }
      >
        <div className="relative pb-5 flex flex-col h-full">
          <div className="navbar flex pl-4 pr-4 shadow-md">
            <button
              className="float-left btn btn-circle btn-outline btn-sm"
              onClick={() => close()}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
            <span className="ml-2 font-bold text-xl">{header}</span>
          </div>

          <div className="overflow-y-scroll p-4">
            {loading ? (
              <p className="text-center text-gray-500 mt-4">Loading...</p>
            ) : error ? (
              <p className="text-center text-red-500 mt-4">{error}</p>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className="p-3 border-b border-gray-300"
                >
                  <h3 className="font-semibold">{notification.title}</h3>
                  <p className="text-gray-600">{notification.message}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 mt-4">No notifications</p>
            )}
          </div>
        </div>
      </section>

      <section
        className="w-screen h-full cursor-pointer"
        onClick={() => close()}
      ></section>
    </div>
  );
}

export default RightSidebar;
