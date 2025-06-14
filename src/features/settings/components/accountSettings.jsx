import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { showNotification } from "../../common/headerSlice";
import InputText from "../../../components/Input/InputText";
import TextAreaInput from "../../../components/Input/TextAreaInput";
import ToogleInput from "../../../components/Input/ToogleInput";
import axios from "axios";
import { useTranslation } from "react-i18next";

import i18n from "i18next"; // Import i18next

function ProfileSettings() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("profile");
  const { isOpen, header } = useSelector((state) => state.rightDrawer);
  const authState = useSelector((state) => state.auth);
  const ADMIN_ID = authState?.adminId || localStorage.getItem("adminId");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    national_id: "",
    phone_number: "",
    birthday_date: "",
    current_password: "",
    new_password: "",
    languagePreference: "en",
  });
  const { t } = useTranslation();

  // Fetch admin data on component mount
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(`/api/admin/profile/${ADMIN_ID}`);
        const adminData = response.data.data;

        setFormData({
          first_name: adminData.first_name,
          last_name: adminData.last_name,
          email: adminData.email,
          national_id: adminData.national_id,
          phone_number: adminData.phone_number,
          birthday_date: adminData.birthday_date?.split("T")[0] || "", // Format date
          current_password: "",
          new_password: "",
          languagePreference: adminData.languagePreference || "en",
        });

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
        dispatch(
          showNotification({ message: "Failed to load profile", status: 0 })
        );
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [dispatch]);

  const updateProfile = async () => {
    try {
      // Prepare the data to send
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        birthday_date: formData.birthday_date,
        languagePreference: formData.languagePreference,
      };

      // Only include password fields if they're not empty
      if (formData.new_password) {
        updateData.password = formData.new_password;
        updateData.current_password = formData.current_password;
      }

      const response = await axios.put(
        `/api/admin/profile/${ADMIN_ID}`,
        updateData
      );

      dispatch(
        showNotification({ message: "Profile Updated Successfully", status: 1 })
      );
    } catch (error) {
      console.error("Update failed:", error);
      dispatch(
        showNotification({
          message: error.response?.data?.message || "Update failed",
          status: 0,
        })
      );
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setFormData({
      ...formData,
      [updateType]: value,
    });
  };

  // Change language in UI immediately when toggle is clicked
  const handleLanguageChange = (value) => {
    const newLanguage = value ? "en" : "ar";
    i18n.changeLanguage(newLanguage); // Change the language in i18next
    setFormData({
      ...formData,
      languagePreference: newLanguage,
    });
  };

  if (loading) {
    return <div className="text-center py-10">Loading profile data...</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputText
          labelTitle="First Name"
          defaultValue={formData.first_name}
          updateType="first_name"
          updateFormValue={updateFormValue}
        />
        <InputText
          labelTitle="Last Name"
          defaultValue={formData.last_name}
          updateType="last_name"
          updateFormValue={updateFormValue}
        />
        <InputText
          labelTitle="Email Id"
          defaultValue={formData.email}
          updateType="email"
          updateFormValue={updateFormValue}
        />
        <InputText
          labelTitle="National Id"
          defaultValue={formData.national_id}
          updateType="national_id"
          updateFormValue={updateFormValue}
          disabled={true} // National ID typically shouldn't be editable
        />
        <InputText
          labelTitle="Phone Number"
          defaultValue={formData.phone_number}
          updateType="phone_number"
          updateFormValue={updateFormValue}
        />
        <InputText
          labelTitle="Birthday"
          type="date"
          defaultValue={formData.birthday_date}
          updateType="birthday_date"
          updateFormValue={updateFormValue}
        />
        <InputText
          labelTitle="Current Password"
          type="password"
          defaultValue={formData.current_password}
          updateType="current_password"
          updateFormValue={updateFormValue}
          placeholder="Enter current password to change"
        />
        <InputText
          labelTitle="New Password"
          type="password"
          defaultValue={formData.new_password}
          updateType="new_password"
          updateFormValue={updateFormValue}
          placeholder="Leave empty to keep current"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ToogleInput
          updateType="languagePreference"
          labelTitle="Language"
          defaultValue={formData.languagePreference === "en"}
          updateFormValue={({ updateType, value }) => {
            handleLanguageChange(value); // Call handle language change
          }}
          optionLabels={["Arabic", "English"]}
        />
      </div>

      <div className="mt-16">
        <button className="btn btn-primary float-right" onClick={updateProfile}>
          {t("Update")}
        </button>
      </div>
    </div>
  );
}

export default ProfileSettings;
