import { useEffect, useState } from "react";
import {
  Filter,
  Search,
  SortAsc,
  SortDesc,
  Bell,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Download,
  Send,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "../../lib/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../lib/ui/card";
import { Input } from "../../lib/ui/input";
import { Badge } from "../../lib/ui/badge";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../lib/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../lib/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../lib/ui/dropdown-menu";
import { Checkbox } from "../../lib/ui/checkbox";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showNotification } from "../common/headerSlice";

export function Reminder() {
  const [searchTerm, setSearchTerm] = useState("");
  const [documentType, setDocumentType] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedReminders, setSelectedReminders] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const dispatch = useDispatch();

  const [stats, setStats] = useState({
    total: 0,
    valid: 0,
    expires_soon: 0,
    expired: 0,
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/admin/documents/with-stats"
      );
      setDocuments(response.data.data.documents || []);
      setStats({
        total: response.data.data.stats.total || 0,
        valid: response.data.data.stats.valid || 0,
        expires_soon: response.data.data.stats.expires_soon || 0,
        expired: response.data.data.stats.expired || 0,
      });
    } catch (err) {
      setError(err.message);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminders = async () => {
    if (selectedReminders.length === 0) {
      dispatch(
        showNotification({
          title: "No documents selected",
          description: "Please select at least one document to send reminders",
          variant: "destructive",
        })
      );
      return;
    }

    try {
      setIsSending(true);
      const { data } = await axios.post(
        "http://localhost:5000/api/admin/send-reminders",
        {
          documentIds: selectedReminders,
        }
      );

      dispatch(
        showNotification({
          message: data.message || "Reminder sent successfully",
          status: 1,
        })
      );

      setSelectedReminders([]);
    } catch (err) {
      dispatch(
        showNotification({
          message: err.response?.data?.message || err.message,
          status: 0,
        })
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleSendSingleReminder = async (documentId) => {
    try {
      setIsSending(true);
      const { data } = await axios.post(
        "http://localhost:5000/api/admin/send-reminders",
        {
          documentIds: [documentId],
        }
      );

      dispatch(
        showNotification({
          message: data.message || "Reminder sent successfully",
          status: 1,
        })
      );
    } catch (err) {
      dispatch(
        showNotification({
          message: err.response?.data?.message || err.message,
          status: 0,
        })
      );
    } finally {
      setIsSending(false);
    }
  };

  const toggleSelectReminder = (documentId) => {
    setSelectedReminders((prev) =>
      prev.includes(documentId)
        ? prev.filter((id) => id !== documentId)
        : [...prev, documentId]
    );
  };

  const toggleSelectAllReminders = () => {
    if (selectedReminders.length === documents.length) {
      setSelectedReminders([]);
    } else {
      setSelectedReminders(documents.map((doc) => doc._id));
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading documents...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Documents
            </CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All registered documents
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valid</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.valid}</div>
            <p className="text-xs text-muted-foreground">Valid documents</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expire Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expires_soon}</div>
            <p className="text-xs text-muted-foreground">
              Expiring within 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expired}</div>
            <p className="text-xs text-muted-foreground">Expired documents</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <Select value={documentType} onValueChange={setDocumentType}>
          <SelectTrigger className="w-full md:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Document Type" />
          </SelectTrigger>
          <SelectItem value="all">All Documents</SelectItem>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="expired">Expired</SelectItem>
          <SelectItem value="critical">Critical</SelectItem>
          <SelectItem value="warning">Warning</SelectItem>
          <SelectItem value="normal">Valid</SelectItem>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              {sortOrder === "asc" ? (
                <SortAsc className="mr-2 h-4 w-4" />
              ) : (
                <SortDesc className="mr-2 h-4 w-4" />
              )}
              Sort by Date
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortOrder("asc")}>
              <SortAsc className="mr-2 h-4 w-4" />
              Earliest First
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOrder("desc")}>
              <SortDesc className="mr-2 h-4 w-4" />
              Latest First
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Bulk Actions */}
      {selectedReminders.length > 0 && (
        <div className="bg-muted p-2 rounded-md flex items-center justify-between">
          <div className="text-sm">
            {selectedReminders.length}{" "}
            {selectedReminders.length === 1 ? "item" : "items"} selected
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSendReminders}
              disabled={isSending}
            >
              <Send className="h-4 w-4 mr-2" />
              {isSending ? "Sending..." : "Send Reminders"}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      {documents.length === 0 ? (
        <div className="text-center py-10 bg-muted rounded-md">
          <p className="text-muted-foreground">No documents found.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={
                      selectedReminders.length > 0 &&
                      selectedReminders.length === documents.length
                    }
                    onCheckedChange={toggleSelectAllReminders}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="w-[180px]">Document Type</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>National ID</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Expiration Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc._id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedReminders.includes(doc._id)}
                      onCheckedChange={() => toggleSelectReminder(doc._id)}
                      aria-label={`Select ${doc.document_type}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {doc.document_type}
                  </TableCell>
                  <TableCell>
                    {doc.citizen_id
                      ? `${doc.citizen_id.first_name} ${doc.citizen_id.last_name}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>{doc.citizen_id?.national_id || "N/A"}</TableCell>
                  <TableCell>{doc.citizen_id?.email || "N/A"}</TableCell>
                  <TableCell>
                    {doc.expiry_date
                      ? format(new Date(doc.expiry_date), "PPP")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        doc.expiration_status === "expired"
                          ? "destructive"
                          : doc.expiration_status === "critical"
                          ? "destructive"
                          : doc.expiration_status === "warning"
                          ? "warning"
                          : "default"
                      }
                    >
                      {doc.expiration_status}
                    </Badge>
                    {doc.days_text && (
                      <div className="text-xs text-muted-foreground">
                        {doc.days_text}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {format(
                      new Date(doc.updatedAt || doc.createdAt || new Date()),
                      "PPP"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSendSingleReminder(doc._id)}
                      disabled={isSending}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default Reminder;
