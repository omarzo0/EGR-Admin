import { useState, useEffect } from "react";
import { Button } from "../../../lib/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../../lib/ui/card";
import { Input } from "../../../lib/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../lib/ui/table";
import { Plus, Edit, Save, X, Trash2 } from "lucide-react";
import { Slider } from "../../../lib/ui/slider";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showNotification } from "../../common/headerSlice";

const API_BASE_URL = "http://localhost:5000/api";

export default function PointsPage() {
  const dispatch = useDispatch();
  const [services, setServices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    points: 10,
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch services from API
  const fetchServices = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/admin/get-services`
      );
      setServices(response.data.data);
    } catch (error) {
      dispatch(
        showNotification({
          message: "Failed to load services",
          status: 0, // error status
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Update service points
  const updateServicePoints = async (id, points) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/update-point/${id}/points`,
        { points }
      );
      dispatch(
        showNotification({
          message: "Service points updated successfully",
          status: 1, // success status
        })
      );
      return true;
    } catch (error) {
      dispatch(
        showNotification({
          message: error.response?.data?.message || "Failed to update service",
          status: 0,
        })
      );
      return false;
    }
  };

  // Delete service
  const deleteService = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/delete-point/${id}`);
      dispatch(
        showNotification({
          message: "Service deleted successfully",
          status: 1,
        })
      );
      return true;
    } catch (error) {
      dispatch(
        showNotification({
          message: error.response?.data?.message || "Failed to delete service",
          status: 0,
        })
      );
      return false;
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const startEditing = (service) => {
    setEditingId(service._id);
    setNewService({
      name: service.name,
      description: service.description,
      points: service.points,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNewService({
      name: "",
      description: "",
      points: 10,
    });
  };

  const handleSaveService = async (id) => {
    const success = await updateServicePoints(id, newService.points);
    if (success) {
      setServices(
        services.map((service) =>
          service._id === id ? { ...service, ...newService } : service
        )
      );
      setEditingId(null);
    }
  };

  const handleDeleteService = async (id) => {
    const success = await deleteService(id);
    if (success) {
      setServices(services.filter((service) => service._id !== id));
    }
  };

  if (isLoading) {
    return <div className="container py-6">Loading services...</div>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1">
        <div className="container py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Service Points Configuration</h1>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Name</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Description
                    </TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.length > 0 ? (
                    services.map((service) => (
                      <TableRow key={service._id}>
                        {editingId === service._id ? (
                          <>
                            <TableCell>
                              <Input
                                value={newService.name}
                                onChange={(e) =>
                                  setNewService({
                                    ...newService,
                                    name: e.target.value,
                                  })
                                }
                              />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Input
                                value={newService.description}
                                onChange={(e) =>
                                  setNewService({
                                    ...newService,
                                    description: e.target.value,
                                  })
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Slider
                                min={1}
                                max={50}
                                step={1}
                                value={[newService.points]}
                                onValueChange={(value) =>
                                  setNewService({
                                    ...newService,
                                    points: value[0],
                                  })
                                }
                                className="w-24"
                              />
                              <span className="ml-2">{newService.points}</span>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSaveService(service._id)}
                              >
                                <Save className="mr-2 h-4 w-4" />
                                Save
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={cancelEditing}
                              >
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                              </Button>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell className="font-medium">
                              {service.name}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {service.Description}
                            </TableCell>
                            <TableCell>
                              <span className="font-bold">
                                {service.points}
                              </span>{" "}
                              points
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startEditing(service)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteService(service._id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </Button>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        No services found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
