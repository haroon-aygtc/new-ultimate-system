import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Users,
  MessageSquare,
  Bot,
  FileText,
  Activity,
} from "lucide-react";
import { getUsers } from "@/services/userService";
import { getActiveGuestSessions } from "@/services/guestSessionService";
import { getActiveAIModels } from "@/services/aiModelService";
import { getAuditLogs } from "@/services/auditLogService";
import { User, GuestSession, AIModel, AuditLog } from "@/types";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [activeSessions, setActiveSessions] = useState<GuestSession[]>([]);
  const [activeModels, setActiveModels] = useState<AIModel[]>([]);
  const [recentLogs, setRecentLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Load users
        const { data: usersData } = await getUsers();
        if (usersData) setUsers(usersData);

        // Load active guest sessions
        const { data: sessionsData } = await getActiveGuestSessions();
        if (sessionsData) setActiveSessions(sessionsData);

        // Load active AI models
        const { data: modelsData } = await getActiveAIModels();
        if (modelsData) setActiveModels(modelsData);

        // Load recent audit logs
        const { data: logsData } = await getAuditLogs(10);
        if (logsData) setRecentLogs(logsData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">
            Loading dashboard...
          </span>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Users
                    </p>
                    <h3 className="text-3xl font-bold">{users.length}</h3>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Active Sessions
                    </p>
                    <h3 className="text-3xl font-bold">
                      {activeSessions.length}
                    </h3>
                  </div>
                  <div className="p-2 bg-green-100 rounded-full">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Active AI Models
                    </p>
                    <h3 className="text-3xl font-bold">
                      {activeModels.length}
                    </h3>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Bot className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Recent Activities
                    </p>
                    <h3 className="text-3xl font-bold">{recentLogs.length}</h3>
                  </div>
                  <div className="p-2 bg-amber-100 rounded-full">
                    <Activity className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="sessions">
            <TabsList className="mb-4">
              <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="sessions">
              <Card>
                <CardHeader>
                  <CardTitle>Active Guest Sessions</CardTitle>
                  <CardDescription>
                    Currently active guest sessions in the system.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {activeSessions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      No active sessions found.
                    </p>
                  ) : (
                    <div className="border rounded-md divide-y">
                      {activeSessions.map((session) => (
                        <div
                          key={session.id}
                          className="p-4 flex justify-between items-center"
                        >
                          <div>
                            <h4 className="font-medium">{session.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {session.email ||
                                session.phone ||
                                "No contact info"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Last active:{" "}
                              {new Date(session.last_active).toLocaleString()}
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            View Chat
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>System Users</CardTitle>
                  <CardDescription>
                    All registered users in the system.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {users.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      No users found.
                    </p>
                  ) : (
                    <div className="border rounded-md divide-y">
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className="p-4 flex justify-between items-center"
                        >
                          <div>
                            <h4 className="font-medium">
                              {user.full_name || user.email}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                            <div className="flex items-center mt-1">
                              <span
                                className={`inline-block w-2 h-2 rounded-full mr-2 ${user.status === "active" ? "bg-green-500" : user.status === "pending" ? "bg-amber-500" : "bg-red-500"}`}
                              ></span>
                              <span className="text-xs capitalize">
                                {user.status}
                              </span>
                              <span className="text-xs text-muted-foreground ml-3">
                                {user.role}
                              </span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Manage
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Recent system activities and audit logs.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentLogs.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      No recent activity found.
                    </p>
                  ) : (
                    <div className="border rounded-md divide-y">
                      {recentLogs.map((log) => (
                        <div key={log.id} className="p-3">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-muted-foreground mr-2" />
                            <span className="font-medium">{log.action}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Entity: {log.entity_type}
                            {log.entity_id ? ` (${log.entity_id})` : ""}
                          </p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-muted-foreground">
                              {new Date(log.created_at).toLocaleString()}
                            </span>
                            {log.user_id && (
                              <span className="text-xs">
                                By:{" "}
                                {users.find((u) => u.id === log.user_id)
                                  ?.full_name || log.user_id}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Dashboard;
