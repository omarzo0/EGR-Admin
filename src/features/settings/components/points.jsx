import { useState } from "react";
import { Link } from "react-router-dom";
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
import { ChevronLeft, Plus, Edit, Save, X, Trash2 } from "lucide-react";
import { Slider } from "../../../lib/ui/slider";

// Mock data for service points
const mockServices = [
  {
    id: 1,
    name: "Waste Management",
    description: "Garbage collection and recycling services",
    points: 10,
  },
  {
    id: 2,
    name: "Road Maintenance",
    description: "Street repairs and maintenance",
    points: 15,
  },
  {
    id: 3,
    name: "Public Transportation",
    description: "Bus and transit services",
    points: 12,
  },
  {
    id: 4,
    name: "Parks and Recreation",
    description: "Public parks and recreational facilities",
    points: 8,
  },
  {
    id: 5,
    name: "Water Supply",
    description: "Water distribution and quality",
    points: 20,
  },
];

export default function PointsPage() {
  const [services, setServices] = useState(mockServices);
  const [editingId, setEditingId] = useState(null);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    points: 10,
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const startEditing = (service) => {
    setEditingId(service.id);
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

  const saveService = (id) => {
    if (newService.name && newService.description) {
      setServices(
        services.map((service) =>
          service.id === id ? { ...service, ...newService } : service
        )
      );
      setEditingId(null);
    }
  };

  const addService = () => {
    if (newService.name && newService.description) {
      const service = {
        id: services.length + 1,
        ...newService,
      };
      setServices([...services, service]);
      setNewService({
        name: "",
        description: "",
        points: 10,
      });
      setShowAddForm(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1">
        <div className="container py-6">
          {showAddForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add New Service</CardTitle>
                <CardDescription>
                  Define a new service type and assign points
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Service Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Enter service name"
                    value={newService.name}
                    onChange={(e) =>
                      setNewService({ ...newService, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Input
                    id="description"
                    placeholder="Enter service description"
                    value={newService.description}
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="points" className="text-sm font-medium">
                    Points Value: {newService.points}
                  </label>
                  <Slider
                    id="points"
                    min={1}
                    max={50}
                    step={1}
                    value={[newService.points]}
                    onValueChange={(value) =>
                      setNewService({ ...newService, points: value[0] })
                    }
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={addService}
                  disabled={!newService.name || !newService.description}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Service
                </Button>
              </CardFooter>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Service Points Configuration</CardTitle>
              <CardDescription>
                Manage point values assigned to different service types
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      {editingId === service.id ? (
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
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => saveService(service.id)}
                            >
                              <Save className="mr-2 h-4 w-4" />
                              Save
                            </Button>
                            <Button
                              variant="ghost"
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
                            {service.description}
                          </TableCell>
                          <TableCell>
                            <span className="font-bold">{service.points}</span>{" "}
                            points
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEditing(service)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              // Assuming you have a function to handle delete
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {/* Add the delete icon here */}
                              Delete
                            </Button>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
