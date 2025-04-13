import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search, FileText, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getAuditLogs, getUsers } from "@/services";
import { AuditLog, User } from "@/types";

const AuditLogs = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [filterEntity, setFilterEntity] = useState("all");
  const [filterUser, setFilterUser] = useState("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const logsPerPage = 50;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load audit logs
        const { data: logsData, error: logsError } = await getAuditLogs(
          logsPerPage,
          0,
        );
        if (logsError) throw logsError;
        if (logsData) {
          setLogs(logsData);
          setHasMore(logsData.length === logsPerPage);
        }

        // Load users for filtering
        const { data: usersData, error: usersError } = await getUsers();
        if (usersError) throw usersError;
        if (usersData) setUsers(usersData);
      } catch (error) {
        console.error("Error loading audit logs:", error);
        toast({
          title: "Error",
          description: "Could not load audit logs. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const loadMoreLogs = async () => {
    const nextPage = page + 1;
    const offset = (nextPage - 1) * logsPerPage;

    try {
      const { data, error } = await getAuditLogs(logsPerPage, offset);
      if (error) throw error;
      if (data) {
        if (data.length === 0) {
          setHasMore(false);
          return;
        }
        setLogs([...logs, ...data]);
        setPage(nextPage);
        setHasMore(data.length === logsPerPage);
      }
    } catch (error) {
      console.error("Error loading more logs:", error);
      toast({
        title: "Error",
        description: "Could not load more audit logs. Please try again.",
        variant: "destructive",
      });
    }
  };

  const refreshLogs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getAuditLogs(logsPerPage, 0);
      if (error) throw error;
      if (data) {
        setLogs(data);
        setPage(1);
        setHasMore(data.length === logsPerPage);
      }
    } catch (error) {
      console.error("Error refreshing logs:", error);
      toast({
        title: "Error",
        description: "Could not refresh audit logs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Extract unique actions and entity types for filters
  const uniqueActions = Array.from(new Set(logs.map((log) => log.action)));
  const uniqueEntities = Array.from(
    new Set(logs.map((log) => log.entity_type)),
  );

  // Apply filters
  const filteredLogs = logs.filter((log) => {
    // Search query filter
    const matchesSearch =
      searchQuery === "" ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.entity_id &&
        log.entity_id.toLowerCase().includes(searchQuery.toLowerCase()));

    // Action filter
    const matchesAction = filterAction === "all" || log.action === filterAction;

    // Entity filter
    const matchesEntity =
      filterEntity === "all" || log.entity_type === filterEntity;

    // User filter
    const matchesUser = filterUser === "all" || log.user_id === filterUser;

    return matchesSearch && matchesAction && matchesEntity && matchesUser;
  });

  const getUserName = (userId: string | undefined) => {
    if (!userId) return "System";
    const user = users.find((u) => u.id === userId);
    return user ? user.full_name || user.email : userId;
  };

  const formatActionName = (action: string) => {
    return action
      .split(".")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" - ");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <Button onClick={refreshLogs} disabled={isLoading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Activity Logs</CardTitle>
          <CardDescription>
            View and filter system activity and audit logs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search logs..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {uniqueActions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {formatActionName(action)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterEntity} onValueChange={setFilterEntity}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  {uniqueEntities.map((entity) => (
                    <SelectItem key={entity} value={entity}>
                      {entity.charAt(0).toUpperCase() + entity.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterUser} onValueChange={setFilterUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="undefined">System</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name || user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">
                Loading audit logs...
              </span>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-12 border rounded-md bg-muted/10">
              <p className="text-muted-foreground">
                No audit logs found matching your filters.
              </p>
            </div>
          ) : (
            <div className="border rounded-md">
              <div className="bg-muted/20 p-3 grid grid-cols-12 gap-2 font-medium text-sm">
                <div className="col-span-3">Timestamp</div>
                <div className="col-span-2">User</div>
                <div className="col-span-3">Action</div>
                <div className="col-span-4">Entity</div>
              </div>
              <div className="divide-y">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 grid grid-cols-12 gap-2 text-sm hover:bg-muted/5"
                  >
                    <div className="col-span-3 text-muted-foreground">
                      {new Date(log.created_at).toLocaleString()}
                    </div>
                    <div className="col-span-2">{getUserName(log.user_id)}</div>
                    <div className="col-span-3 flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-primary" />
                      {formatActionName(log.action)}
                    </div>
                    <div className="col-span-4">
                      <span className="font-medium">
                        {log.entity_type.charAt(0).toUpperCase() +
                          log.entity_type.slice(1)}
                      </span>
                      {log.entity_id && (
                        <span className="text-muted-foreground">
                          {" "}
                          ({log.entity_id})
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasMore && !isLoading && (
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={loadMoreLogs}>
                Load More
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogs;
