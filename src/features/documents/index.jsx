import { useState, useEffect } from "react";
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
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
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
import { useDispatch } from "react-redux";
import { showNotification } from "../common/headerSlice";
import { Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api/admin";

export default function DocumentsPage() {
  const dispatch = useDispatch();
  const [searchFilter, setSearchFilter] = useState("");
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/document-list`);
        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }
        const data = await response.json();

        // Transform the API data to match our expected format
        const transformedDocuments = data.data.map((doc) => ({
          id: doc._id,
          documentNumber: doc.document_number || doc._id,
          type: doc.service_id?.name || "Unknown Service",
          citizenName: doc.citizen_id
            ? `${doc.citizen_id.first_name} ${doc.citizen_id.last_name}`
            : `${doc.first_name || ""} ${doc.last_name || ""}`.trim() ||
              "Unknown Citizen",
          citizenId: doc.citizen_id?.id_number || doc.id_number || "N/A",
          submissionDate: doc.application_date || doc.createdAt,
          status: doc.status,
          department: doc.department_id?.name || "Unknown Department",
          amount: doc.amount || 0,
          currency: doc.currency || "EGP",
          rejectionReason: doc.rejection_reason,
          preferredContactMethod: doc.preferred_contact_method,
        }));

        setDocuments(transformedDocuments);
      } catch (err) {
        setError(err.message);
        dispatch(
          showNotification({
            message: "Failed to fetch documents",
            status: 0,
          })
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [dispatch]);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.citizenId.toLowerCase().includes(searchFilter.toLowerCase()) ||
      doc.citizenName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      doc.documentNumber.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesDepartment =
      departmentFilter === "all" ||
      doc.department.toLowerCase().includes(departmentFilter.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      doc.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleStatusUpdate = async () => {
    if (!selectedDocument || !newStatus) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/update-document/${selectedDocument.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
            ...(newStatus === "Rejected" && {
              rejection_reason: rejectionReason,
            }),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update document status");
      }

      const updatedDoc = await response.json();

      // Update the local state to reflect the change
      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.id === selectedDocument.id
            ? { ...doc, status: newStatus, rejectionReason: rejectionReason }
            : doc
        )
      );

      dispatch(
        showNotification({
          message: `Document status updated to ${newStatus}`,
          status: 1,
        })
      );

      setShowStatusDialog(false);
      setNewStatus("");
      setRejectionReason("");
    } catch (err) {
      dispatch(
        showNotification({
          message: err.message || "Failed to update document status",
          status: 0,
        })
      );
    }
  };

  const handleDeleteDocument = async (document) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/delete-document/${document.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete document");
      }

      // Update the local state to remove the deleted document
      setDocuments((prevDocs) =>
        prevDocs.filter((doc) => doc.id !== document.id)
      );

      dispatch(
        showNotification({
          message: "Document deleted successfully",
          status: 1,
        })
      );
    } catch (err) {
      dispatch(
        showNotification({
          message: err.message || "Failed to delete document",
          status: 0,
        })
      );
    }
  };

  const openStatusDialog = (document) => {
    setSelectedDocument(document);
    setNewStatus(document.status); // Pre-fill with current status
    setRejectionReason(document.rejectionReason || "");
    setShowStatusDialog(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading documents...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Error: {error}
      </div>
    );
  }

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
            placeholder="Search by document number, citizen ID or name..."
            className="pl-10"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-4">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-review">In Review</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSearchFilter("");
              setDepartmentFilter("all");
              setStatusFilter("all");
            }}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <DocumentsTable
        documents={filteredDocuments}
        onStatusUpdate={openStatusDialog}
        onDelete={handleDeleteDocument}
      />

      {/* Status Update Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Document Status</DialogTitle>
            <DialogDescription>
              Change the status for document {selectedDocument?.documentNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Document ID:</Label>
              <div className="col-span-3 font-medium">
                {selectedDocument?.documentNumber}
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
              <Select
                value={newStatus}
                onValueChange={(value) => setNewStatus(value)}
              >
                <SelectTrigger className="col-span-3" id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Review">In Review</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </Select>
            </div>
            {newStatus === "Rejected" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reason" className="text-right">
                  Rejection Reason:
                </Label>
                <Textarea
                  id="reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter rejection reason"
                  className="col-span-3"
                  required
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowStatusDialog(false);
                setNewStatus("");
                setRejectionReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={
                !newStatus || (newStatus === "Rejected" && !rejectionReason)
              }
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
                <th className="px-6 py-3">Document Number</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Citizen</th>
                <th className="px-6 py-3">Submission Date</th>
                <th className="px-6 py-3">Amount</th>
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
                  <tr
                    key={document.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      (window.location.href = `/app/details/${document.id}`)
                    }
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        <File className="mr-2 h-4 w-4 text-gray-400" />
                        {document.documentNumber}
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
                      {document.amount} {document.currency}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <Badge className={getStatusBadgeColor(document.status)}>
                        {document.status}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {document.department}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      View
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
    case "Completed":
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
