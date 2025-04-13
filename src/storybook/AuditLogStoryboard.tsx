import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FileText } from "lucide-react";

const AuditLogStoryboard = () => {
  // Mock data for audit logs
  const mockLogs = [
    {
      id: "1",
      action: "user.create",
      entity_type: "user",
      entity_id: "usr_123456",
      user_id: "admin_1",
      user_name: "Admin User",
      created_at: "2023-06-15T10:30:00Z",
    },
    {
      id: "2",
      action: "guest_session.status_change",
      entity_type: "guest_session",
      entity_id: "sess_789012",
      user_id: "usr_345678",
      user_name: "John Smith",
      created_at: "2023-06-15T09:45:00Z",
    },
    {
      id: "3",
      action: "ai_model.update",
      entity_type: "ai_model",
      entity_id: "model_567890",
      user_id: "admin_1",
      user_name: "Admin User",
      created_at: "2023-06-14T16:20:00Z",
    },
    {
      id: "4",
      action: "system.startup",
      entity_type: "system",
      entity_id: null,
      user_id: null,
      user_name: "System",
      created_at: "2023-06-14T08:00:00Z",
    },
  ];

  const formatActionName = (action) => {
    return action
      .split(".")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" - ");
  };

  return (
    <div className="container mx-auto py-6 space-y-6 bg-white p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Audit Logs</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Activity Logs</CardTitle>
          <CardDescription>
            View and filter system activity and audit logs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <div className="bg-muted/20 p-3 grid grid-cols-12 gap-2 font-medium text-sm">
              <div className="col-span-3">Timestamp</div>
              <div className="col-span-2">User</div>
              <div className="col-span-3">Action</div>
              <div className="col-span-4">Entity</div>
            </div>
            <div className="divide-y">
              {mockLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 grid grid-cols-12 gap-2 text-sm hover:bg-muted/5"
                >
                  <div className="col-span-3 text-muted-foreground">
                    {new Date(log.created_at).toLocaleString()}
                  </div>
                  <div className="col-span-2">{log.user_name}</div>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogStoryboard;
