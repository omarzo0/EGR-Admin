import { useState } from "react";
import TitleCard from "../../../components/Cards/TitleCard";
import { showNotification } from "../../common/headerSlice";
import TextAreaInput from "../../../components/Input/TextAreaInput";
import AccountSettings from "../components/accountSettings";
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
        {["profile", "points", "feedback"].map((tab) => (
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
            {tab === "points" && "Points"}
            {tab === "feedback" && "Feedback"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "profile" && <AccountSettings />}

      {activeTab === "points" && <Points />}

      {activeTab === "feedback" && <Feedback />}
    </>
  );
}

export default ProfileSettings;
