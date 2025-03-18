import { useState } from "react";
import TitleCard from "../../../components/Cards/TitleCard";
import { showNotification } from "../../common/headerSlice";
import TextAreaInput from "../../../components/Input/TextAreaInput";
import AccountSettings from "../components/accountSettings";
import Notification from "../components/notification";
import Points from "../components/points";
import Feedback from "../components/feedback";

function ProfileSettings() {
  const [activeTab, setActiveTab] = useState("profile");

  const updateFormValue = ({ updateType, value }) => {
    console.log(updateType);
  };

  return (
    <>
      {/* Tabs */}
      <div className="flex border-b mb-4">
        {["profile", "notifications", "points", "feedback"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "profile" && "Profile Settings"}
            {tab === "notifications" && "Notifications"}
            {tab === "points" && "Points"}
            {tab === "feedback" && "Feedback"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "profile" && <AccountSettings />}

      {activeTab === "notifications" && <Notification />}

      {activeTab === "points" && <Points />}

      {activeTab === "feedback" && <Feedback />}
    </>
  );
}

export default ProfileSettings;
