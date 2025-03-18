"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
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

// Mock data for feedback
const mockFeedback = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    message: "The garbage collection has been very reliable lately. Thank you!",
    rating: 5,
    date: "2025-03-15",
    status: "new",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    message: "There's a pothole on Main Street that needs attention.",
    rating: 2,
    date: "2025-03-14",
    status: "reviewed",
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "m.chen@example.com",
    message: "The new bus schedule is much more convenient.",
    rating: 4,
    date: "2025-03-13",
    status: "new",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.d@example.com",
    message: "The community park needs more benches and shade areas.",
    rating: 3,
    date: "2025-03-12",
    status: "reviewed",
  },
  {
    id: 5,
    name: "Robert Wilson",
    email: "r.wilson@example.com",
    message: "We experienced low water pressure last weekend.",
    rating: 2,
    date: "2025-03-11",
    status: "new",
  },
];

export default function FeedbackPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [feedback, setFeedback] = useState(mockFeedback);

  const filteredFeedback = feedback.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const markAsReviewed = (id) => {
    setFeedback(
      feedback.map((item) =>
        item.id === id ? { ...item, status: "reviewed" } : item
      )
    );
  };

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
                    placeholder="Search by name, service or content..."
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
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.name}
                        <div className="text-xs text-muted-foreground">
                          {item.email}
                        </div>
                      </TableCell>

                      <TableCell className="hidden max-w-[300px] truncate md:table-cell">
                        {item.message}
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
                            item.status === "new" ? "default" : "secondary"
                          }
                        >
                          {item.status === "new" ? "New" : "Reviewed"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.status === "new" ? (
                          <Button
                            size="sm"
                            onClick={() => markAsReviewed(item.id)}
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
