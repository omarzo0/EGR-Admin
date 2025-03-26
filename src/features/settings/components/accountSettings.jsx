import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { showNotification } from "../../common/headerSlice";
import InputText from "../../../components/Input/InputText";
import TextAreaInput from "../../../components/Input/TextAreaInput";
import ToogleInput from "../../../components/Input/ToogleInput";
import axios from "axios";

function ProfileSettings() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("profile");
  const ADMIN_ID = "67dccaf0d8cabc4625ad8cd8"; // The admin ID you provided
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
    languagePreference: true, // true for English, false for Arabic
  });

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
          languagePreference: adminData.languagePreference === "en", // Convert to boolean
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
        languagePreference: formData.languagePreference ? "en" : "ar",
      };

      // Only include password fields if they're not empty
      if (formData.new_password) {
        updateData.password = formData.new_password;
        updateData.current_password = formData.current_password;
      }

      const response = await axios.put(
        `/api/admin/update-profile/${ADMIN_ID}`,
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
          defaultValue={formData.languagePreference}
          updateFormValue={updateFormValue}
          optionLabels={["Arabic", "English"]}
        />
      </div>

      <div className="mt-16">
        <button className="btn btn-primary float-right" onClick={updateProfile}>
          Update
        </button>
      </div>
    </div>
  );
}

export default ProfileSettings;
