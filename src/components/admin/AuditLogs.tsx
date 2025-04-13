import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { format } from "date-fns";
import {
  Search,
  Filter,
  Download,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";

const AuditLogs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [logType, setLogType] = useState("all");
  const [dateRange, setDateRange] = useState("7days");

  // Mock data for demonstration
  const mockLogs = [
    {
      id: "log-001",
      timestamp: new Date(2023, 8, 15, 10, 30),
      type: "info",
      message: "User john.doe@example.com logged in",
      source: "auth",
      ip: "192.168.1.1",
    },
    {
      id: "log-002",
      timestamp: new Date(2023, 8, 15, 11, 45),
      type: "warning",
      message: "Failed login attempt for user jane.smith@example.com",
      source: "auth",
      ip: "192.168.1.2",
    },
    {
      id: "log-003",
      timestamp: new Date(2023, 8, 15, 12, 15),
      type: "error",
      message: "API rate limit exceeded",
      source: "api",
      ip: "192.168.1.3",
    },
    {
      id: "log-004",
      timestamp: new Date(2023, 8, 15, 13, 20),
      type: "info",
      message: "New guest session started",
      source: "session",
      ip: "192.168.1.4",
    },
    {
      id: "log-005",
      timestamp: new Date(2023, 8, 15, 14, 10),
      type: "success",
      message: "Configuration updated successfully",
      source: "system",
      ip: "192.168.1.5",
    },
    {
      id: "log-006",
      timestamp: new Date(2023, 8, 15, 15, 30),
      type: "info",
      message: "User robert.johnson@example.com logged out",
      source: "auth",
      ip: "192.168.1.6",
    },
    {
      id: "log-007",
      timestamp: new Date(2023, 8, 15, 16, 45),
      type: "warning",
      message: "High CPU usage detected",
      source: "system",
      ip: "192.168.1.7",
    },
    {
      id: "log-008",
      timestamp: new Date(2023, 8, 15, 17, 20),
      type: "error",
      message: "Database connection failed",
      source: "database",
      ip: "192.168.1.8",
    },
    {
      id: "log-009",
      timestamp: new Date(2023, 8, 15, 18, 10),
      type: "success",
      message: "Backup completed successfully",
      source: "system",
      ip: "192.168.1.9",
    },
    {
      id: "log-010",
      timestamp: new Date(2023, 8, 15, 19, 30),
      type: "info",
      message: "Scheduled maintenance started",
      source: "system",
      ip: "192.168.1.10",
    },
  ];

  // Filter logs based on search query, log type, and date range
  const filteredLogs = mockLogs
    .filter((log) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        log.message.toLowerCase().includes(searchLower) ||
        log.source.toLowerCase().includes(searchLower) ||
        log.ip.toLowerCase().includes(searchLower) ||
        false;

      // Log type filter
      let matchesType = true;
      if (logType !== "all") {
        matchesType = log.type === logType;
      }

      // Date range filter
      const now = new Date();
      const logDate = new Date(log.timestamp);
      let matchesDate = true;

      if (dateRange === "24hours") {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        matchesDate = logDate >= yesterday;
      } else if (dateRange === "7days") {
        const lastWeek = new Date(now);
        lastWeek.setDate(lastWeek.getDate() - 7);
        matchesDate = logDate >= lastWeek;
      } else if (dateRange === "30days") {
        const lastMonth = new Date(now);
        lastMonth.setDate(lastMonth.getDate() - 30);
        matchesDate = logDate >= lastMonth;
      }

      return matchesSearch && matchesType && matchesDate;
    })
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  // Pagination
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Helper function to render log type badge
  const renderLogTypeBadge = (type) => {
    switch (type) {
      case "info":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            <Info className="h-3 w-3 mr-1" />
            Info
          </Badge>
        );
      case "warning":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            <AlertCircle className="h-3 w-3 mr-1" />
            Warning
          </Badge>
        );
      case "error":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            <AlertCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        );
      case "success":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Success
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200"
          >
            {type}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white border-brand-primary/10">
        <CardHeader>
          <CardTitle className="text-brand-secondary">Audit Logs</CardTitle>
          <CardDescription className="text-brand-muted">
            Comprehensive logs of all system activities and events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={logType} onValueChange={setLogType}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Log type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24hours">Last 24 Hours</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>More Filters</span>
              </Button>

              <Button variant="outline" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="w-[40%]">Message</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.length > 0 ? (
                  paginatedLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">
                        {format(log.timestamp, "yyyy-MM-dd HH:mm:ss")}
                      </TableCell>
                      <TableCell>{renderLogTypeBadge(log.type)}</TableCell>
                      <TableCell className="max-w-md truncate">
                        {log.message}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-brand-light/50">
                          {log.source}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {log.ip}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No logs found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {filteredLogs.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of{" "}
                {filteredLogs.length} logs
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogs;
