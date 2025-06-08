import TitleCard from "../../components/Cards/TitleCard";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "../../lib/ui/button";
import { showNotification } from "../common/headerSlice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

function Leads({ onDelete }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLoadingAdmin, setisLoadingAdmin] = useState(false);
  const dispatch = useDispatch();
  const [getAdminListResponsObj, setGetAdminListResponsObj] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Form State
  const [createAdmin, setCreateAdmin] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "admin",
    birthday_date: "",
    national_id: "",
    phone_number: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCreateAdmin((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddAdmin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/create-admin",
        createAdmin
      );
      console.log("Response:", response.data);

      if (response.data.success) {
        dispatch(
          showNotification({ message: "Admin added successfully!", status: 1 })
        );
        setGetAdminListResponsObj([
          ...getAdminListResponsObj,
          response.data.admin,
        ]);
        onClose(); // Close modal
      } else {
        dispatch(
          showNotification({
            message: response.data.errors || "Failed to add admin",
            status: 0,
          })
        );
      }
    } catch (error) {
      dispatch(
        showNotification({
          message: error.response?.data?.errors || "Error adding admin",
          status: 0,
        })
      );
    }
  };

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        console.log("Fetching admins...");
        const response = await axios.get(
          "http://localhost:5000/api/admin/adminList"
        );
        console.log("API Response:", response);

        if (!response.data || !response.data.admins) {
          console.error("Unexpected API response format:", response.admins);
          return;
        }

        setGetAdminListResponsObj(response.data.admins);
      } catch (error) {
        console.error(
          "Error fetching admins:",
          error.response ? error.response.errors : error.errors
        );
      }
    };

    fetchAdmins();
  }, []);
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/delete-admin/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setGetAdminListResponsObj(
        getAdminListResponsObj.filter((admin) => admin._id !== id)
      ); // Remove from UI
    } catch (error) {
      console.error(
        "Error deleting admin:",
        error.response?.data?.errors || error.errors
      );
    }
  };
  const [editAdmin, setEditAdmin] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "admin",
    phone_number: "",
  });
  const handleEditClick = (admin) => {
    setSelectedAdmin(admin);
    setEditAdmin({ ...admin });
    setIsEditOpen(true);
  };

  const handleUpdateAdmin = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/update-admin/${selectedAdmin._id}`,
        editAdmin,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        dispatch(
          showNotification({
            message: "Admin updated successfully!",
            status: 1,
          })
        );

        // Ensure immediate UI update by updating state correctly
        setGetAdminListResponsObj((prev) =>
          prev.map((admin) =>
            admin._id === selectedAdmin._id
              ? { ...admin, ...response.data.updatedAdmin } // Use response data if available
              : admin
          )
        );

        onClose(); // Close the modal or form
      } else {
        dispatch(
          showNotification({ message: "Admin updated successfully", status: 1 })
        );
      }
    } catch (error) {
      console.error("Error updating admin:", error.response?.data);
      dispatch(
        showNotification({ message: "Error updating admin", status: 0 })
      );
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditAdmin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <>
      <TitleCard title="Admins" topMargin="mt-2">
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
                <th>Email</th>
                <th>Created At</th>
                <th>Role</th>
                <th>Phone number</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {getAdminListResponsObj.map((admin, index) => (
                <tr key={index}>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-bold">{admin.first_name}</div>
                        <div className="text-sm opacity-50">
                          {admin.last_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{admin.national_id}</td>
                  <td>{admin.email}</td>
                  <td>
                    {new Date(admin.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td>{admin.role}</td>
                  <td>{admin.phone_number}</td>
                  <td>
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => handleEditClick(admin)}
                    >
                      <PencilIcon className="w-5" />
                    </button>
                  </td>
                  <td>
                    {" "}
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => handleDelete(admin._id)}
                    >
                      <TrashIcon className="w-5 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TitleCard>

      {/* Add Admin Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        backdrop="opaque"
        className="w-[90%] max-w-[600px] m-auto z-[1000]"
      >
        <ModalContent className="bg-white rounded-lg shadow-2xl">
          <ModalHeader className="text-lg font-semibold mt-4">
            Add New Admin
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <label htmlFor="first_name" className="text-sm font-medium">
                  First Name
                </label>
                <input
                  name="first_name"
                  type="text"
                  value={createAdmin.first_name}
                  onChange={handleInputChange}
                  className="w-full p-2 mt-1 border rounded-md"
                />
              </div>

              <div>
                <label htmlFor="last_name" className="text-sm font-medium">
                  Last Name
                </label>
                <input
                  name="last_name"
                  type="text"
                  value={createAdmin.last_name}
                  onChange={handleInputChange}
                  className="w-full p-2 mt-1 border rounded-md"
                />
              </div>

              <div>
                <label htmlFor="national_id" className="text-sm font-medium">
                  National ID
                </label>
                <input
                  name="national_id"
                  type="text"
                  value={createAdmin.national_id}
                  onChange={handleInputChange}
                  className="w-full p-2 mt-1 border rounded-md"
                />
              </div>

              <div>
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={createAdmin.email}
                  onChange={handleInputChange}
                  className="w-full p-2 mt-1 border rounded-md"
                />
              </div>

              <div>
                <label htmlFor="birthday_date" className="text-sm font-medium">
                  Birthday Date
                </label>
                <input
                  name="birthday_date"
                  type="date"
                  value={createAdmin.birthday_date}
                  onChange={handleInputChange}
                  className="w-full p-2 mt-1 border rounded-md"
                />
              </div>

              <div>
                <label htmlFor="role" className="text-sm font-medium">
                  Role
                </label>
                <select
                  name="role"
                  value={createAdmin.role}
                  onChange={handleInputChange}
                  className="w-full p-2 mt-1 border rounded-md"
                >
                  <option value="super admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="officer">Officer</option>
                </select>
              </div>

              <div>
                <label htmlFor="phone_number" className="text-sm font-medium">
                  Phone Number
                </label>
                <input
                  name="phone_number"
                  type="tel"
                  value={createAdmin.phone_number}
                  onChange={handleInputChange}
                  className="w-full p-2 mt-1 border rounded-md"
                />
              </div>

              <div>
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={createAdmin.password}
                  onChange={handleInputChange}
                  className="w-full p-2 mt-1 border rounded-md"
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={onClose}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleAddAdmin}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <ModalContent className="bg-white rounded-lg shadow-2xl">
          <ModalHeader>Edit Admin</ModalHeader>
          <ModalBody>
            <input
              type="text"
              name="first_name"
              value={editAdmin.first_name}
              onChange={handleEditInputChange}
              placeholder="First Name"
              className="input input-bordered w-full mb-2"
            />
            <input
              type="text"
              name="last_name"
              value={editAdmin.last_name}
              onChange={handleEditInputChange}
              placeholder="Last Name"
              className="input input-bordered w-full mb-2"
            />
            <input
              type="email"
              name="email"
              value={editAdmin.email}
              onChange={handleEditInputChange}
              placeholder="Email"
              className="input input-bordered w-full mb-2"
            />
            <input
              type="text"
              name="phone_number"
              value={editAdmin.phone_number}
              onChange={handleEditInputChange}
              placeholder="Phone Number"
              className="input input-bordered w-full mb-2"
            />
            <select
              name="role"
              value={editAdmin.role}
              onChange={handleEditInputChange}
              className="input input-bordered w-full mb-2"
            >
              <option value="admin">Admin</option>
              <option value="super admin">Super Admin</option>
              <option value="officer">Officer</option>
            </select>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button onClick={handleUpdateAdmin} variant="solid" color="primary">
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Leads;
