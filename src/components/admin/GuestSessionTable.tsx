import React, { useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Eye,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface GuestSession {
  id: string;
  guestName: string;
  phone: string;
  email?: string;
  startTime: Date;
  duration: number; // in minutes
  status: "Active" | "Inactive";
  messages: number;
}

const GuestSessionTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("startTime");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewSessionDialog, setViewSessionDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<GuestSession | null>(
    null,
  );
  const [endSessionDialog, setEndSessionDialog] = useState(false);

  // Mock data for demonstration
  const mockSessions: GuestSession[] = [
    {
      id: "1",
      guestName: "John Doe",
      phone: "+1 (555) 123-4567",
      email: "john.doe@example.com",
      startTime: new Date(2023, 8, 15, 10, 30),
      duration: 45,
      status: "Active",
      messages: 12,
    },
    {
      id: "2",
      guestName: "Jane Smith",
      phone: "+1 (555) 987-6543",
      startTime: new Date(2023, 8, 14, 14, 15),
      duration: 20,
      status: "Inactive",
      messages: 5,
    },
    {
      id: "3",
      guestName: "Robert Johnson",
      phone: "+1 (555) 456-7890",
      email: "robert.j@example.com",
      startTime: new Date(2023, 8, 15, 9, 0),
      duration: 60,
      status: "Active",
      messages: 18,
    },
    {
      id: "4",
      guestName: "Emily Davis",
      phone: "+1 (555) 234-5678",
      startTime: new Date(2023, 8, 13, 11, 45),
      duration: 15,
      status: "Inactive",
      messages: 3,
    },
    {
      id: "5",
      guestName: "Michael Wilson",
      phone: "+1 (555) 876-5432",
      email: "michael.w@example.com",
      startTime: new Date(2023, 8, 15, 16, 20),
      duration: 30,
      status: "Active",
      messages: 8,
    },
  ];

  // Filter and sort sessions
  const filteredSessions = mockSessions
    .filter((session) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        session.guestName.toLowerCase().includes(searchLower) ||
        session.phone.toLowerCase().includes(searchLower) ||
        session.email?.toLowerCase().includes(searchLower) ||
        false;

      // Date filter
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);

      let matchesDate = true;
      if (dateFilter === "today") {
        matchesDate = session.startTime >= today;
      } else if (dateFilter === "yesterday") {
        matchesDate =
          session.startTime >= yesterday && session.startTime < today;
      } else if (dateFilter === "lastWeek") {
        matchesDate = session.startTime >= lastWeek;
      }

      // Status filter
      let matchesStatus = true;
      if (statusFilter !== "all") {
        matchesStatus = session.status === statusFilter;
      }

      return matchesSearch && matchesDate && matchesStatus;
    })
    .sort((a, b) => {
      if (sortField === "startTime") {
        return sortDirection === "asc"
          ? a.startTime.getTime() - b.startTime.getTime()
          : b.startTime.getTime() - a.startTime.getTime();
      } else if (sortField === "duration") {
        return sortDirection === "asc"
          ? a.duration - b.duration
          : b.duration - a.duration;
      } else if (sortField === "guestName") {
        return sortDirection === "asc"
          ? a.guestName.localeCompare(b.guestName)
          : b.guestName.localeCompare(a.guestName);
      } else if (sortField === "messages") {
        return sortDirection === "asc"
          ? a.messages - b.messages
          : b.messages - a.messages;
      }
      return 0;
    });

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleViewSession = (session: GuestSession) => {
    setSelectedSession(session);
    setViewSessionDialog(true);
  };

  const handleEndSession = (session: GuestSession) => {
    setSelectedSession(session);
    setEndSessionDialog(true);
  };

  const confirmEndSession = () => {
    // Logic to end the session would go here
    console.log(`Ending session for ${selectedSession?.guestName}`);
    setEndSessionDialog(false);
  };

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-brand-secondary">
          Guest Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="lastWeek">Last 7 days</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </Button>
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("guestName")}
                >
                  <div className="flex items-center">
                    Guest Name
                    {renderSortIcon("guestName")}
                  </div>
                </TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("startTime")}
                >
                  <div className="flex items-center">
                    Start Time
                    {renderSortIcon("startTime")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("duration")}
                >
                  <div className="flex items-center">
                    Duration
                    {renderSortIcon("duration")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("messages")}
                >
                  <div className="flex items-center">
                    Messages
                    {renderSortIcon("messages")}
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSessions.length > 0 ? (
                paginatedSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">
                      {session.guestName}
                    </TableCell>
                    <TableCell>{session.phone}</TableCell>
                    <TableCell>{session.email || "-"}</TableCell>
                    <TableCell>
                      {format(session.startTime, "MMM d, yyyy h:mm a")}
                    </TableCell>
                    <TableCell>{session.duration} min</TableCell>
                    <TableCell>{session.messages}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          session.status === "Active" ? "default" : "secondary"
                        }
                        className={
                          session.status === "Active"
                            ? "bg-brand-accent/20 text-brand-accent"
                            : "bg-brand-muted/20 text-brand-muted"
                        }
                      >
                        {session.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-40 p-0" align="end">
                          <div className="flex flex-col">
                            <Button
                              variant="ghost"
                              className="flex items-center justify-start px-3 py-2 text-sm"
                              onClick={() => handleViewSession(session)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Button>
                            {session.status === "Active" && (
                              <Button
                                variant="ghost"
                                className="flex items-center justify-start px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleEndSession(session)}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                End Session
                              </Button>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No sessions found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {filteredSessions.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredSessions.length)} of{" "}
              {filteredSessions.length} sessions
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
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

      {/* View Session Dialog */}
      <Dialog open={viewSessionDialog} onOpenChange={setViewSessionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Session Details</DialogTitle>
            <DialogDescription>
              Detailed information about the guest session.
            </DialogDescription>
          </DialogHeader>
          {selectedSession && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Guest:</div>
                <div className="col-span-3">{selectedSession.guestName}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Phone:</div>
                <div className="col-span-3">{selectedSession.phone}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Email:</div>
                <div className="col-span-3">{selectedSession.email || "-"}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Started:</div>
                <div className="col-span-3">
                  {format(selectedSession.startTime, "PPpp")}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Duration:</div>
                <div className="col-span-3">
                  {selectedSession.duration} minutes
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Messages:</div>
                <div className="col-span-3">{selectedSession.messages}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Status:</div>
                <div className="col-span-3">
                  <Badge
                    variant={
                      selectedSession.status === "Active"
                        ? "default"
                        : "secondary"
                    }
                    className={
                      selectedSession.status === "Active"
                        ? "bg-brand-accent/20 text-brand-accent"
                        : "bg-brand-muted/20 text-brand-muted"
                    }
                  >
                    {selectedSession.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewSessionDialog(false)}
            >
              Close
            </Button>
            {selectedSession?.status === "Active" && (
              <Button
                variant="destructive"
                onClick={() => {
                  setViewSessionDialog(false);
                  handleEndSession(selectedSession);
                }}
              >
                End Session
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* End Session Confirmation Dialog */}
      <Dialog open={endSessionDialog} onOpenChange={setEndSessionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>End Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to end this guest session? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setEndSessionDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmEndSession}>
              End Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default GuestSessionTable;
