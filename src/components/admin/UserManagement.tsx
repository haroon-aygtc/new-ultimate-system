import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  CardFooter,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Search, UserPlus, Edit, Trash2, Check, X } from "lucide-react";
import { supabase, createUserAsAdmin, setUserRole } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

type UserRole = "guest" | "user" | "admin";

interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  isGuest?: boolean;
  name?: string;
  phone?: string;
}

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]),
});

type FormValues = z.infer<typeof formSchema>;

const UserManagement = () => {
  const { authUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "user",
    },
  });

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search query
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
      // Fetch regular and admin users
      const { data: authUsers, error: authError } = await supabase
        .from("auth_users")
        .select("*");

      if (authError) throw authError;

      // Fetch guest users
      const { data: guestUsers, error: guestError } = await supabase
        .from("guest_users")
        .select("*");

      if (guestError) throw guestError;

      // Combine and format users
      const formattedAuthUsers = authUsers.map((user) => ({
        id: user.id,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        isGuest: false,
      }));

      const formattedGuestUsers = guestUsers.map((user) => ({
        id: user.id,
        email: "",
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

  const handleAddUser = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const { data: userData, error } = await createUserAsAdmin(
        data.email,
        data.password,
        data.role as "user" | "admin",
      );

      if (error) throw error;

      toast({
        title: "Success",
        description: `User ${data.email} created successfully`,
      });

      setShowAddDialog(false);
      form.reset();
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setShowEditDialog(true);
  };

  const handleUpdateRole = async (userId: string, newRole: UserRole) => {
    setIsLoading(true);
    try {
      const { error } = await setUserRole(userId, newRole);

      if (error) throw error;

      toast({
        title: "Success",
        description: `User role updated to ${newRole}`,
      });

      setShowEditDialog(false);
      setCurrentUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    setIsLoading(true);
    try {
      // Check if it's a guest user or auth user
      const user = users.find((u) => u.id === userId);

      if (!user) {
        throw new Error("User not found");
      }

      if (user.isGuest) {
        // Delete guest user
        const { error } = await supabase
          .from("guest_users")
          .delete()
          .eq("id", userId);

        if (error) throw error;
      } else {
        // For auth users, we would need admin privileges
        // This would typically be handled by a server-side function
        toast({
          title: "Info",
          description:
            "Deleting authenticated users requires server-side implementation",
        });
        return;
      }

      toast({
        title: "Success",
        description: "User deleted successfully",
      });

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

  // Check if current user is admin
  if (authUser?.role !== "admin") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            You don't have permission to access this section.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white border-brand-primary/10">
        <CardHeader>
          <CardTitle className="text-brand-secondary">
            User Management
          </CardTitle>
          <CardDescription className="text-brand-muted">
            Manage users and their roles in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              onClick={() => setShowAddDialog(true)}
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
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
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
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteUser(user.id)}
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
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with specified role.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleAddUser)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="user@example.com"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-brand-primary text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    "Create User"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user role and permissions.
            </DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="space-y-4">
              <div>
                <Label>User</Label>
                <div className="font-medium mt-1">
                  {currentUser.isGuest ? currentUser.name : currentUser.email}
                </div>
                {currentUser.isGuest && (
                  <div className="text-sm text-brand-muted">
                    {currentUser.phone}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  defaultValue={currentUser.role}
                  onValueChange={(value) =>
                    handleUpdateRole(currentUser.id, value as UserRole)
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guest">Guest</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowEditDialog(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
