import { Link } from "react-router-dom";
import { useState } from "react";

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

export default function DepartmentsPage() {
  const departments = [
    {
      id: "civil-registry",
      title: "Civil Registry",
      description: "Birth, marriage, and death certificates",
      serviceCount: 3,
      color: "bg-blue-50",
      iconColor: "text-blue-500",
      icon: "FileText",
    },
    {
      id: "immigration",
      title: "Immigration & Passports",
      description: "Passport applications, renewals, and visa services",
      serviceCount: 2,
      color: "bg-green-50",
      iconColor: "text-green-500",
      icon: "Plane",
    },
    {
      id: "national-id",
      title: "National ID",
      description: "National ID cards, renewals, and updates",
      serviceCount: 1,
      color: "bg-purple-50",
      iconColor: "text-purple-500",
      icon: "CreditCard",
    },
    {
      id: "driver-vehicle",
      title: "Driver & Vehicle",
      description: "Driver's licenses, vehicle registration, and permits",
      serviceCount: 2,
      color: "bg-orange-50",
      iconColor: "text-orange-500",
      icon: "Car",
    },
    {
      id: "tax",
      title: "Tax & Revenue",
      description: "Tax filing, business registration, and tax ID",
      serviceCount: 2,
      color: "bg-red-50",
      iconColor: "text-red-500",
      icon: "Receipt",
    },
    {
      id: "property",
      title: "Property & Land",
      description: "Property titles, deeds, and land registration",
      serviceCount: 2,
      color: "bg-teal-50",
      iconColor: "text-teal-500",
      icon: "Home",
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
        {departments.map((department) => (
          <Card key={department.id} className="overflow-hidden">
            <CardHeader className={`${department.color}`}>
              <CardTitle>{department.title}</CardTitle>
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
                    className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
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
        aria-labelledby="modal-title"
        className="w-[90%] max-w-[600px] m-auto"
      >
        <ModalContent>
          <ModalHeader className="text-lg font-semibold" id="modal-title">
            Add New Department
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="text-sm font-medium">
                  Department Name
                </label>
                <Input id="title" placeholder="Enter department name" />
              </div>

              <div>
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="Enter department description"
                  rows={3}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" asChild>
              <Link href="/admin/departments">Cancel</Link>
            </Button>
            <Button color="primary">Create Department</Button>
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
                    <Input id="title" defaultValue={"aas"} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" defaultValue={"aas"} rows={3} />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" asChild>
              <Link href="/admin/departments">Cancel</Link>
            </Button>
            <Button>Update Department</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
