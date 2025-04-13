import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Clock, CheckCircle } from "lucide-react";

const GuestSessionStoryboard = () => {
  // Mock data for guest sessions
  const mockSessions = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      status: "active",
      created_at: "2023-06-15T10:30:00Z",
      last_active: "2023-06-15T11:45:00Z",
    },
    {
      id: "2",
      name: "Jane Smith",
      phone: "+1234567890",
      status: "inactive",
      created_at: "2023-06-14T09:20:00Z",
      last_active: "2023-06-14T10:15:00Z",
    },
    {
      id: "3",
      name: "Robert Johnson",
      email: "robert@example.com",
      status: "completed",
      created_at: "2023-06-13T14:10:00Z",
      last_active: "2023-06-13T15:30:00Z",
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive":
        return <Badge className="bg-amber-100 text-amber-800">Inactive</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      case "inactive":
        return <Clock className="h-4 w-4 text-amber-600" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6 bg-white p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Guest Sessions</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Guest Sessions</CardTitle>
          <CardDescription>
            View and manage all guest sessions in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md divide-y">
            {mockSessions.map((session) => (
              <div key={session.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">{getStatusIcon(session.status)}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{session.name}</h3>
                        {getStatusBadge(session.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {session.email || session.phone || "No contact info"}
                      </p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                        <span>
                          Created:{" "}
                          {new Date(session.created_at).toLocaleDateString()}
                        </span>
                        <span>
                          Last active:{" "}
                          {new Date(session.last_active).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm">View Session</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestSessionStoryboard;
