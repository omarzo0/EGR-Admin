"use client";

import { useEffect, useState } from "react";
import { Eye, MoreHorizontal, UserCheck, UserX, Trash2 } from "lucide-react";
import { Button } from "../../../lib/ui/button";
import { Link } from "react-router-dom";

export function AdminWalletList({ wallets }) {
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/digital-document"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }

        const data = await response.json();

        // Transform the API data to match your table structure
        const transformedData = data.citizens.map((citizen) => ({
          id: citizen.citizen.wallet_id,
          first_name: citizen.citizen.first_name,
          email: citizen.citizen.email,
          dateCreated: citizen.citizen.account_created,
          document_count: citizen.documents.length,
          status: citizen.citizen.wallet_status,
          documents: citizen.documents, // Keep the full documents array if needed
        }));

        setDocuments(transformedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const toggleActionMenu = (id) => {
    setActionMenuOpen(actionMenuOpen === id ? null : id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSuspendWallet = async (citizenId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/wallet/suspend/${citizenId}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to suspend wallet");
      }

      // Update the local state to reflect the change
      setDocuments((docs) =>
        docs.map((doc) =>
          doc.id === citizenId ? { ...doc, status: "suspended" } : doc
        )
      );

      setActionMenuOpen(null);
    } catch (err) {
      console.error("Error suspending wallet:", err);
      setError(err.message);
    }
  };

  const handleActivateWallet = async (citizenId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/wallet/unsuspend/${citizenId}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to activate wallet");
      }

      // Update the local state to reflect the change
      setDocuments((docs) =>
        docs.map((doc) =>
          doc.id === citizenId ? { ...doc, status: "active" } : doc
        )
      );

      setActionMenuOpen(null);
    } catch (err) {
      console.error("Error activating wallet:", err);
      setError(err.message);
    }
  };

  const handleDeleteWallet = async (citizenId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/admin/wallets/${citizenId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete wallet");
      }

      // Remove the wallet from local state
      setDocuments((docs) => docs.filter((doc) => doc.id !== citizenId));
      setActionMenuOpen(null);
    } catch (err) {
      console.error("Error deleting wallet:", err);
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
              User
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
              Wallet ID
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
              Created
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
              Documents
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
          {documents.map((doc) => (
            <tr key={doc.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium mr-3">
                    {doc.first_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{doc.first_name}</p>
                    <p className="text-sm text-gray-500">{doc.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 text-sm">{doc.id}</td>
              <td className="px-4 py-4 text-sm">
                {formatDate(doc.dateCreated)}
              </td>
              <td className="px-4 py-4 text-sm">{doc.document_count}</td>
              <td className="px-4 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    doc.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {doc.status === "active" ? "Active" : "Suspended"}
                </span>
              </td>
              <td className="px-4 py-4 text-right">
                <div className="relative">
                  <button
                    onClick={() => toggleActionMenu(doc.id)}
                    className="p-1 rounded-md hover:bg-gray-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>

                  {actionMenuOpen === doc.id && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1" role="menu">
                        <Link
                          to={`/app/wallet/${doc.id}`}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-3 h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          View Details
                        </Link>

                        {doc.status === "active" ? (
                          <button
                            onClick={() => handleSuspendWallet(doc.id)}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="mr-3 h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M5.636 5.636l3.536 3.536m0 5.656l-3.536 3.536"
                              />
                            </svg>
                            Suspend Wallet
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivateWallet(doc.id)}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="mr-3 h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Activate Wallet
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteWallet(doc.id)}
                          className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-3 h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete Wallet
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
  );
}
