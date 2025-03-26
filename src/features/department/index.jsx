import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "../../lib/ui/button";
import { Input } from "../../lib/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../lib/ui/card";
import { Badge } from "../../lib/ui/badge";

import { Textarea } from "../../lib/ui/textarea";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { Label } from "../../lib/ui/label";
import { showNotification } from "../common/headerSlice";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const {
    isOpen: isHideOpen,
    onOpen: onHideOpen,
    onClose: onHideClose,
  } = useDisclosure();
  const {
    isOpen: isHideEdit,
    onOpen: onHideEdit,
    onClose: onHideEditClose,
  } = useDisclosure();
  useEffect(() => {
    fetch("http://localhost:5000/api/admin/department-list")
      .then((response) => response.json())
      .then((data) => {
        setDepartments(data); // Directly set the array of departments
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
        setLoading(false);
      });
  }, []);
  const handleCreateDepartment = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/create-department",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: name, description }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create department");
      }

      // Update the local state with the new department
      setDepartments((prevDepartments) => [
        ...prevDepartments,
        data.department,
      ]);

      // Success handling
      dispatch(
        showNotification({
          message: "Department created successfully!",
          status: 1, // Assuming 1 represents success
        })
      );

      onHideClose(); // Close the modal
    } catch (error) {
      // Error handling
      dispatch(
        showNotification({
          message: error.message || "Error creating department",
          status: 0, // Assuming 0 represents error
        })
      );
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteDepartment = async (departmentId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/delete-department/${departmentId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete department");
      }

      // Update the local state to remove the deleted department
      setDepartments((prevDepartments) =>
        prevDepartments.filter((department) => department._id !== departmentId)
      );

      // Show success notification
      dispatch(
        showNotification({
          message: "Department deleted successfully!",
          status: 1, // Assuming 1 represents success
        })
      );
    } catch (error) {
      // Show error notification
      dispatch(
        showNotification({
          message: error.message || "Error deleting department",
          status: 0, // Assuming 0 represents error
        })
      );
    }
  };
  const handleUpdateDepartment = async (departmentId, updatedData) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/update-department/${departmentId}`,
        {
          method: "PUT", // or "PATCH"
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update department");
      }

      // Update the local state with the updated department
      setDepartments((prevDepartments) =>
        prevDepartments.map((department) =>
          department._id === departmentId
            ? { ...department, ...updatedData }
            : department
        )
      );

      // Show success notification
      dispatch(
        showNotification({
          message: "Department updated successfully!",
          status: 1, // Assuming 1 represents success
        })
      );

      onHideEditClose(); // Close the modal
    } catch (error) {
      // Show error notification
      dispatch(
        showNotification({
          message: error.message || "Error updating department",
          status: 0, // Assuming 0 represents error
        })
      );
    }
  };
  const handleEditClick = (department) => {
    setEditDepartmentId(department._id);
    setEditName(department.name);
    setEditDescription(department.description);
    onHideEdit(); // Open the modal
  };
  const [editDepartmentId, setEditDepartmentId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const handleUpdateSubmit = () => {
    const updatedData = {
      name: editName,
      description: editDescription,
    };
    handleUpdateDepartment(editDepartmentId, updatedData);
  };
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Departments</h1>

        <Link to="/app/services">
          <Button>
            <h1 className="text-2xl font-bold">Services</h1>
          </Button>
        </Link>
        <Link href="">
          <Button
            onClick={() => {
              onHideOpen();
            }}
          >
            {" "}
            <Plus className="mr-2 h-4 w-4" />
            Add Department
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input placeholder="Search departments..." className="pl-10" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {departments?.map((department) => (
          <Card key={department.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle>{department.name}</CardTitle>
              <CardDescription className="text-gray-700">
                {department.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <Badge variant="outline">
                  {department.serviceCount} Services
                </Badge>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => handleEditClick(department)} // Open the edit modal
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleDeleteDepartment(department._id)} // Pass the department ID
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Modal
        isOpen={isHideOpen}
        onClose={onHideClose}
        backdrop="blur"
        className="w-[90%] max-w-[600px] m-auto"
      >
        <ModalContent>
          <ModalHeader className="text-lg font-semibold">
            Add New Department
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div>
                <label htmlFor="title" className="text-sm font-medium">
                  Department Name
                </label>
                <Input
                  id="title"
                  placeholder="Enter department name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="Enter department description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={onHideClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleCreateDepartment}
              isLoading={loading}
            >
              Create Department
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isHideEdit}
        onClose={onHideEditClose}
        backdrop="blur"
        aria-labelledby="modal-title"
        className="w-[90%] max-w-[600px] m-auto"
      >
        <ModalContent>
          <ModalHeader className="text-lg font-semibold" id="modal-title">
            Edit Department
          </ModalHeader>
          <ModalBody>
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold">Edit Department</h1>
              </div>

              <Card className="mx-auto max-w-2xl">
                <CardHeader>
                  <CardTitle>Department Information</CardTitle>
                  <CardDescription>
                    Update the details for this department
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Department Name</Label>
                    <Input
                      id="title"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={onHideEditClose}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSubmit}>Update Department</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
