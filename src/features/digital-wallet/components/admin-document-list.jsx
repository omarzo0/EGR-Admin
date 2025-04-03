"use client";

import { useState } from "react";
import {
  Eye,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trash2,
  FileText,
} from "lucide-react";
import { Button } from "../../../lib/ui/button";
import { AdminDocumentViewer } from "../components/admin-document-viewer";

export function AdminDocumentList({ documents, onStatusChange, onDelete }) {
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [viewingDocument, setViewingDocument] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const toggleActionMenu = (documentId) => {
    if (actionMenuOpen === documentId) {
      setActionMenuOpen(null);
    } else {
      setActionMenuOpen(documentId);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Document
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                ID/Number
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Added
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Expires
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Status
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={document.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{document.name}</p>
                      <p className="text-sm text-gray-500">{document.type}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm">{document.number}</td>
                <td className="px-4 py-4 text-sm">
                  {formatDate(document.created_at)}
                </td>
                <td className="px-4 py-4 text-sm">
                  {formatDate(document.expiry_date)}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(
                      document.status
                    )}`}
                  >
                    {getStatusIcon(document.status)}
                    <span className="ml-1 capitalize">{document.status}</span>
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleActionMenu(document.id)}
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>

                    {actionMenuOpen === document.id && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div
                          className="py-1"
                          role="menu"
                          aria-orientation="vertical"
                        >
                          <button
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              setViewingDocument(document);
                              setActionMenuOpen(null);
                            }}
                          >
                            <Eye className="mr-3 h-4 w-4" />
                            View Document
                          </button>

                          {document.status !== "approved" && (
                            <button
                              className="flex w-full items-center px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                              onClick={() => {
                                onStatusChange(document.id, "approved");
                                setActionMenuOpen(null);
                              }}
                            >
                              <CheckCircle className="mr-3 h-4 w-4" />
                              Approve Document
                            </button>
                          )}

                          {document.status !== "pending" && (
                            <button
                              className="flex w-full items-center px-4 py-2 text-sm text-yellow-600 hover:bg-gray-100"
                              onClick={() => {
                                onStatusChange(document.id, "pending");
                                setActionMenuOpen(null);
                              }}
                            >
                              <AlertTriangle className="mr-3 h-4 w-4" />
                              Mark as Pending
                            </button>
                          )}

                          {document.status !== "rejected" && (
                            <button
                              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              onClick={() => {
                                onStatusChange(document.id, "rejected");
                                setActionMenuOpen(null);
                              }}
                            >
                              <XCircle className="mr-3 h-4 w-4" />
                              Reject Document
                            </button>
                          )}

                          <button
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            onClick={() => {
                              setActionMenuOpen(null);
                              onDelete(document.id);
                            }}
                          >
                            <Trash2 className="mr-3 h-4 w-4" />
                            Delete Document
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewingDocument && (
        <AdminDocumentViewer
          document={viewingDocument}
          onClose={() => setViewingDocument(null)}
          onStatusChange={(newStatus) => {
            onStatusChange(viewingDocument.id, newStatus);
            setViewingDocument({ ...viewingDocument, status: newStatus });
          }}
        />
      )}
    </>
  );
}
