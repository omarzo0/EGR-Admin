import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Search, Filter } from "lucide-react";
import { Button } from "../../lib/ui/button";
import { Input } from "../../lib/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../../lib/ui/card";
import { Badge } from "../../lib/ui/badge";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../lib/ui/select";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { Textarea } from "../../lib/ui/textarea";
import { Label } from "../../lib/ui/label";
import { showNotification } from "../common/headerSlice";
import { useDispatch } from "react-redux";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const dispatch = useDispatch();

  const [newService, setNewService] = useState({
    name: "",
    Description: "",
    departmentName: "",
    fees: 0,
    processing_time: "",
    availableLocations: [{ name: "", address: "", operatingHours: "" }],
    serviceType: "",
  });

  const [editingService, setEditingService] = useState(null);
  const [departments, setDepartments] = useState([]); // State for departments
  const [loading, setLoading] = useState(true); // Loading state
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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
  const fetchServices = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/services-list"
      );
      if (response.ok) {
        const data = await response.json();

        if (data.success && Array.isArray(data.services)) {
          setServices(data.services);
        } else {
          console.error(
            "API response does not contain a valid services array:",
            data
          );
          setServices([]);
        }
      } else {
        console.error("Failed to fetch services");
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/department-list")
      .then((response) => response.json())
      .then((data) => {
        setDepartments(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
        setLoading(false);
      });
  }, []);
  const handleCreateService = async () => {
    try {
      const selectedDepartment = departments.find(
        (dept) => dept.name === newService.departmentName
      );

      if (!selectedDepartment) {
        console.error("Selected department not found");
        return;
      }

      const payload = {
        name: newService.name,
        Description: newService.Description,
        departmentName: newService.departmentName,
        fees: Number(newService.fees),
        points: Number(newService.points),
        processing_time: newService.processing_time,
        availableLocations: newService.availableLocations,
        serviceType: newService.serviceType,
      };

      const response = await fetch(
        "http://localhost:5000/api/admin/create-services",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        // Fetch the updated list of services
        fetchServices(); // Call the fetch function to refresh the list

        onHideClose(); // Close the modal

        setNewService({
          name: "",
          Description: "",
          departmentName: "",
          fees: 0,
          points: 0,
          processing_time: "",
          serviceType: "",
        });
      } else {
        console.error("Failed to create service");
      }
    } catch (error) {
      console.error("Error creating service:", error);
    }
  };

  const handleUpdateService = async () => {
    try {
      const payload = {
        name: editingService.name,
        Description: editingService.Description,
        departmentName: editingService.departmentName,
        fees: Number(editingService.fees),
        processing_time: editingService.processing_time,
        availableLocations: editingService.availableLocations,
        serviceType: editingService.serviceType,
      };

      const response = await fetch(
        `http://localhost:5000/api/admin/update-services/${editingService._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const updatedService = await response.json();

        setServices((prevServices) =>
          prevServices.map((service) =>
            service._id === updatedService._id ? updatedService : service
          )
        );

        dispatch(
          showNotification({
            message: "services updated successfully!",
            status: 1,
          })
        );

        onHideEditClose();
      } else {
        dispatch(
          showNotification({
            message: "Error updating services",
            status: 0,
          })
        );
      }
    } catch (error) {
      dispatch(
        showNotification({
          message: error.message || "Error updating services",
          status: 0,
        })
      );
    }
  };

  const handleEditClick = (service) => {
    setEditingService({
      _id: service._id,
      name: service.name,
      Description: service.Description,
      departmentName: service.department_id?.name,
      fees: service.fees,
      availableLocations: service.availableLocations,

      processing_time: service.processing_time,
      serviceType: service.serviceType,
    });
    onHideEdit();
  };
  const handleDeleteService = async (serviceId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/delete-services/${serviceId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Remove the deleted service from the state
        setServices((prevServices) =>
          prevServices.filter((service) => service._id !== serviceId)
        );

        // Show a success notification
        dispatch(
          showNotification({
            message: "Services deleted successfully",
            status: 1, // Assuming 0 represents error
          })
        );
      } else {
        // Show an error notification
        dispatch(
          showNotification({
            message: "failed to delete services ",
            status: 0,
          })
        );
      }
    } catch (error) {
      dispatch(
        showNotification({
          message: error.message || "Error deleting services",
          status: 0, // Assuming 0 represents error
        })
      );
    }
  };
  const filteredServices = services.filter((service) => {
    const matchesDepartment =
      selectedDepartment === "all" ||
      service.department_id?._id === selectedDepartment;

    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.Description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDepartment && matchesSearch;
  });
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Services</h1>
        <Link to="/app/department">
          <Button>
            <h1 className="text-2xl font-bold">Departments</h1>
          </Button>
        </Link>
        <Link href="/admin/services/new">
          <Button onClick={onHideOpen}>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search services..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-4">
          <Select
            value={selectedDepartment}
            onChange={(value) => {
              setSelectedDepartment(value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectItem value="all">All Departments</SelectItem>
            {departments?.map((department) => (
              <SelectItem key={department._id} value={department._id}>
                {department?.name}
              </SelectItem>
            ))}
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredServices?.map((service) => (
          <Card key={service._id}>
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"></div>
                  <div>
                    <CardTitle className="text-lg">{service?.name}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {service.Description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleEditClick(service)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleDeleteService(service._id)} // Add this line
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="border-t px-4 py-3 sm:px-6">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <Badge variant="outline">{service?.department_id?.name}</Badge>

                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium">Fee:</span>
                  <span className="ml-1">${service.fees}</span>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium">Processing Time:</span>
                  <span className="ml-1">{service.processing_time}</span>

                  <Badge variant="outline">{service?.points}</Badge>
                </div>
              </div>

              {service?.availableLocations?.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Available Locations:
                  </p>
                  {service?.availableLocations?.map((location, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-600 pl-2 border-l border-gray-300"
                    >
                      <p>
                        <span className="font-semibold">Name:</span>{" "}
                        {location.name}
                      </p>
                      <p>
                        <span className="font-semibold">Address:</span>{" "}
                        {location.address}
                      </p>
                      <p>
                        <span className="font-semibold">Hours:</span>{" "}
                        {location.operatingHours}
                      </p>
                    </div>
                  ))}
                  <span className="ml-1">{service.serviceType}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isHideOpen}
        onClose={onHideClose}
        backdrop="blur"
        aria-labelledby="modal-title"
        className="w-[90%] max-w-[600px] m-auto"
      >
        <ModalContent>
          <ModalBody>
            <div>
              <Card className="mx-auto max-w-2xl bg-white">
                <CardHeader>
                  <CardTitle>Service Information</CardTitle>
                  <CardDescription>
                    Enter the details for the new service
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Service Name</Label>
                    <Input
                      id="title"
                      placeholder="Enter service name"
                      value={newService.name}
                      onChange={(e) =>
                        setNewService({ ...newService, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter service description"
                      rows={3}
                      value={newService.Description}
                      onChange={(e) =>
                        setNewService({
                          ...newService,
                          Description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={newService.departmentName}
                      onChange={(event) => {
                        const value = event.target.value;
                        console.log("Selected department:", value);
                        setNewService((prev) => ({
                          ...prev,
                          departmentName: value,
                        }));
                      }}
                    >
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select department">
                          {newService.departmentName || "Select department"}
                        </SelectValue>
                      </SelectTrigger>

                      {departments?.map((department) => (
                        <SelectItem
                          key={department._id}
                          value={department?.name}
                        >
                          {department?.name}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fee">Fee</Label>
                      <Input
                        id="fee"
                        placeholder="$0.00"
                        type="number"
                        value={newService.fees}
                        onChange={(e) =>
                          setNewService({ ...newService, fees: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-4">
                      <Label>Available Locations</Label>
                      {newService?.availableLocations?.map(
                        (location, index) => (
                          <div
                            key={index}
                            className="grid gap-3 sm:grid-cols-3"
                          >
                            <Input
                              placeholder="Name"
                              value={location.name}
                              onChange={(e) => {
                                const updated = [
                                  ...newService.availableLocations,
                                ];
                                updated[index].name = e.target.value;
                                setNewService({
                                  ...newService,
                                  availableLocations: updated,
                                });
                              }}
                            />
                            <Input
                              placeholder="Address"
                              value={location.address}
                              onChange={(e) => {
                                const updated = [
                                  ...newService.availableLocations,
                                ];
                                updated[index].address = e.target.value;
                                setNewService({
                                  ...newService,
                                  availableLocations: updated,
                                });
                              }}
                            />
                            <Input
                              placeholder="Operating Hours"
                              value={location.operatingHours}
                              onChange={(e) => {
                                const updated = [
                                  ...newService.availableLocations,
                                ];
                                updated[index].operatingHours = e.target.value;
                                setNewService({
                                  ...newService,
                                  availableLocations: updated,
                                });
                              }}
                            />
                          </div>
                        )
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setNewService({
                            ...newService,
                            availableLocations: [
                              ...newService.availableLocations,
                              { name: "", address: "", operatingHours: "" },
                            ],
                          })
                        }
                      >
                        + Add Another Location
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="processingTime">Processing Time</Label>
                      <Input
                        id="processingTime"
                        placeholder="e.g., 3-5 business days"
                        value={newService.processing_time}
                        onChange={(e) =>
                          setNewService({
                            ...newService,
                            processing_time: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serviceType">Service Type</Label>
                      <Select
                        id="serviceType"
                        value={newService.serviceType}
                        onChange={(e) =>
                          setNewService({
                            ...newService,
                            serviceType: e.target.value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                        <SelectItem value="esignature">eSignature</SelectItem>
                        <SelectItem value="application">application</SelectItem>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-4">
                  <Button variant="outline" onClick={onHideClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateService}>Create Service</Button>
                </CardFooter>
              </Card>
            </div>
          </ModalBody>
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
          <ModalBody>
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold">Edit Service</h1>
              </div>

              <Card className="mx-auto max-w-2xl bg-white">
                <CardHeader>
                  <CardTitle>Service Information</CardTitle>
                  <CardDescription>
                    Update the details for this service
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Service Name</Label>
                    <Input
                      id="title"
                      value={editingService?.name || ""}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editingService?.Description || ""}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          Description: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>

                    <Select
                      value={editingService?.departmentName}
                      onChange={(event) => {
                        const value = event.target.value;
                        setEditingService({
                          ...editingService,
                          departmentName: value,
                        });
                      }}
                    >
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select department">
                          {editingService?.departmentName ||
                            "Select department"}
                        </SelectValue>
                      </SelectTrigger>
                      {departments?.map((department) => (
                        <SelectItem
                          key={department._id}
                          value={department?.name}
                        >
                          {department?.name}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fee">Fee</Label>
                      <Input
                        id="fee"
                        value={editingService?.fees || ""}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            fees: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="processingTime">Processing Time</Label>
                      <Input
                        id="processingTime"
                        value={editingService?.processing_time || ""}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            processing_time: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-4">
                      <Label>Available Locations</Label>
                      {editingService?.availableLocations?.map(
                        (location, index) => (
                          <div
                            key={index}
                            className="grid gap-3 sm:grid-cols-3"
                          >
                            <Input
                              placeholder="Name"
                              value={location.name}
                              onChange={(e) => {
                                const updated = [
                                  ...editingService.availableLocations,
                                ];
                                updated[index].name = e.target.value;
                                setEditingService({
                                  ...editingService,
                                  availableLocations: updated,
                                });
                              }}
                            />
                            <Input
                              placeholder="Address"
                              value={location.address}
                              onChange={(e) => {
                                const updated = [
                                  ...editingService.availableLocations,
                                ];
                                updated[index].address = e.target.value;
                                setEditingService({
                                  ...editingService,
                                  availableLocations: updated,
                                });
                              }}
                            />
                            <Input
                              placeholder="Operating Hours"
                              value={location.operatingHours}
                              onChange={(e) => {
                                const updated = [
                                  ...editingService.availableLocations,
                                ];
                                updated[index].operatingHours = e.target.value;
                                setEditingService({
                                  ...editingService,
                                  availableLocations: updated,
                                });
                              }}
                            />
                          </div>
                        )
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setEditingService({
                            ...editingService,
                            availableLocations: [
                              ...editingService.availableLocations,
                              { name: "", address: "", operatingHours: "" },
                            ],
                          })
                        }
                      >
                        + Add Another Location
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serviceType">Service Type</Label>
                      <Select
                        id="serviceType"
                        value={editingService?.serviceType || ""}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            serviceType: e.target.value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                        <SelectItem value="esignature">eSignature</SelectItem>
                        <SelectItem value="application">application</SelectItem>
                        {/* Add more service types as needed */}
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-4">
                  <Button variant="outline" onClick={onHideEditClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateService}>Update Service</Button>
                </CardFooter>
              </Card>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
