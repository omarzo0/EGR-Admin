"use client";

import { useState, useEffect } from "react";
import {
  Search,
  UserCircle,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../../lib/ui/button";
import { Input } from "../../lib/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../lib/ui/card";
import { Select, SelectItem } from "../../lib/ui/select";
import { Label } from "../../lib/ui/label";
import { AdminWalletList } from "./components/admin-wallet-list";

// Mock data for demonstration
const mockWallets = [
  {
    id: "w1",
    userId: "user1",
    userName: "John Doe",
    email: "john@example.com",
    dateCreated: "2023-01-15T10:30:00Z",
    documentsCount: 3,
    status: "active",
  },
  {
    id: "w2",
    userId: "user2",
    userName: "Jane Smith",
    email: "jane@example.com",
    dateCreated: "2023-02-20T14:45:00Z",
    documentsCount: 2,
    status: "active",
  },
  {
    id: "w3",
    userId: "user3",
    userName: "Robert Johnson",
    email: "robert@example.com",
    dateCreated: "2023-03-05T09:15:00Z",
    documentsCount: 4,
    status: "suspended",
  },
  {
    id: "w4",
    userId: "user4",
    userName: "Emily Davis",
    email: "emily@example.com",
    dateCreated: "2023-04-10T16:20:00Z",
    documentsCount: 1,
    status: "active",
  },
  {
    id: "w5",
    userId: "user5",
    userName: "Michael Wilson",
    email: "michael@example.com",
    dateCreated: "2023-05-25T11:10:00Z",
    documentsCount: 5,
    status: "active",
  },
];

export default function AdminDashboard() {
  const [wallets, setWallets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would be an API call
    // For demonstration, we're using mock data
    setTimeout(() => {
      setWallets(mockWallets);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredWallets = wallets?.filter((wallet) => {
    const matchesSearch =
      wallet.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || wallet.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    suspended: 0,
    documents: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/admin/statistics/digital-wallets"
        );
        const data = await response.json();
        if (data.status === "success") {
          setStats({
            total: data.data.wallets.total,
            active: data.data.wallets.active,
            suspended: data.data.wallets.suspended,
            documents: data.data.documents.total,
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">
          Digital Wallet Administration
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Wallets</p>
                  <h3 className="text-2xl font-bold">{stats.total}</h3>
                </div>
                <UserCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Wallets</p>
                  <h3 className="text-2xl font-bold">{stats.active}</h3>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Suspended Wallets</p>
                  <h3 className="text-2xl font-bold">{stats.suspended}</h3>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Documents</p>
                  <h3 className="text-2xl font-bold">{stats.documents}</h3>
                </div>
                <FileText className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Wallets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="search"
                    placeholder="Search by name, email or ID..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wallets List */}
        <Card>
          <CardHeader>
            <CardTitle>Digital Wallets</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent"></div>
                <p className="mt-2 text-gray-500">Loading wallets...</p>
              </div>
            ) : filteredWallets.length > 0 ? (
              <AdminWalletList wallets={filteredWallets} />
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                <h3 className="text-lg font-medium">No wallets found</h3>
                <p className="text-gray-500 mt-2">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
