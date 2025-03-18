"use client";

import { useState, useEffect } from "react";

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
import { Link } from "react-router-dom";

// Mock data for demonstration
const mockWallets = {
  w1: {
    id: "w1",
    userId: "user1",
    userName: "John Doe",
    email: "john@example.com",
    dateCreated: "2023-01-15T10:30:00Z",
    status: "active",
    documents: [
      {
        id: "doc1",
        name: "National ID",
        type: "National ID",
        documentNumber: "ID12345678",
        expiryDate: "2028-01-15",
        dateAdded: "2023-01-16T10:30:00Z",
        status: "approved",
      },
      {
        id: "doc2",
        name: "Driver License",
        type: "Driver License",
        documentNumber: "DL87654321",
        expiryDate: "2026-05-20",
        dateAdded: "2023-01-18T14:45:00Z",
        status: "pending",
      },
      {
        id: "doc3",
        name: "Passport",
        type: "Passport",
        documentNumber: "P98765432",
        expiryDate: "2030-11-10",
        dateAdded: "2023-02-05T09:15:00Z",
        status: "rejected",
      },
    ],
  },
  w2: {
    id: "w2",
    userId: "user2",
    userName: "Jane Smith",
    email: "jane@example.com",
    dateCreated: "2023-02-20T14:45:00Z",
    status: "active",
    documents: [
      {
        id: "doc4",
        name: "National ID",
        type: "National ID",
        documentNumber: "ID87654321",
        expiryDate: "2027-03-25",
        dateAdded: "2023-02-21T10:30:00Z",
        status: "approved",
      },
      {
        id: "doc5",
        name: "Passport",
        type: "Passport",
        documentNumber: "P12345678",
        expiryDate: "2031-08-15",
        dateAdded: "2023-03-10T14:45:00Z",
        status: "approved",
      },
    ],
  },
};

export default function WalletDetails() {
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
    setTimeout(() => {
      const walletId = "w1";
      if (mockWallets[walletId]) {
        setWallet(mockWallets[walletId]);
        setIsLoading(false);
      } else {
        setError("Wallet not found");
        setIsLoading(false);
      }
    }, 1000); // Simulate 1-second API delay
  }, []);

  const handleStatusChange = (documentId, newStatus) => {
    // In a real application, this would be an API call
    // For demonstration, we're updating the local state
    setWallet((prevWallet) => {
      const updatedDocuments = prevWallet.documents.map((doc) => {
        if (doc.id === documentId) {
          return { ...doc, status: newStatus };
        }
        return doc;
      });
      return { ...prevWallet, documents: updatedDocuments };
    });
  };

  const handleDeleteDocument = (documentId) => {
    // In a real application, this would be an API call
    // For demonstration, we're updating the local state
    setWallet((prevWallet) => {
      const updatedDocuments = prevWallet.documents.filter(
        (doc) => doc.id !== documentId
      );
      return { ...prevWallet, documents: updatedDocuments };
    });
  };

  const handleDeleteWallet = () => {
    // In a real application, this would be an API call
    // For demonstration, we're just navigating back
    alert("Wallet deleted successfully");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link
            href="/app/digital-wallet"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent"></div>
            <p className="mt-2 text-gray-500">Loading wallet details...</p>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-lg font-medium">{error}</h3>
              <p className="text-gray-500 mt-2">
                The wallet you're looking for doesn't exist or you don't have
                permission to view it.
              </p>
              <Button className="mt-4">Return to Dashboard</Button>
            </CardContent>
          </Card>
        ) : (
          <>
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
                      <p className="font-medium">{wallet.userName}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                      </div>
                      <p className="font-medium">{wallet.email}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <FileText className="mr-2 h-4 w-4" />
                        Wallet ID
                      </div>
                      <p className="font-medium">{wallet.id}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="mr-2 h-4 w-4" />
                        Date Created
                      </div>
                      <p className="font-medium">
                        {formatDate(wallet.dateCreated)}
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
                    {wallet.status === "active" ? (
                      <>
                        <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                        <h3 className="text-lg font-medium">Active</h3>
                        <p className="text-sm text-gray-500 text-center mt-2">
                          This wallet is currently active and operational.
                        </p>
                        <Button
                          variant="destructive"
                          className="mt-4 w-full"
                          onClick={() => {
                            setWallet({ ...wallet, status: "suspended" });
                          }}
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
                          onClick={() => {
                            setWallet({ ...wallet, status: "active" });
                          }}
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
                <CardTitle>Documents ({wallet.documents.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {wallet.documents.length > 0 ? (
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
          </>
        )}
      </main>
    </div>
  );
}
