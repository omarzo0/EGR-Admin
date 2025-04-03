"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../../../lib/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../lib/ui/card";
import { AdminDocumentList } from "../components/admin-document-list";

export default function WalletDetails() {
  const { id } = useParams(); // Get the wallet ID from URL
  const [wallet, setWallet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchWalletDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Replace this with your actual API call
        const response = await fetch(
          `http://localhost:5000/api/admin/digital-wallet-details/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch wallet details");
        }
        const data = await response.json();

        if (data.success) {
          // Transform the API data to match your component structure
          const transformedData = {
            id: data.data.citizen.wallet_id,
            citizen: {
              first_name: data.data.citizen.first_name,
              email: data.data.citizen.email,
              national_id: data.data.citizen.national_id,
              wallet_status: data.data.citizen.wallet_status,
            },
            dateCreated: data.data.citizen.account_created,
            status: data.data.citizen.wallet_status,
            documents: data.data.documents.map((doc) => ({
              id: doc.id,
              name: doc.name,
              type: doc.type,
              number: doc.number,
              status: doc.status,
              created_at: doc.created_at,
              expiry_date: doc.expiry_date,
              document_image: doc.document_image,
            })),
          };
          setWallet(transformedData);
        } else {
          throw new Error(data.message || "Failed to load wallet data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletDetails();
  }, [id]);
  const handleStatusChange = async (documentId, newStatus) => {
    try {
      // First update the UI optimistically
      setWallet((prevWallet) => ({
        ...prevWallet,
        documents: prevWallet.documents.map((doc) =>
          doc.id === documentId ? { ...doc, status: newStatus } : doc
        ),
      }));

      // Then make the API call
      const response = await fetch(
        `http://localhost:5000/api/admin/digital-document/${documentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status:
              newStatus === "approved"
                ? "Issued"
                : newStatus === "rejected"
                ? "Revoked"
                : "Pending",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update document status");
      }
    } catch (err) {
      // Revert UI if API call fails
      setWallet((prevWallet) => ({
        ...prevWallet,
        documents: prevWallet.documents.map((doc) =>
          doc.id === documentId
            ? {
                ...doc,
                status: doc.status, // revert to original status
              }
            : doc
        ),
      }));
      setError(err.message);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    try {
      // First remove from UI optimistically
      setWallet((prevWallet) => ({
        ...prevWallet,
        documents: prevWallet.documents.filter((doc) => doc.id !== documentId),
      }));

      // Then make the API call
      const response = await fetch(
        `http://localhost:5000/api/admin/documents/${documentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete document");
      }
    } catch (err) {
      // Revert UI if API call fails
      setWallet((prevWallet) => ({
        ...prevWallet,
        documents: [...prevWallet.documents], // revert to original list
      }));
      setError(err.message);
    }
  };

  const handleWalletStatusChange = async (newStatus) => {
    try {
      // First update the UI optimistically
      setWallet((prevWallet) => ({ ...prevWallet, status: newStatus }));

      // Then make the API call
      const endpoint =
        newStatus === "active"
          ? `http://localhost:5000/api/admin/wallet/unsuspend/${id}`
          : `http://localhost:5000/api/admin/wallet/suspend/${id}`;

      const response = await fetch(endpoint, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${newStatus === "active" ? "activate" : "suspend"} wallet`
        );
      }
    } catch (err) {
      // Revert UI if API call fails
      setWallet((prevWallet) => ({ ...prevWallet, status: prevWallet.status }));
      setError(err.message);
    }
  };

  const handleDeleteWallet = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/admin/wallets/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete wallet");
      }

      // Redirect to dashboard after successful deletion
      window.location.href = "/app/digital-wallet";
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent"></div>
          <p className="mt-2 text-gray-500">Loading wallet details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Wallet Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="mr-2 h-4 w-4" />
                    User Name
                  </div>
                  <p className="font-medium">{wallet?.citizen.first_name}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </div>
                  <p className="font-medium">{wallet?.citizen.email}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <FileText className="mr-2 h-4 w-4" />
                    Wallet ID
                  </div>
                  <p className="font-medium">{wallet?.id}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    Date Created
                  </div>
                  <p className="font-medium">
                    {formatDate(wallet?.dateCreated)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Wallet Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-full">
                {wallet?.status === "active" ? (
                  <>
                    <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                    <h3 className="text-lg font-medium">Active</h3>
                    <p className="text-sm text-gray-500 text-center mt-2">
                      This wallet is currently active and operational.
                    </p>
                    <Button
                      variant="destructive"
                      className="mt-4 w-full"
                      onClick={() => handleWalletStatusChange("suspended")}
                    >
                      Suspend Wallet
                    </Button>
                  </>
                ) : (
                  <>
                    <XCircle className="h-12 w-12 text-red-500 mb-4" />
                    <h3 className="text-lg font-medium">Suspended</h3>
                    <p className="text-sm text-gray-500 text-center mt-2">
                      This wallet is currently suspended and cannot be used.
                    </p>
                    <Button
                      className="mt-4 w-full"
                      onClick={() => handleWalletStatusChange("active")}
                    >
                      Activate Wallet
                    </Button>
                  </>
                )}

                <Button
                  variant="outline"
                  className="mt-2 w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={handleDeleteWallet}
                >
                  Delete Wallet
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Documents ({wallet?.documents?.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {wallet?.documents?.length > 0 ? (
              <AdminDocumentList
                documents={wallet.documents}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteDocument}
              />
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">No Documents</h3>
                <p className="text-gray-500 mt-2">
                  This wallet doesn't have any documents yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
