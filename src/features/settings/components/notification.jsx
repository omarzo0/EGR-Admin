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
import { Send } from "lucide-react";

import axios from "axios";
import { useDispatch } from "react-redux";
import { showNotification } from "../../common/headerSlice";

// Custom Select Component
const CustomSelect = ({ value, onChange, options, placeholder, id, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          id={id}
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          {value
            ? options.find((opt) => opt.value === value)?.label
            : placeholder}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-4 w-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95">
            <div className="p-1">
              {options.map((option) => (
                <div
                  key={option.value}
                  className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${
                    value === option.value
                      ? "bg-accent text-accent-foreground"
                      : ""
                  }`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function NotificationsPage() {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    recipientType: "citizen",
    recipients: "single",
    recipientId: "",
    adminRole: "",
  });

  const recipientTypeOptions = [
    { value: "citizen", label: "Citizen" },
    { value: "admin", label: "Admin" },
  ];

  const recipientsOptions = [
    {
      value: "single",
      label: `Specific ${
        newNotification.recipientType === "citizen" ? "Citizen" : "Admin"
      }`,
    },
    {
      value: "all",
      label: `All ${
        newNotification.recipientType === "citizen" ? "Citizens" : "Admins"
      }`,
    },
    ...(newNotification.recipientType === "admin"
      ? [{ value: "role", label: "Admins by Role" }]
      : []),
  ];

  const adminRoleOptions = [
    { value: "super admin", label: "Super Admin" },
    { value: "admin", label: "Admin" },
    { value: "officer", label: "Officer" },
  ];

  const handleInputChange = (field, value) => {
    setNewNotification((prev) => ({
      ...prev,
      [field]: value,
      // Reset dependent fields when changing recipient type or scope
      ...(field === "recipientType"
        ? {
            recipients: "single",
            recipientId: "",
            adminRole: "",
          }
        : {}),
      ...(field === "recipients"
        ? {
            recipientId: "",
            adminRole: "",
          }
        : {}),
    }));
  };

  const sendNotification = async () => {
    if (!newNotification.title || !newNotification.message) {
      dispatch(
        showNotification({
          message: "Title and message are required",
          status: 0,
        })
      );
      return;
    }

    if (newNotification.recipients === "role" && !newNotification.adminRole) {
      dispatch(
        showNotification({
          message: "Admin role is required when sending by role",
          status: 0,
        })
      );
      return;
    }

    setIsLoading(true);

    try {
      const baseData = {
        title: newNotification.title,
        message: newNotification.message,
      };

      let endpoint;
      let payload = baseData;

      if (newNotification.recipientType === "citizen") {
        if (newNotification.recipients === "single") {
          endpoint = `/api/admin/notifications/citizen/${newNotification.recipientId}`;
        } else {
          endpoint = "/api/admin/citizen-notifications";
        }
      } else {
        // admin
        if (newNotification.recipients === "single") {
          endpoint = `/api/admin/send/${newNotification.recipientId}`;
        } else if (newNotification.recipients === "all") {
          endpoint = "/api/admin/notifications/admins/all";
        } else {
          // role
          endpoint = "/api/admin/notifications/admins";
          payload = {
            ...baseData,
            role: newNotification.adminRole,
          };
        }
      }

      const response = await axios.post(endpoint, payload);

      dispatch(
        showNotification({
          message: response.data.message || "Notification sent successfully",
          status: 1,
        })
      );

      // Reset form
      setNewNotification({
        title: "",
        message: "",
        recipientType: "citizen",
        recipients: "single",
        recipientId: "",
        adminRole: "",
      });
    } catch (error) {
      dispatch(
        showNotification({
          message: error.response?.data?.message || error.message,
          status: 0,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>Send Notification</CardTitle>
          <CardDescription>
            Create and send notifications to citizens or admins
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Notification Title*
            </label>
            <Input
              id="title"
              placeholder="Enter notification title"
              value={newNotification.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message*
            </label>
            <Input
              id="message"
              placeholder="Enter notification message"
              value={newNotification.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
            />
          </div>

          <CustomSelect
            id="recipientType"
            value={newNotification.recipientType}
            onChange={(value) => handleInputChange("recipientType", value)}
            options={recipientTypeOptions}
            placeholder="Select recipient type"
            label="Recipient Type*"
          />

          <CustomSelect
            id="recipients"
            value={newNotification.recipients}
            onChange={(value) => handleInputChange("recipients", value)}
            options={recipientsOptions}
            placeholder="Select recipients"
            label="Send To*"
          />

          {newNotification.recipients === "single" && (
            <div className="space-y-2">
              <label htmlFor="recipientId" className="text-sm font-medium">
                {newNotification.recipientType === "citizen"
                  ? "Citizen"
                  : "Admin"}{" "}
                ID*
              </label>
              <Input
                id="recipientId"
                placeholder={`Enter ${
                  newNotification.recipientType === "citizen"
                    ? "Citizen"
                    : "Admin"
                } ID`}
                value={newNotification.recipientId}
                onChange={(e) =>
                  handleInputChange("recipientId", e.target.value)
                }
              />
            </div>
          )}

          {newNotification.recipientType === "admin" &&
            newNotification.recipients === "role" && (
              <div className="space-y-2">
                <CustomSelect
                  id="adminRole"
                  value={newNotification.adminRole}
                  onChange={(value) => handleInputChange("adminRole", value)}
                  options={adminRoleOptions}
                  placeholder="Select admin role"
                  label="Admin Role*"
                />
              </div>
            )}
        </CardContent>

        <CardFooter>
          <Button
            className="w-full"
            onClick={sendNotification}
            disabled={isLoading}
          >
            {isLoading ? (
              "Sending..."
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Notification
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
