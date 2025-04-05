"use client";

import { useState, useEffect } from "react";
import { Button } from "../../../lib/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../lib/ui/card";
import { Input } from "../../../lib/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../lib/ui/table";
import { Badge } from "../../../lib/ui/badge";
import { ChevronLeft, Search } from "lucide-react";
import axios from "axios";
import { showNotification } from "../../common/headerSlice";
import { useDispatch } from "react-redux";

export default function FeedbackPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // Fetch feedback from backend
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get("/api/admin/feedback");
        setFeedback(response.data.data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        dispatch(
          showNotification({ message: "Failed to load Feedback", status: 0 })
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const filteredFeedback = feedback.filter(
    (item) =>
      item.citizen?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.feedback_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const markAsReviewed = async (feedbackId) => {
    try {
      const response = await axios.put(`/api/admin/${feedbackId}/status`, {
        status: "Reviewed",
      });

      setFeedback(
        feedback.map((item) =>
          item._id === feedbackId ? response.data.data : item
        )
      );
      dispatch(
        showNotification({ message: "feedback marked as reviewed", status: 0 })
      );
    } catch (error) {
      console.error("Error updating feedback:", error);
      dispatch(
        showNotification({
          message: "Failed to update feedback status",
          status: 0,
        })
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex-1">
          <div className="container py-6">
            <p>Loading feedback...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1">
        <div className="container py-6">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Management</CardTitle>
              <CardDescription>
                View and manage feedback submitted by citizens
              </CardDescription>
              <div className="flex items-center gap-2 pt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by name or feedback content..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Citizen</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Feedback
                    </TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeedback.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell className="font-medium">
                        {item.citizen?.name || "Unknown"}
                        <div className="text-xs text-muted-foreground">
                          {item.citizen?.email || "No email"}
                        </div>
                      </TableCell>
                      <TableCell className="hidden max-w-[300px] truncate md:table-cell">
                        {item.feedback_text}
                      </TableCell>
                      <TableCell>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < item.rating
                                  ? "text-yellow-500"
                                  : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === "New" ? "default" : "secondary"
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.status === "New" ? (
                          <Button
                            size="sm"
                            onClick={() => markAsReviewed(item._id)}
                          >
                            Mark as Reviewed
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
