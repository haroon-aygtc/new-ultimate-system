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
  Book,
  Settings,
  Trash2,
  FileText,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  getKnowledgeBases,
  updateKnowledgeBaseStatus,
  deleteKnowledgeBase,
} from "@/services/knowledgeBaseService";
import { KnowledgeBase } from "@/types";
import Layout from "@/components/Layout";

const KnowledgeBases = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const loadKnowledgeBases = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await getKnowledgeBases();
        if (error) throw error;
        if (data) setKnowledgeBases(data);
      } catch (error) {
        console.error("Error loading knowledge bases:", error);
        toast({
          title: "Error",
          description: "Could not load knowledge bases. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadKnowledgeBases();
  }, [toast]);

  const filteredKnowledgeBases = knowledgeBases.filter((kb) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      kb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (kb.description || "").toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by tab
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && kb.status === "active") ||
      (activeTab === "inactive" && kb.status === "inactive") ||
      (activeTab === "static" && kb.status === "static");

    return matchesSearch && matchesTab;
  });

  const handleStatusChange = async (
    id: string,
    status: "static" | "active" | "inactive",
  ) => {
    try {
      const { success, error } = await updateKnowledgeBaseStatus(id, status);
      if (error) throw error;
      if (success) {
        setKnowledgeBases(
          knowledgeBases.map((kb) => (kb.id === id ? { ...kb, status } : kb)),
        );
        toast({
          title: "Status Updated",
          description: `Knowledge base status changed to ${status}.`,
        });
      }
    } catch (error) {
      console.error("Error updating knowledge base status:", error);
      toast({
        title: "Error",
        description:
          "Could not update knowledge base status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteKnowledgeBase = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this knowledge base? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const { success, error } = await deleteKnowledgeBase(id);
      if (error) throw error;
      if (success) {
        setKnowledgeBases(knowledgeBases.filter((kb) => kb.id !== id));
        toast({
          title: "Knowledge Base Deleted",
          description: "The knowledge base has been deleted successfully.",
        });
      }
    } catch (error) {
      console.error("Error deleting knowledge base:", error);
      toast({
        title: "Error",
        description: "Could not delete the knowledge base. Please try again.",
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
          <h1 className="text-3xl font-bold">Knowledge Bases</h1>
          <Button onClick={() => navigate("/knowledge-base/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Knowledge Base
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Manage Knowledge Bases</CardTitle>
            <CardDescription>
              Configure and manage knowledge bases for your AI models.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name or description..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Knowledge Bases</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
                <TabsTrigger value="static">Static</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">
                      Loading knowledge bases...
                    </span>
                  </div>
                ) : filteredKnowledgeBases.length === 0 ? (
                  <div className="text-center py-12 border rounded-md bg-muted/10">
                    <p className="text-muted-foreground">
                      No knowledge bases found.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => navigate("/knowledge-base/new")}
                    >
                      Add your first knowledge base
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredKnowledgeBases.map((kb) => (
                      <Card key={kb.id} className="overflow-hidden">
                        <div className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-2">
                              <Book className="h-5 w-5 text-primary" />
                              <h3 className="font-medium">{kb.name}</h3>
                            </div>
                            {getStatusBadge(kb.status)}
                          </div>

                          <div className="mt-2 space-y-1">
                            {kb.description && (
                              <p className="text-sm text-muted-foreground">
                                {kb.description}
                              </p>
                            )}
                            <div className="flex items-center text-xs text-muted-foreground">
                              <FileText className="h-3 w-3 mr-1" />
                              {kb.documents ? kb.documents.length : 0} documents
                            </div>
                          </div>
                        </div>

                        <div className="bg-muted/20 p-3 flex justify-between items-center">
                          <div className="space-x-1">
                            {kb.status !== "active" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() =>
                                  handleStatusChange(kb.id, "active")
                                }
                              >
                                Activate
                              </Button>
                            )}
                            {kb.status !== "inactive" &&
                              kb.status !== "static" && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                  onClick={() =>
                                    handleStatusChange(kb.id, "inactive")
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
                              onClick={() =>
                                navigate(`/knowledge-base/${kb.id}`)
                              }
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteKnowledgeBase(kb.id)}
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

export default KnowledgeBases;
