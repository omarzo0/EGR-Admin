import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button } from "../../lib/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../lib/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../lib/ui/tabs";
import { Badge } from "../../lib/ui/badge";
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
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [counts, setCounts] = useState({
    pending: 0,
    processed: 0,
    total: 0,
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch documents
        const docsResponse = await axios.get(
          "http://localhost:5000/api/admin/signature-list"
        );
        setDocuments(docsResponse.data.data);

        // Fetch counts
        const countsResponse = await axios.get(
          "http://localhost:5000/api/admin/signature-count"
        );
        setCounts({
          pendingDocuments: countsResponse.data.data.pendingDocuments || 0,
          processedToday: countsResponse.data.data.processedToday || 0,
          totalProcessed: countsResponse.data.data.totalProcessed || 0,
        });

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Signed":
        return <Badge className="bg-green-500">Signed</Badge>;
      case "Pending":
        return (
          <Badge variant="outline" className="text-yellow-600">
            Pending
          </Badge>
        );
      case "Processing":
        return <Badge className="bg-blue-500">Processing</Badge>;
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Filter documents based on status and search criteria
  const filteredDocuments = documents.filter((doc) => {
    // Filter by tab

    // Filter by department
    const departmentMatch =
      filterDepartment === "all" ||
      (doc.department_id?.name && doc.department_id.name === filterDepartment);

    // Filter by search query
    const searchMatch =
      doc.service_id?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.citizen_id?.email &&
        doc.citizen_id.email
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      doc._id.toLowerCase().includes(searchQuery.toLowerCase());

    return departmentMatch && searchMatch;
  });

  // Get unique departments for filter dropdown
  const departments = [
    "all",
    ...new Set(
      documents
        .map((doc) => doc.department_id?.name)
        .filter((name) => name !== undefined)
    ),
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p>Loading documents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

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
              <p className="text-2xl font-bold">{counts?.pendingDocuments}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Processed Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{counts.processedToday}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{counts.totalProcessed}</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Input
              placeholder="Search by service, citizen email, or document ID..."
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
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept === "all" ? "All Departments" : dept}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent>
            <div className="grid gap-4">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <Card key={doc._id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {doc.service_id?.name || "Untitled Document"}
                          </h3>
                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2">
                            <span className="text-sm text-gray-500">
                              Citizen: {doc.citizen_id?.email || "N/A"}
                            </span>
                            <span className="text-sm text-gray-500">
                              Submitted: {formatDate(doc.uploaded_date)}
                            </span>
                            <span className="text-sm text-gray-500">
                              Department: {doc.department_id?.name || "N/A"}
                            </span>
                            {getStatusBadge(doc.status)}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/admin/document/${doc._id}`}>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                          <Link to={`/app/process/${doc._id}`}>
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
                    No {activeTab === "pending" ? "pending" : "processed"}{" "}
                    documents found matching your criteria.
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
