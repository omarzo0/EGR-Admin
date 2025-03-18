import { useState } from "react";
import { Button } from "../../../lib/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../../lib/ui/card";
import { Input } from "../../../lib/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../lib/ui/select";

import { Send } from "lucide-react";

const mockNotifications = [
  {
    id: 1,
    title: "System Maintenance",
    recipients: "All Citizens",
    sentDate: "2025-03-15",
    status: "Delivered",
  },
  {
    id: 2,
    title: "New Service Available",
    recipients: "Registered Users",
    sentDate: "2025-03-10",
    status: "Delivered",
  },
  {
    id: 3,
    title: "Community Meeting",
    recipients: "Downtown District",
    sentDate: "2025-03-08",
    status: "Pending",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [newNotification, setNewNotification] = useState({
    title: "",

    recipients: "",
  });

  const handleInputChange = (field, value) => {
    setNewNotification({
      ...newNotification,
      [field]: value,
    });
  };

  const sendNotification = () => {
    if (newNotification.title && newNotification.recipients) {
      const notification = {
        id: notifications.length + 1,
        ...newNotification,
        sentDate: new Date().toISOString().split("T")[0],
        status: "Pending",
      };
      setNotifications([notification, ...notifications]);
      setNewNotification({
        title: "",

        recipients: "",
      });
    }
  };

  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>Send Notification</CardTitle>
          <CardDescription>
            Create and send notifications to citizens
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Notification Title
            </label>
            <Input
              id="title"
              placeholder="Enter notification title"
              value={newNotification.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="recipients" className="text-sm font-medium">
              Recipients
            </label>
            <Select
              onValueChange={(value) => {
                handleInputChange("recipients", value);
                if (value !== "Citizen Id") {
                  handleInputChange("citizenId", ""); // Reset Citizen ID when changing selection
                }
              }}
              value={newNotification.recipients}
            >
              <SelectTrigger id="recipients">
                <SelectValue placeholder="Select recipients" />
              </SelectTrigger>

              <SelectItem value="All Citizens">All Citizens</SelectItem>
              <SelectItem value="Registered Users">Registered Users</SelectItem>
              <SelectItem value="Downtown District">
                Downtown District
              </SelectItem>
              <SelectItem value="Suburban Area">Suburban Area</SelectItem>
              <SelectItem value="Business Owners">Business Owners</SelectItem>
              <SelectItem value="Citizen Id">Citizen Id</SelectItem>
            </Select>
          </div>

          {/* Show Citizen ID input field only when "Citizen Id" is selected */}
          {newNotification.recipients === "Citizen Id" && (
            <div className="space-y-2">
              <label htmlFor="citizenId" className="text-sm font-medium">
                Citizen Id
              </label>
              <Input
                id="citizenId"
                placeholder="Enter Citizen Id"
                value={newNotification.citizenId || ""}
                onChange={(e) => handleInputChange("citizenId", e.target.value)}
              />
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button className="w-full" onClick={sendNotification}>
            <Send className="mr-2 h-4 w-4" />
            Send Notification
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
