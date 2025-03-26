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

export default function AdminDashboard() {
  // Sample data for charts
  const departmentData = {
    labels: [
      "Civil Registry",
      "Immigration",
      "National ID",
      "Driver & Vehicle",
      "Tax & Revenue",
      "Property & Land",
    ],
    label: "Applications",
    values: [124, 98, 156, 87, 65, 72],
  };

  const statusData = {
    labels: ["Approved", "Pending", "In Review", "Rejected"],
    label: "Documents",
    values: [320, 180, 120, 45],
  };

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
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-gray-500">+2 from last month</p>
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
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-gray-500">+5 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Registered Users
            </CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-gray-500">+123 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">567</div>
            <p className="text-xs text-gray-500">+89 from last month</p>
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
            data={departmentData}
          />

          <DoughnutChart
            title="Document Status Distribution"
            description="Current status of all documents in the system"
            data={statusData}
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
