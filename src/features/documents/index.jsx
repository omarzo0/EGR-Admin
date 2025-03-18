"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  File,
  Download,
  Eye,
  Edit,
  Trash2,
  Calendar,
} from "lucide-react";
import { Button } from "../../lib/ui/button";
import { Input } from "../../lib/ui/input";
import { Card, CardContent } from "../../lib/ui/card";
import { Badge } from "../../lib/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../lib/ui/tabs";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../lib/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../lib/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../lib/ui/dropdown-menu";
import { Label } from "../../lib/ui/label";
import { Textarea } from "../../lib/ui/textarea";
import { MoreVertical } from "lucide-react";
export default function DocumentsPage() {
  const [citizenIdFilter, setCitizenIdFilter] = useState("");
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // This would come from a database in a real application
  const documents = [
    {
      id: "DOC-12345",
      type: "Passport",
      citizenId: "CIT-12345",
      citizenName: "John Smith",
      submissionDate: "2025-02-15",
      expiryDate: "2035-02-15",
      status: "Approved",
      department: "Immigration & Passports",
    },
    {
      id: "DOC-23456",
      type: "Birth Certificate",
      citizenId: "CIT-23456",
      citizenName: "Maria Garcia",
      submissionDate: "2025-02-18",
      expiryDate: null,
      status: "Pending",
      department: "Civil Registry",
    },
    {
      id: "DOC-34567",
      type: "Driver's License",
      citizenId: "CIT-34567",
      citizenName: "David Johnson",
      submissionDate: "2025-02-20",
      expiryDate: "2030-02-20",
      status: "Approved",
      department: "Driver & Vehicle",
    },
    {
      id: "DOC-45678",
      type: "National ID Card",
      citizenId: "CIT-12345",
      citizenName: "John Smith",
      submissionDate: "2025-02-22",
      expiryDate: "2035-02-22",
      status: "In Review",
      department: "National ID",
    },
    {
      id: "DOC-56789",
      type: "Property Title",
      citizenId: "CIT-56789",
      citizenName: "Michael Brown",
      submissionDate: "2025-02-25",
      expiryDate: null,
      status: "Rejected",
      department: "Property & Land",
    },
    {
      id: "DOC-67890",
      type: "Marriage Certificate",
      citizenId: "CIT-67890",
      citizenName: "Emily Wilson",
      submissionDate: "2025-02-28",
      expiryDate: null,
      status: "Approved",
      department: "Civil Registry",
    },
    {
      id: "DOC-78901",
      type: "Business Registration",
      citizenId: "CIT-78901",
      citizenName: "Robert Taylor",
      submissionDate: "2025-03-01",
      expiryDate: "2026-03-01",
      status: "Pending",
      department: "Tax & Revenue",
    },
    {
      id: "DOC-89012",
      type: "Tax Certificate",
      citizenId: "CIT-12345",
      citizenName: "John Smith",
      submissionDate: "2025-03-05",
      expiryDate: "2026-03-05",
      status: "In Review",
      department: "Tax & Revenue",
    },
  ];

  // Filter documents by citizen ID if a filter is applied
  const filteredDocuments = citizenIdFilter
    ? documents.filter(
        (doc) =>
          doc.citizenId.toLowerCase().includes(citizenIdFilter.toLowerCase()) ||
          doc.citizenName.toLowerCase().includes(citizenIdFilter.toLowerCase())
      )
    : documents;

  const handleStatusUpdate = (document, newStatus) => {
    // In a real application, this would update the database
    console.log(`Updating document ${document.id} status to ${newStatus}`);
    setShowStatusDialog(false);
  };

  const handleDeleteDocument = (document) => {
    // In a real application, this would delete from the database
    console.log(`Deleting document ${document.id}`);
  };

  const openStatusDialog = (document) => {
    setSelectedDocument(document);
    setShowStatusDialog(true);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Document Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Documents
          </Button>
        </div>
      </div>

      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search by citizen ID or name..."
            className="pl-10"
            value={citizenIdFilter}
            onChange={(e) => setCitizenIdFilter(e.target.value)}
          />
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
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-review">In Review</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-review">In Review</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <DocumentsTable
            documents={filteredDocuments}
            onStatusUpdate={openStatusDialog}
            onDelete={handleDeleteDocument}
          />
        </TabsContent>

        <TabsContent value="approved">
          <DocumentsTable
            documents={filteredDocuments.filter(
              (doc) => doc.status === "Approved"
            )}
            onStatusUpdate={openStatusDialog}
            onDelete={handleDeleteDocument}
          />
        </TabsContent>

        <TabsContent value="pending">
          <DocumentsTable
            documents={filteredDocuments.filter(
              (doc) => doc.status === "Pending"
            )}
            onStatusUpdate={openStatusDialog}
            onDelete={handleDeleteDocument}
          />
        </TabsContent>

        <TabsContent value="in-review">
          <DocumentsTable
            documents={filteredDocuments.filter(
              (doc) => doc.status === "In Review"
            )}
            onStatusUpdate={openStatusDialog}
            onDelete={handleDeleteDocument}
          />
        </TabsContent>

        <TabsContent value="rejected">
          <DocumentsTable
            documents={filteredDocuments.filter(
              (doc) => doc.status === "Rejected"
            )}
            onStatusUpdate={openStatusDialog}
            onDelete={handleDeleteDocument}
          />
        </TabsContent>
      </Tabs>

      {/* Status Update Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Document Status</DialogTitle>
            <DialogDescription>
              Change the status for document {selectedDocument?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Document ID:</Label>
              <div className="col-span-3 font-medium">
                {selectedDocument?.id}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Type:</Label>
              <div className="col-span-3">{selectedDocument?.type}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Citizen:</Label>
              <div className="col-span-3">
                {selectedDocument?.citizenName} ({selectedDocument?.citizenId})
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Current Status:</Label>
              <div className="col-span-3">
                <Badge
                  className={getStatusBadgeColor(selectedDocument?.status)}
                >
                  {selectedDocument?.status}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                New Status:
              </Label>
              <Select className="col-span-3">
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>

                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-review">In Review</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes:
              </Label>
              <Textarea
                id="notes"
                placeholder="Add notes about this status change"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStatusDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleStatusUpdate(selectedDocument, "Approved")}
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DocumentsTable({ documents, onStatusUpdate, onDelete }) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-6 py-3">Document ID</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Citizen</th>
                <th className="px-6 py-3">Submission Date</th>
                <th className="px-6 py-3">Expiry Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {documents.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No documents found
                  </td>
                </tr>
              ) : (
                documents.map((document) => (
                  <tr key={document.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        <File className="mr-2 h-4 w-4 text-gray-400" />
                        {document.id}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {document.type}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {document.citizenName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {document.citizenId}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                        {new Date(document.submissionDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {document.expiryDate
                        ? new Date(document.expiryDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <Badge className={getStatusBadgeColor(document.status)}>
                        {document.status}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {document.department}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                (window.location.href = `/app/details`)
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onStatusUpdate(document)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Update Status</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:bg-red-50 focus:text-red-600"
                              onClick={() => onDelete(document)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete Document</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function getStatusBadgeColor(status) {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "In Review":
      return "bg-blue-100 text-blue-800";
    case "Rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

// Import missing components
