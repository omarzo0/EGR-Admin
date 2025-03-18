"use client";

import { X, CheckCircle, XCircle, AlertTriangle, FileText } from "lucide-react";
import { Button } from "../../../lib/ui/button";

export function AdminDocumentViewer({ document, onClose, onStatusChange }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">Document Details</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center mb-4">
                <FileText className="h-16 w-16 text-gray-400" />
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Document Status
                  </h4>
                  <div className="flex space-x-2">
                    <Button
                      variant={
                        document.status === "approved" ? "default" : "outline"
                      }
                      size="sm"
                      className={
                        document.status === "approved" ? "bg-green-600" : ""
                      }
                      onClick={() => onStatusChange("approved")}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      variant={
                        document.status === "rejected" ? "default" : "outline"
                      }
                      size="sm"
                      className={
                        document.status === "rejected" ? "bg-red-600" : ""
                      }
                      onClick={() => onStatusChange("rejected")}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      variant={
                        document.status === "pending" ? "default" : "outline"
                      }
                      size="sm"
                      className={
                        document.status === "pending" ? "bg-yellow-600" : ""
                      }
                      onClick={() => onStatusChange("pending")}
                    >
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Pending
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Admin Notes
                  </h4>
                  <textarea
                    className="w-full h-24 p-2 border rounded-md text-sm"
                    placeholder="Add notes about this document (only visible to admins)"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Document Name
                </h4>
                <p className="font-medium">{document.name}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Document Type
                </h4>
                <p>{document.type}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Document Number
                </h4>
                <p>{document.documentNumber}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Date Added
                </h4>
                <p>{formatDate(document.dateAdded)}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Expiry Date
                </h4>
                <p>{formatDate(document.expiryDate)}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Current Status
                </h4>
                <div className="mt-1">
                  {document.status === "approved" && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span>Approved</span>
                    </div>
                  )}

                  {document.status === "rejected" && (
                    <div className="flex items-center text-red-600">
                      <XCircle className="h-5 w-5 mr-2" />
                      <span>Rejected</span>
                    </div>
                  )}

                  {document.status === "pending" && (
                    <div className="flex items-center text-yellow-600">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      <span>Pending Review</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
