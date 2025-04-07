import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import axios from "axios";
import moment from "moment";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { showNotification } from "../common/headerSlice";
import { Button } from "../../lib/ui/button";

function Leads() {
  const dispatch = useDispatch();
  const [citizens, setCitizens] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCitizen, setSelectedCitizen] = useState(null);

  useEffect(() => {
    const fetchCitizens = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/citizen-list"
        );
        setCitizens(response.data);
      } catch (error) {
        console.error("Error fetching citizens:", error);
      }
    };

    fetchCitizens();
  }, []);
  const [citizenData, setCitizenData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    national_id: "",
    email: "",
    date_of_birth: "",
    phone_number: "",
    address: "",
    gender: "Male",
    government: "",
    marital_status: "Single",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCitizenData({ ...citizenData, [name]: value });
  };
  const handleAddCitizen = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/create-citizen",
        citizenData
      );

      // Reset form data
      setCitizenData({
        first_name: "",
        middle_name: "",
        last_name: "",
        national_id: "",
        email: "",
        date_of_birth: "",
        phone_number: "",
        address: "",
        gender: "Male",
        Government: "",
        marital_status: "Single",
        password: "",
      });

      // Update state by fetching fresh data from server
      const updatedResponse = await axios.get(
        "http://localhost:5000/api/admin/citizen-list"
      );
      setCitizens(updatedResponse.data);

      dispatch(
        showNotification({
          message: "Citizen added successfully!",
          status: 1,
        })
      );

      onClose();
    } catch (error) {
      dispatch(
        showNotification({
          message: error.response?.data?.message || "Error adding Citizen",
          status: 0,
        })
      );
    }
  };
  const handleDeleteCitizen = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/admin/delete-citizen/${id}`
      );

      setCitizens(citizens.filter((citizen) => citizen._id !== id));

      dispatch(
        showNotification({
          message: "Citizen deleted successfully!",
          status: 1,
        })
      );
    } catch (error) {
      dispatch(
        showNotification({
          message: error.response?.data?.message || "Failed to delete citizen.",
          status: 0,
        })
      );
    }
  };
  const handleEditCitizen = (citizen) => {
    setSelectedCitizen(citizen);
    setIsEditOpen(true);
  };
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedCitizen({ ...selectedCitizen, [name]: value });
  };
  const handleUpdateCitizen = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/update-citizen/${selectedCitizen._id}`,
        selectedCitizen
      );

      setCitizens((prev) =>
        prev.map((citizen) =>
          citizen._id === selectedCitizen._id ? selectedCitizen : citizen
        )
      );

      dispatch(
        showNotification({
          message: "Citizen updated successfully!",
          status: 1,
        })
      );

      setIsEditOpen(false);
    } catch (error) {
      dispatch(
        showNotification({
          message: error.response?.data?.message || "Error updating Citizen",
          status: 0,
        })
      );
    }
  };

  return (
    <>
      <TitleCard title="Citizens" topMargin="mt-2">
        <div className="inline-block float-right">
          <button
            onClick={onOpen}
            className="btn px-6 btn-sm normal-case btn-primary"
          >
            Add New
          </button>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>National Id</th>
                <th>Phone number</th>
                <th>Address</th>
                <th>Gender</th>
                <th>Government</th>
                <th>Birthday</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {citizens.map((citizen) => (
                <tr key={citizen._id}>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-bold">
                          {citizen.first_name} {citizen.middle_name}
                        </div>
                        <div className="text-sm opacity-50">
                          {citizen.last_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{citizen.national_id}</td>
                  <td>{citizen.phone_number}</td>
                  <td>{citizen.address}</td>
                  <td>{citizen.gender}</td>
                  <td>{citizen.Government}</td>
                  <td>{moment(citizen.date_of_birth).format("YYYY-MM-DD")}</td>
                  <td>
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => handleEditCitizen(citizen)}
                    >
                      <PencilIcon className="w-5" />
                    </button>

                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => handleDeleteCitizen(citizen._id)}
                    >
                      <TrashIcon className="w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TitleCard>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        backdrop="opaque"
        className="w-[90%] max-w-[600px] m-auto z-[1000]"
      >
        <ModalContent>
          <ModalHeader className="text-lg font-semibold">
            Add New Citizen
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <input
                name="first_name"
                type="text"
                value={citizenData.first_name}
                onChange={handleInputChange}
                placeholder="First Name"
                className="w-full p-2 border rounded-md"
              />
              <input
                name="middle_name"
                type="text"
                value={citizenData.middle_name}
                onChange={handleInputChange}
                placeholder="Middle Name"
                className="w-full p-2 border rounded-md"
              />
              <input
                name="last_name"
                type="text"
                value={citizenData.last_name}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="w-full p-2 border rounded-md"
              />
              <input
                name="national_id"
                type="text"
                value={citizenData.national_id}
                onChange={handleInputChange}
                placeholder="National ID"
                className="w-full p-2 border rounded-md"
              />
              <input
                name="email"
                type="email"
                value={citizenData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full p-2 border rounded-md"
              />
              <input
                name="date_of_birth"
                type="date"
                value={citizenData.date_of_birth}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
              <input
                name="phone_number"
                type="tel"
                value={citizenData.phone_number}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="w-full p-2 border rounded-md"
              />
              <input
                name="address"
                type="text"
                value={citizenData.address}
                onChange={handleInputChange}
                placeholder="Address"
                className="w-full p-2 border rounded-md"
              />
              <input
                name="Government"
                type="text"
                value={citizenData.Government}
                onChange={handleInputChange}
                placeholder="Government"
                className="w-full p-2 border rounded-md"
              />
              <div>
                <label htmlFor="marital_status" className="text-sm font-medium">
                  Marital Status
                </label>
                <select
                  name="marital_status"
                  value={citizenData.marital_status}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="" disabled>
                    Select Marital Status
                  </option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>

              <select
                name="gender"
                value={citizenData.gender}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                name="password"
                type="tel"
                value={citizenData.password}
                onChange={handleInputChange}
                placeholder="password"
                className="w-full p-2 border rounded-md"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={onClose}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleAddCitizen}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        backdrop="opaque"
        className="w-[90%] max-w-[600px] m-auto z-[1000]"
      >
        <ModalContent>
          <ModalHeader className="text-lg font-semibold">
            Edit Citizen
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <input
                name="first_name"
                type="text"
                value={selectedCitizen?.first_name || ""}
                onChange={handleEditInputChange}
                placeholder="First Name"
                className="w-full p-2 border rounded-md"
              />
              <input
                name="middle_name"
                type="text"
                value={selectedCitizen?.middle_name || ""}
                onChange={handleEditInputChange}
                placeholder="Middle Name"
                className="w-full p-2 border rounded-md"
              />
              <input
                name="last_name"
                type="text"
                value={selectedCitizen?.last_name || ""}
                onChange={handleEditInputChange}
                placeholder="Last Name"
                className="w-full p-2 border rounded-md"
              />
              <input
                name="phone_number"
                type="tel"
                value={selectedCitizen?.phone_number || ""}
                onChange={handleEditInputChange}
                placeholder="Phone Number"
                className="w-full p-2 border rounded-md"
              />
              <input
                name="address"
                type="text"
                value={selectedCitizen?.address || ""}
                onChange={handleEditInputChange}
                placeholder="Address"
                className="w-full p-2 border rounded-md"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleUpdateCitizen}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Leads;
