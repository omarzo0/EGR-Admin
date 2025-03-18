"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../lib/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../lib/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../lib/ui/tabs";
import { Badge } from "../../lib/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../lib/ui/avatar";
import { Input } from "../../lib/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../lib/ui/select";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");

  // Mock data for documents
  const pendingDocuments = [
    {
      id: "doc-1",
      title: "Property Tax Declaration",
      citizenName: "Jane Smith",
      citizenId: "CIT-87654321",
      dateSubmitted: "2023-11-02",
      status: "pending",
      department: "Revenue Department",
    },
    {
      id: "doc-2",
      title: "Business Permit Renewal",
      citizenName: "Robert Johnson",
      citizenId: "CIT-23456789",
      dateSubmitted: "2023-11-10",
      status: "processing",
      department: "Business Licensing",
    },
    {
      id: "doc-3",
      title: "Driver's License Renewal",
      citizenName: "Maria Garcia",
      citizenId: "CIT-34567890",
      dateSubmitted: "2023-11-15",
      status: "pending",
      department: "Transportation",
    },
  ];

  const processedDocuments = [
    {
      id: "doc-4",
      title: "Birth Certificate Application",
      citizenName: "John Doe",
      citizenId: "CIT-12345678",
      dateSubmitted: "2023-10-15",
      dateProcessed: "2023-10-20",
      status: "signed",
      department: "Civil Registry",
    },
    {
      id: "doc-5",
      title: "Marriage Certificate",
      citizenName: "Emily Wilson",
      citizenId: "CIT-45678901",
      dateSubmitted: "2023-10-25",
      dateProcessed: "2023-11-01",
      status: "signed",
      department: "Civil Registry",
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "signed":
        return <Badge className="bg-green-500">Signed</Badge>;
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600">
            Pending
          </Badge>
        );
      case "processing":
        return <Badge className="bg-blue-500">Processing</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredPendingDocs = pendingDocuments.filter(
    (doc) =>
      (filterDepartment === "all" || doc.department === filterDepartment) &&
      (doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.citizenId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredProcessedDocs = processedDocuments.filter(
    (doc) =>
      (filterDepartment === "all" || doc.department === filterDepartment) &&
      (doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.citizenId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            E-signature Board
          </h2>
          <p className="text-gray-600">
            Manage and process citizen document requests
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Pending Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{pendingDocuments.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Processed Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">5</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Processed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{processedDocuments.length}</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Input
              placeholder="Search by document title, citizen name, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Select
              value={filterDepartment}
              onValueChange={setFilterDepartment}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>

              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Civil Registry">Civil Registry</SelectItem>
              <SelectItem value="Revenue Department">
                Revenue Department
              </SelectItem>
              <SelectItem value="Business Licensing">
                Business Licensing
              </SelectItem>
              <SelectItem value="Transportation">Transportation</SelectItem>
            </Select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="pending">Pending Documents</TabsTrigger>
            <TabsTrigger value="processed">Processed Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="grid gap-4">
              {filteredPendingDocs.length > 0 ? (
                filteredPendingDocs.map((doc) => (
                  <Card key={doc.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{doc.title}</h3>
                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2">
                            <span className="text-sm text-gray-500">
                              Citizen: {doc.citizenName} ({doc.citizenId})
                            </span>
                            <span className="text-sm text-gray-500">
                              Submitted: {doc.dateSubmitted}
                            </span>
                            <span className="text-sm text-gray-500">
                              Department: {doc.department}
                            </span>
                            {getStatusBadge(doc.status)}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/admin/document/${doc.id}`}>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                          <Link to={`/app/process`}>
                            <Button size="sm">Process Document</Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <p className="text-gray-500">
                    No pending documents found matching your criteria.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="processed">
            <div className="grid gap-4">
              {filteredProcessedDocs.length > 0 ? (
                filteredProcessedDocs.map((doc) => (
                  <Card key={doc.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{doc.title}</h3>
                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2">
                            <span className="text-sm text-gray-500">
                              Citizen: {doc.citizenName} ({doc.citizenId})
                            </span>
                            <span className="text-sm text-gray-500">
                              Submitted: {doc.dateSubmitted}
                            </span>
                            <span className="text-sm text-gray-500">
                              Processed: {doc.dateProcessed}
                            </span>
                            <span className="text-sm text-gray-500">
                              Department: {doc.department}
                            </span>
                            {getStatusBadge(doc.status)}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <p className="text-gray-500">
                    No processed documents found matching your criteria.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
