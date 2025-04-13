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
  Plus,
  MessageSquare,
  Settings,
  Trash2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  getPrompts,
  updatePromptStatus,
  deletePrompt,
} from "@/services/promptService";
import { Prompt } from "@/types";
import Layout from "@/components/Layout";

const Prompts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

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
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prompt.description || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    // Filter by tab
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && prompt.status === "active") ||
      (activeTab === "inactive" && prompt.status === "inactive") ||
      (activeTab === "static" && prompt.status === "static");

    return matchesSearch && matchesTab;
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
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Prompts</h1>
          <Button onClick={() => navigate("/prompts/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Prompt
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Manage Prompts</CardTitle>
            <CardDescription>
              Configure and manage prompts for your AI models.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by title or description..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Prompts</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
                <TabsTrigger value="static">Static</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPrompts.map((prompt) => (
                      <Card key={prompt.id} className="overflow-hidden">
                        <div className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-2">
                              <MessageSquare className="h-5 w-5 text-primary" />
                              <h3 className="font-medium">{prompt.title}</h3>
                            </div>
                            {getStatusBadge(prompt.status)}
                          </div>

                          <div className="mt-2 space-y-1">
                            {prompt.description && (
                              <p className="text-sm text-muted-foreground">
                                {prompt.description}
                              </p>
                            )}
                            {prompt.knowledge_base_id && (
                              <p className="text-xs text-muted-foreground">
                                Uses knowledge base
                              </p>
                            )}
                            {prompt.follow_up_questions &&
                              prompt.follow_up_questions.length > 0 && (
                                <p className="text-xs text-muted-foreground">
                                  {prompt.follow_up_questions.length} follow-up
                                  questions
                                </p>
                              )}
                          </div>
                        </div>

                        <div className="bg-muted/20 p-3 flex justify-between items-center">
                          <div className="space-x-1">
                            {prompt.status !== "active" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() =>
                                  handleStatusChange(prompt.id, "active")
                                }
                              >
                                Activate
                              </Button>
                            )}
                            {prompt.status !== "inactive" &&
                              prompt.status !== "static" && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                  onClick={() =>
                                    handleStatusChange(prompt.id, "inactive")
                                  }
                                >
                                  Deactivate
                                </Button>
                              )}
                          </div>

                          <div className="space-x-1">
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
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeletePrompt(prompt.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Prompts;
