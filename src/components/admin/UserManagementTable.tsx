import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

type UserRole = "guest" | "user" | "admin";

interface User {
  id: string;
  email?: string;
  name?: string;
  phone?: string;
  role: UserRole;
  created_at: string;
  isGuest?: boolean;
}

const UserManagementTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(
          (user) =>
            user.email?.toLowerCase().includes(query) ||
            user.name?.toLowerCase().includes(query) ||
            user.role.toLowerCase().includes(query),
        ),
      );
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Fetch registered users
      const { data: authUsers, error: authError } = await supabase
        .from("auth_users")
        .select("*");

      if (authError) throw authError;

      // Fetch guest users
      const { data: guestUsers, error: guestError } = await supabase
        .from("guest_users")
        .select("*");

      if (guestError) throw guestError;

      // Format the data
      const formattedAuthUsers = (authUsers || []).map((user) => ({
        id: user.id,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        isGuest: false,
      }));

      const formattedGuestUsers = (guestUsers || []).map((user) => ({
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role || "guest",
        created_at: user.created_at,
        isGuest: true,
      }));

      const allUsers = [...formattedAuthUsers, ...formattedGuestUsers];
      setUsers(allUsers);
      setFilteredUsers(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setIsLoading(true);
    try {
      if (selectedUser.isGuest) {
        // Delete guest user
        const { error } = await supabase
          .from("guest_users")
          .delete()
          .eq("id", selectedUser.id);

        if (error) throw error;
      } else {
        // For auth users, we would need admin privileges
        // This would typically be handled by a server-side function
        toast({
          title: "Info",
          description: "Deleting registered users requires admin privileges",
        });
        return;
      }

      toast({
        title: "Success",
        description: "User deleted successfully",
      });

      setShowDeleteDialog(false);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button
          onClick={() =>
            (window.location.href =
              "/admin/guest-session-management?tab=user-management")
          }
          className="bg-brand-primary text-white"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="animate-spin h-6 w-6 border-2 border-brand-primary border-t-transparent rounded-full"></div>
                  </div>
                  <p className="mt-2 text-sm text-brand-muted">
                    Loading users...
                  </p>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-muted-foreground"
                >
                  No users found. Try adjusting your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium">
                      {user.isGuest ? user.name : user.email}
                    </div>
                    {user.isGuest && (
                      <div className="text-sm text-brand-muted">
                        {user.phone}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800 border-purple-200"
                          : user.role === "user"
                            ? "bg-blue-100 text-blue-800 border-blue-200"
                            : "bg-gray-100 text-gray-800 border-gray-200"
                      }
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        user.isGuest
                          ? "bg-amber-100 text-amber-800 border-amber-200"
                          : "bg-green-100 text-green-800 border-green-200"
                      }
                    >
                      {user.isGuest ? "Guest" : "Registered"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          (window.location.href = `/admin/guest-session-management?tab=user-management&userId=${user.id}`)
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteClick(user)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Deleting...
                </>
              ) : (
                "Delete User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagementTable;
