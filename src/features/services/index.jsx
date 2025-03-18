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

export default function ServicesPage() {
  const services = [
    {
      id: "passport",
      title: "Passport Application",
      description: "Apply for a new passport or renew an existing one",
      department: "Immigration & Passports",
      icon: "Plane",
      fee: "$145.00",
      processingTime: "4-6 weeks",
    },
    {
      id: "birth-certificate",
      title: "Birth Certificate",
      description: "Request a copy of a birth certificate",
      department: "Civil Registry",
      icon: "FileText",
      fee: "$25.00",
      processingTime: "3-5 business days",
    },
    {
      id: "drivers-license",
      title: "Driver's License",
      description: "Apply for or renew your driver's license",
      department: "Driver & Vehicle",
      icon: "Car",
      fee: "$60.00",
      processingTime: "7-10 business days",
    },
    {
      id: "national-id",
      title: "National ID Card",
      description: "Apply for a new national ID card or renew existing one",
      department: "National ID",
      icon: "CreditCard",
      fee: "$25.00",
      processingTime: "10-15 business days",
    },
    {
      id: "marriage-certificate",
      title: "Marriage Certificate",
      description: "Request a copy of a marriage certificate",
      department: "Civil Registry",
      icon: "Heart",
      fee: "$25.00",
      processingTime: "3-5 business days",
    },
    {
      id: "property-title",
      title: "Property Title",
      description: "Register property or request title documents",
      department: "Property & Land",
      icon: "Home",
      fee: "$75.00",
      processingTime: "15-20 business days",
    },
  ];
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
          <Button
            onClick={() => {
              onHideOpen();
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input placeholder="Search services..." className="pl-10" />
        </div>
        <div className="flex items-center space-x-4">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>

            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="civil-registry">Civil Registry</SelectItem>
            <SelectItem value="immigration">Immigration & Passports</SelectItem>
            <SelectItem value="national-id">National ID</SelectItem>
            <SelectItem value="driver-vehicle">Driver & Vehicle</SelectItem>
            <SelectItem value="tax">Tax & Revenue</SelectItem>
            <SelectItem value="property">Property & Land</SelectItem>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    {/* Icon would be dynamically rendered here */}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {service.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      onHideEdit();
                    }}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="border-t px-4 py-3 sm:px-6">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <Badge variant="outline">{service.department}</Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium">Fee:</span>
                  <span className="ml-1">{service.fee}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium">Processing Time:</span>
                  <span className="ml-1">{service.processingTime}</span>
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
        aria-labelledby="modal-title"
        className="w-[90%] max-w-[600px] m-auto"
      >
        <ModalContent>
          <ModalBody>
            <div>
              <Card className="mx-auto max-w-2xl">
                <CardHeader>
                  <CardTitle>Service Information</CardTitle>
                  <CardDescription>
                    Enter the details for the new service
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Service Name</Label>
                    <Input id="title" placeholder="Enter service name" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter service description"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select>
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>

                      <SelectItem value="civil-registry">
                        Civil Registry
                      </SelectItem>
                      <SelectItem value="immigration">
                        Immigration & Passports
                      </SelectItem>
                      <SelectItem value="national-id">National ID</SelectItem>
                      <SelectItem value="driver-vehicle">
                        Driver & Vehicle
                      </SelectItem>
                      <SelectItem value="tax">Tax & Revenue</SelectItem>
                      <SelectItem value="property">Property & Land</SelectItem>
                    </Select>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fee">Fee</Label>
                      <Input id="fee" placeholder="$0.00" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="processingTime">Processing Time</Label>
                      <Input
                        id="processingTime"
                        placeholder="e.g., 3-5 business days"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-4">
                  <Button variant="outline" asChild>
                    <Link href="/admin/services">Cancel</Link>
                  </Button>
                  <Button>Create Service</Button>
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

              <Card className="mx-auto max-w-2xl">
                <CardHeader>
                  <CardTitle>Service Information</CardTitle>
                  <CardDescription>
                    Update the details for this service
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Card className="mx-auto max-w-2xl">
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="title">Service Name</Label>
                          <Input id="title" defaultValue={"service.title"} />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            defaultValue={"service.description"}
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Select defaultValue={"service.department"}>
                            <SelectTrigger id="department">
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>

                            <SelectItem value="civil-registry">
                              Civil Registry
                            </SelectItem>
                            <SelectItem value="immigration">
                              Immigration & Passports
                            </SelectItem>
                            <SelectItem value="national-id">
                              National ID
                            </SelectItem>
                            <SelectItem value="driver-vehicle">
                              Driver & Vehicle
                            </SelectItem>
                            <SelectItem value="tax">Tax & Revenue</SelectItem>
                            <SelectItem value="property">
                              Property & Land
                            </SelectItem>
                          </Select>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="fee">Fee</Label>
                            <Input id="fee" defaultValue={"service.fee"} />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="processingTime">
                              Processing Time
                            </Label>
                            <Input
                              id="processingTime"
                              defaultValue={"service.processingTime"}
                            />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end space-x-4">
                        <Button variant="outline" asChild>
                          <Link href="/admin/services">Cancel</Link>
                        </Button>
                        <Button>Update Service</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
