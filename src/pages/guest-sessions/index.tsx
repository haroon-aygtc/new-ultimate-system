import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Search,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { getGuestSessions } from "@/services/guestSessionService";
import { GuestSession } from "@/types";

const GuestSessions = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState<GuestSession[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const loadSessions = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await getGuestSessions();
        if (error) throw error;
        if (data) setSessions(data);
      } catch (error) {
        console.error("Error loading guest sessions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, []);

  const filteredSessions = sessions.filter((session) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      session.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (session.email &&
        session.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (session.phone && session.phone.includes(searchQuery));

    // Filter by tab
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && session.status === "active") ||
      (activeTab === "inactive" && session.status === "inactive") ||
      (activeTab === "completed" && session.status === "completed");

    return matchesSearch && matchesTab;
  });

  const getStatusBadge = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      case "inactive":
        return <Clock className="h-4 w-4 text-amber-600" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const handleViewSession = (id: string) => {
    navigate(`/guest-sessions/${id}`);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Guest Sessions</h1>
        <Button onClick={() => window.location.reload()}>Refresh</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Guest Sessions</CardTitle>
          <CardDescription>
            View and manage all guest sessions in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, email or phone..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Sessions</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">
                    Loading sessions...
                  </span>
                </div>
              ) : filteredSessions.length === 0 ? (
                <div className="text-center py-12 border rounded-md bg-muted/10">
                  <p className="text-muted-foreground">No sessions found.</p>
                </div>
              ) : (
                <div className="border rounded-md divide-y">
                  {filteredSessions.map((session) => (
                    <div key={session.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-3">
                          <div className="mt-1">
                            {getStatusIcon(session.status)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium">{session.name}</h3>
                              {getStatusBadge(session.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {session.email ||
                                session.phone ||
                                "No contact info"}
                            </p>
                            <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                              <span>
                                Created:{" "}
                                {new Date(
                                  session.created_at,
                                ).toLocaleDateString()}
                              </span>
                              <span>
                                Last active:{" "}
                                {new Date(session.last_active).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleViewSession(session.id)}
                        >
                          View Session
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestSessions;
