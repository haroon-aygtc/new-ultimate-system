import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, MessageSquare, Settings, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  getPrompts,
  updatePromptStatus,
  deletePrompt,
} from "@/services/promptService";
import { Prompt } from "@/types";

const PromptManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadPrompts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await getPrompts();
        if (error) throw error;
        if (data) setPrompts(data);
      } catch (error) {
        console.error("Error loading prompts:", error);
        toast({
          title: "Error",
          description: "Could not load prompts. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPrompts();
  }, [toast]);

  const filteredPrompts = prompts.filter((prompt) => {
    return (
      searchQuery === "" ||
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prompt.description || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  });

  const handleStatusChange = async (
    id: string,
    status: "static" | "active" | "inactive",
  ) => {
    try {
      const { success, error } = await updatePromptStatus(id, status);
      if (error) throw error;
      if (success) {
        setPrompts(
          prompts.map((prompt) =>
            prompt.id === id ? { ...prompt, status } : prompt,
          ),
        );
        toast({
          title: "Status Updated",
          description: `Prompt status changed to ${status}.`,
        });
      }
    } catch (error) {
      console.error("Error updating prompt status:", error);
      toast({
        title: "Error",
        description: "Could not update prompt status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePrompt = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this prompt? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const { success, error } = await deletePrompt(id);
      if (error) throw error;
      if (success) {
        setPrompts(prompts.filter((prompt) => prompt.id !== id));
        toast({
          title: "Prompt Deleted",
          description: "The prompt has been deleted successfully.",
        });
      }
    } catch (error) {
      console.error("Error deleting prompt:", error);
      toast({
        title: "Error",
        description: "Could not delete the prompt. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive":
        return <Badge className="bg-amber-100 text-amber-800">Inactive</Badge>;
      case "static":
        return <Badge className="bg-blue-100 text-blue-800">Static</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">AI Prompts</h2>
        <Button onClick={() => navigate("/prompts/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Prompt
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Prompts</CardTitle>
          <CardDescription>
            Configure and manage AI prompts for your application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Input
                type="search"
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">
                Loading prompts...
              </span>
            </div>
          ) : filteredPrompts.length === 0 ? (
            <div className="text-center py-12 border rounded-md bg-muted/10">
              <p className="text-muted-foreground">No prompts found.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/prompts/new")}
              >
                Add your first prompt
              </Button>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrompts.map((prompt) => (
                    <TableRow key={prompt.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="h-4 w-4 text-primary" />
                          <span className="font-medium">{prompt.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {prompt.description || "No description"}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(prompt.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {prompt.status !== "active" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-600"
                              onClick={() =>
                                handleStatusChange(prompt.id, "active")
                              }
                            >
                              Activate
                            </Button>
                          )}
                          {prompt.status === "active" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-amber-600"
                              onClick={() =>
                                handleStatusChange(prompt.id, "inactive")
                              }
                            >
                              Deactivate
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/prompts/${prompt.id}`)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeletePrompt(prompt.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PromptManager;
