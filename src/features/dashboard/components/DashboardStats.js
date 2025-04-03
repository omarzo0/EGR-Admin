import {
  Building,
  FileText,
  Users,
  Calendar,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../lib/ui/card";
import { BarChart, DoughnutChart } from "./dashboard-charts";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [departmentCount, setDepartmentCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const statusData = {
    labels: ["Approved", "Pending", "In Review", "Rejected"],
    label: "Documents",
    values: [320, 180, 120, 45],
  };
  useEffect(() => {
    const fetchDepartmentCount = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/department-count"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch department count");
        }
        const count = await response.json(); // Directly get the number
        setDepartmentCount(count); // Set the number directly
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentCount();
  }, []);
  const [serviceCount, setServiceCount] = useState(null);
  const [serviceLoading, setServiceLoading] = useState(true);
  const [serviceError, setServiceError] = useState(null);

  useEffect(() => {
    const fetchServiceCount = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/services-count"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch service count");
        }
        const count = await response.json();
        setServiceCount(count);
      } catch (err) {
        setServiceError(err.message);
      } finally {
        setServiceLoading(false);
      }
    };

    fetchServiceCount();
  }, []);
  const [citizenCount, setCitizenCount] = useState(null);
  const [citizenLoading, setCitizenLoading] = useState(true);
  const [citizenError, setCitizenError] = useState(null);
  useEffect(() => {
    const fetchCitizenCount = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/citizen-count"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch citizen count");
        }
        const count = await response.json();
        setCitizenCount(count);
      } catch (err) {
        setCitizenError(err.message);
      } finally {
        setCitizenLoading(false);
      }
    };

    fetchCitizenCount();
  }, []);
  const [documentCount, setDocumentCount] = useState(null);
  const [documentLoading, setDocumentLoading] = useState(true);
  const [documentError, setDocumentError] = useState(null);

  useEffect(() => {
    const fetchDocumentCount = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/document-count"
        );
        if (!response.ok) throw new Error("Failed to fetch document count");
        const count = await response.json();
        setDocumentCount(count);
      } catch (err) {
        setDocumentError(err.message);
      } finally {
        setDocumentLoading(false);
      }
    };
    fetchDocumentCount();
  }, []);
  const [documentStatusData, setDocumentStatusData] = useState({
    labels: [],
    values: [],
  });

  useEffect(() => {
    const fetchDocumentStatusCounts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/document-count-status"
        );
        if (!response.ok)
          throw new Error("Failed to fetch document status counts");
        const data = await response.json();
        setDocumentStatusData(data);
      } catch (err) {
        console.error("Error fetching document status counts:", err);
      }
    };
    fetchDocumentStatusCounts();
  }, []);
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard Overview</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Departments
            </CardTitle>
            <Building className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-gray-500">Loading...</div>
            ) : error ? (
              <div className="text-red-500 text-sm">{error}</div>
            ) : (
              <>
                <div className="text-2xl font-bold">{departmentCount}</div>
                <p className="text-xs text-gray-500">+2 from last month</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Services
            </CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {serviceLoading ? (
              <div className="text-gray-500">Loading...</div>
            ) : serviceError ? (
              <div className="text-red-500 text-sm">{serviceError}</div>
            ) : (
              <>
                <div className="text-2xl font-bold">{serviceCount}</div>
                <p className="text-xs text-gray-500">+5 from last month</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Citizens
            </CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {citizenLoading ? (
              <div className="text-gray-500">Loading...</div>
            ) : citizenError ? (
              <div className="text-red-500 text-sm">{citizenError}</div>
            ) : (
              <>
                <div className="text-2xl font-bold">{citizenCount}</div>
                <p className="text-xs text-gray-500">+10 from last month</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Document Applications
            </CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {documentLoading ? (
              <div className="text-gray-500">Loading...</div>
            ) : documentError ? (
              <div className="text-red-500 text-sm">{documentError}</div>
            ) : (
              <>
                <div className="text-2xl font-bold">{documentCount}</div>
                <p className="text-xs text-gray-500">+15 from last month</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Analytics Overview</h2>
        </div>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          <BarChart
            title="Applications by Department"
            description="Number of applications received by each department"
            data={departmentCount}
          />

          <DoughnutChart
            title="Document Status"
            description="Distribution of document application statuses"
            data={{
              labels: documentStatusData.labels,
              values: documentStatusData.values,
              label: "Documents",
            }}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    New service added: Tax Filing
                  </p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <Building className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Department updated: Civil Registry
                  </p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    New user registered: John Doe
                  </p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    New appointment: Passport Application
                  </p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Services</CardTitle>
            <CardDescription>Most booked services this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Passport Application</p>
                    <p className="text-xs text-gray-500">
                      Immigration & Passports
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-green-600">
                  <ArrowUp className="mr-1 h-4 w-4" />
                  <span>12%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-purple-100">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">National ID Card</p>
                    <p className="text-xs text-gray-500">National ID</p>
                  </div>
                </div>
                <div className="flex items-center text-green-600">
                  <ArrowUp className="mr-1 h-4 w-4" />
                  <span>8%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-orange-100">
                    <FileText className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">Driver's License</p>
                    <p className="text-xs text-gray-500">Driver & Vehicle</p>
                  </div>
                </div>
                <div className="flex items-center text-red-600">
                  <ArrowDown className="mr-1 h-4 w-4" />
                  <span>3%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-green-100">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Birth Certificate</p>
                    <p className="text-xs text-gray-500">Civil Registry</p>
                  </div>
                </div>
                <div className="flex items-center text-green-600">
                  <ArrowUp className="mr-1 h-4 w-4" />
                  <span>5%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
