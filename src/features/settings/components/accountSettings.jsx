import { useState } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { showNotification } from "../../common/headerSlice";
import InputText from "../../../components/Input/InputText";
import TextAreaInput from "../../../components/Input/TextAreaInput";
import ToogleInput from "../../../components/Input/ToogleInput";
import AccountSettings from "../components/accountSettings";
function ProfileSettings() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("profile");

  const updateProfile = () => {
    dispatch(showNotification({ message: "Profile Updated", status: 1 }));
  };

  const updateFormValue = ({ updateType, value }) => {
    console.log(updateType);
  };
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputText
          labelTitle="First Name"
          defaultValue="omar"
          updateFormValue={updateFormValue}
        />
        <InputText
          labelTitle="Last Name"
          defaultValue="omar"
          updateFormValue={updateFormValue}
        />
        <InputText
          labelTitle="Email Id"
          defaultValue="omarkhaled202080@gmail.com"
          updateFormValue={updateFormValue}
        />
        <InputText
          labelTitle="National Id"
          defaultValue="01002020455"
          updateFormValue={updateFormValue}
        />
        <InputText
          labelTitle="Phone Number"
          defaultValue="01002020455"
          updateFormValue={updateFormValue}
        />
        <InputText
          labelTitle="Birthday"
          type="date"
          defaultValue="1990-01-01"
          updateFormValue={updateFormValue}
        />
        <InputText
          labelTitle="Current Password"
          defaultValue="564712Omar@@"
          updateFormValue={updateFormValue}
        />
        <InputText
          labelTitle="New Password"
          defaultValue="564712Omar@@"
          updateFormValue={updateFormValue}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ToogleInput
          updateType="Language"
          labelTitle="Language"
          defaultValue={true}
          updateFormValue={updateFormValue}
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
