import { Link } from "react-router-dom";
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
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../lib/ui/select";

export default function DocumentDetailPage() {
  // This would come from a database in a real application
  const documentDetails = {
    "DOC-12345": {
      id: "DOC-12345",
      type: "Passport",
      citizenId: "CIT-12345",
      citizenName: "John Smith",
      submissionDate: "2025-02-15",
      expiryDate: "2035-02-15",
      status: "Approved",
      department: "Immigration & Passports",
      issuedBy: "Admin-001",
      issuedDate: "2025-02-20",
      documentNumber: "P12345678",
      notes: "Standard 10-year passport issued.",
      history: [
        {
          date: "2025-02-15",
          status: "Submitted",
          user: "John Smith",
          notes: "Application submitted online.",
        },
        {
          date: "2025-02-16",
          status: "In Review",
          user: "Admin-002",
          notes: "Documents verified.",
        },
        {
          date: "2025-02-18",
          status: "In Review",
          user: "Admin-003",
          notes: "Background check completed.",
        },
        {
          date: "2025-02-20",
          status: "Approved",
          user: "Admin-001",
          notes: "Passport approved and issued.",
        },
      ],
    },
    "DOC-23456": {
      id: "DOC-23456",
      type: "Birth Certificate",
      citizenId: "CIT-23456",
      citizenName: "Maria Garcia",
      submissionDate: "2025-02-18",
      expiryDate: null,
      status: "Pending",
      department: "Civil Registry",
      issuedBy: null,
      issuedDate: null,
      documentNumber: null,
      notes: "Waiting for additional documentation.",
      history: [
        {
          date: "2025-02-18",
          status: "Submitted",
          user: "Maria Garcia",
          notes: "Application submitted in person.",
        },
        {
          date: "2025-02-19",
          status: "Pending",
          user: "Admin-004",
          notes: "Additional documentation requested.",
        },
      ],
    },
  };
  const document = documentDetails["DOC-12345"]; // You can change this to the document ID you want to display.

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/app/documents"
          className="mb-6 flex items-center text-sm font-medium text-gray-600 hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documents
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{document.type}</h1>
            <p className="text-gray-500">Document ID: {document.id}</p>
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
                    Change the status for document {document.id}
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
                  <Button variant="outline">Cancel</Button>
                  <Button>Update Status</Button>
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
                    Document Type
                  </h3>
                  <p>{document.type}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Document Number
                  </h3>
                  <p>{document.documentNumber || "Not issued yet"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Department
                  </h3>
                  <p>{document.department}</p>
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
                    {document.submissionDate !== "Unknown"
                      ? new Date(document.submissionDate).toLocaleDateString()
                      : "Unknown"}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Expiry Date
                  </h3>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                    {document.expiryDate
                      ? new Date(document.expiryDate).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Issued By
                  </h3>
                  <p>{document.issuedBy || "Not issued yet"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Issued Date
                  </h3>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                    {document.issuedDate
                      ? new Date(document.issuedDate).toLocaleDateString()
                      : "Not issued yet"}
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
              <CardTitle>Document History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute bottom-0 left-5 top-0 w-px bg-gray-200"></div>
                <ul className="space-y-6">
                  {document.history.length > 0 ? (
                    document.history.map((event, index) => (
                      <li key={index} className="relative pl-10">
                        <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full border border-white bg-white">
                          {event.status === "Approved" ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : event.status === "Rejected" ? (
                            <XCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                        <div className="rounded-lg border bg-white p-4 shadow-sm">
                          <div className="mb-2 flex items-center justify-between">
                            <Badge
                              className={getStatusBadgeColor(event.status)}
                            >
                              {event.status}
                            </Badge>
                            <time className="text-xs text-gray-500">
                              {new Date(event.date).toLocaleString()}
                            </time>
                          </div>
                          <p className="text-sm text-gray-700">{event.notes}</p>
                          <p className="mt-1 text-xs text-gray-500">
                            By: {event.user}
                          </p>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="text-center text-gray-500">
                      No history available
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
              <CardTitle>Related Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {document.id === "DOC-12345" ? (
                  <>
                    <li className="flex items-center rounded-lg border p-3">
                      <File className="mr-3 h-5 w-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="font-medium">National ID Card</p>
                        <p className="text-xs text-gray-500">DOC-45678</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        In Review
                      </Badge>
                    </li>
                    <li className="flex items-center rounded-lg border p-3">
                      <File className="mr-3 h-5 w-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="font-medium">Tax Certificate</p>
                        <p className="text-xs text-gray-500">DOC-89012</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        In Review
                      </Badge>
                    </li>
                  </>
                ) : (
                  <li className="text-center text-gray-500">
                    No related documents found
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>

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
              <Button variant="destructive" className="w-full">
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
    case "Submitted":
      return "bg-blue-100 text-blue-800";
    case "Rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
