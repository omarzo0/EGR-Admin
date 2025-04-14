import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  File,
  Calendar,
  User,
  Download,
  Printer,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "../../../lib/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../lib/ui/card";
import { Badge } from "../../../lib/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../lib/ui/dialog";
import { Label } from "../../../lib/ui/label";
import { Textarea } from "../../../lib/ui/textarea";
import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showNotification } from "../../common/headerSlice";
import { useNavigate } from "react-router-dom";

export default function DocumentDetailPage() {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:5000/api/admin/document/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch document details");
        }
        const data = await response.json();

        if (data.success) {
          setDocument(data.data);
        } else {
          throw new Error(data.message || "Failed to load document data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocumentDetails();
  }, [id]);
  const deleteDocument = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/admin/delete-document/${id}`
      );
      dispatch(
        showNotification({
          message: response.data.message || "Document Deleted Successfully",
          status: 1,
        })
      );
      navigate(-1);
    } catch (error) {
      console.error("Error deleting document:", error);
      dispatch(
        showNotification({
          message: error.response?.data?.message || "Failed to delete document",
          status: 0,
        })
      );
    }
  };

  const [newStatus, setNewStatus] = useState("");
  const [rejection_reason, setRejectReason] = useState("");
  const updateDocumentStatus = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/update-document/${document._id}`,
        {
          status: newStatus,
          rejection_reason: rejection_reason,
        }
      );
      dispatch(
        showNotification({
          message: "Document status updated successfully",
          status: 1,
        })
      );
      // Refresh document data after update
      // fetchDocument();
      // Close the dialog if you're using one
      // setOpen(false);
    } catch (error) {
      console.error("Error updating document status:", error);
      dispatch(
        showNotification({
          message: error.response?.data?.message || "Failed to update status",
          status: 0,
        })
      );
    }
  };

  if (isLoading) {
    return <div>Loading document details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!document) {
    return <div>Document not found</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/app/documents"
          className="mb-6 flex items-center text-sm font-medium text-gray-600 hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documents
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{document.service_id.name}</h1>
            <p className="text-gray-500">
              Document ID: {document.document_number}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Update Status
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Document Status</DialogTitle>
                  <DialogDescription>
                    Change the status for document {document.document_number}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Current Status:</Label>
                    <div className="col-span-3">
                      <Badge className={getStatusBadgeColor(document.status)}>
                        {document.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      New Status:
                    </Label>
                    <select
                      id="status"
                      className="col-span-3 p-2 border rounded-md"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                    >
                      <option value="">Select status</option>
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending</option>
                      <option value="Reviewed">In Review</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Conditionally show rejection reason textarea */}
                  {newStatus === "Rejected" && (
                    <div className="grid grid-cols-4 items-center gap-4 mt-4">
                      <Label htmlFor="rejection_reason" className="text-right">
                        Rejection Reason:
                      </Label>
                      <Textarea
                        id="rejection_reason"
                        placeholder="Enter the reason for rejection"
                        className="col-span-3"
                        value={rejection_reason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        required // Makes it mandatory when visible
                      />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={updateDocumentStatus}>Update Status</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Document Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Service Name
                  </h3>
                  <p>{document.service_id.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Document Number
                  </h3>
                  <p>{document.document_number || "Not issued yet"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Department
                  </h3>
                  <p>{document.department_id.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <Badge className={getStatusBadgeColor(document.status)}>
                    {document.status}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Submission Date
                  </h3>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                    {formatDate(document.createdAt)}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Amount</h3>
                  <p>{document.amount}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Issued By
                  </h3>
                  <p>{document.issued_by || "Not issued yet"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Issued Date
                  </h3>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                    {formatDate(document.issued_date)}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                <p className="mt-1 whitespace-pre-line">
                  {document.notes || "No notes available"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Applicant Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Full Name
                  </h3>
                  <p>
                    {document.citizen_id.first_name}{" "}
                    {document.citizen_id.last_name}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Preferred Contact Method
                  </h3>
                  <div className="flex items-center">
                    {document.preferred_contact_method === "Phone" ? (
                      <Phone className="mr-2 h-4 w-4 text-gray-400" />
                    ) : (
                      <Mail className="mr-2 h-4 w-4 text-gray-400" />
                    )}
                    {document.preferred_contact_method}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Phone Number
                  </h3>
                  <p>{document.citizen_id.phone_number}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p>{document.citizen_id.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Document History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute bottom-0 left-5 top-0 w-px bg-gray-200"></div>
                <ul className="space-y-6">
                  <li className="relative pl-10">
                    <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full border border-white bg-white">
                      <Clock className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                      <div className="mb-2 flex items-center justify-between">
                        <Badge className={getStatusBadgeColor(document.status)}>
                          {document.status}
                        </Badge>
                        <time className="text-xs text-gray-500">
                          {formatDate(document.createdAt)}
                        </time>
                      </div>

                      <p className="text-sm text-gray-700">
                        {document.service_id.name}
                      </p>

                      {document.status === "rejected" &&
                        document.rejection_reason && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded-md">
                            <p className="text-xs font-medium text-red-600">
                              Rejection Reason:
                            </p>
                            <p className="text-sm text-red-700">
                              {document.rejection_reason}
                            </p>
                          </div>
                        )}
                    </div>
                  </li>
                  {document.approval_date && (
                    <li className="relative pl-10">
                      <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full border border-white bg-white">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="mb-2 flex items-center justify-between">
                          <Badge className="bg-green-100 text-green-800">
                            Approved
                          </Badge>
                          <time className="text-xs text-gray-500">
                            {formatDate(document.approval_date)}
                          </time>
                        </div>
                        <p className="text-sm text-gray-700">
                          Document approved by {document.issued_by}
                        </p>
                      </div>
                    </li>
                  )}
                  {document.rejection_reason && (
                    <li className="relative pl-10">
                      <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full border border-white bg-white">
                        <XCircle className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="mb-2 flex items-center justify-between">
                          <Badge className="bg-red-100 text-red-800">
                            Rejected
                          </Badge>
                          <time className="text-xs text-gray-500">
                            {formatDate(document.updatedAt)}
                          </time>
                        </div>
                        <p className="text-sm text-gray-700">
                          {document.rejection_reason}
                        </p>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Document
              </Button>
              <Button variant="outline" className="w-full">
                <Printer className="mr-2 h-4 w-4" />
                Print Document
              </Button>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => deleteDocument(document._id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Document
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
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
