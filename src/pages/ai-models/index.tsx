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
import { Loader2, Search, Plus, Bot, Settings, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  getAIModels,
  updateAIModelStatus,
  deleteAIModel,
} from "@/services/aiModelService";
import { AIModel } from "@/types";

const AIModels = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [models, setModels] = useState<AIModel[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const loadModels = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await getAIModels();
        if (error) throw error;
        if (data) setModels(data);
      } catch (error) {
        console.error("Error loading AI models:", error);
        toast({
          title: "Error",
          description: "Could not load AI models. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadModels();
  }, [toast]);

  const filteredModels = models.filter((model) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.model_id.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by tab
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && model.status === "active") ||
      (activeTab === "inactive" && model.status === "inactive") ||
      (activeTab === "static" && model.status === "static");

    return matchesSearch && matchesTab;
  });

  const handleStatusChange = async (
    id: string,
    status: "static" | "active" | "inactive",
  ) => {
    try {
      const { success, error } = await updateAIModelStatus(id, status);
      if (error) throw error;
      if (success) {
        setModels(
          models.map((model) =>
            model.id === id ? { ...model, status } : model,
          ),
        );
        toast({
          title: "Status Updated",
          description: `Model status changed to ${status}.`,
        });
      }
    } catch (error) {
      console.error("Error updating model status:", error);
      toast({
        title: "Error",
        description: "Could not update model status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteModel = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this model? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const { success, error } = await deleteAIModel(id);
      if (error) throw error;
      if (success) {
        setModels(models.filter((model) => model.id !== id));
        toast({
          title: "Model Deleted",
          description: "The AI model has been deleted successfully.",
        });
      }
    } catch (error) {
      console.error("Error deleting model:", error);
      toast({
        title: "Error",
        description: "Could not delete the model. It may be in use by prompts.",
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

  const getProviderBadge = (provider: string) => {
    switch (provider) {
      case "openai":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200"
          >
            OpenAI
          </Badge>
        );
      case "anthropic":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200"
          >
            Anthropic
          </Badge>
        );
      case "google":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Google
          </Badge>
        );
      case "custom":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200"
          >
            Custom
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">AI Models</h1>
        <Button onClick={() => navigate("/ai-models/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Model
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage AI Models</CardTitle>
          <CardDescription>
            Configure and manage AI models for your application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, provider or model ID..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Models</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="static">Static</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">
                    Loading models...
                  </span>
                </div>
              ) : filteredModels.length === 0 ? (
                <div className="text-center py-12 border rounded-md bg-muted/10">
                  <p className="text-muted-foreground">No models found.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => navigate("/ai-models/new")}
                  >
                    Add your first model
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredModels.map((model) => (
                    <Card key={model.id} className="overflow-hidden">
                      <div className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-2">
                            <Bot className="h-5 w-5 text-primary" />
                            <h3 className="font-medium">{model.name}</h3>
                          </div>
                          {getStatusBadge(model.status)}
                        </div>

                        <div className="mt-2 space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                              Provider:
                            </span>
                            {getProviderBadge(model.provider)}
                          </div>
                          <p className="text-sm">
                            <span className="text-muted-foreground">
                              Model ID:
                            </span>{" "}
                            {model.model_id}
                          </p>
                          {model.description && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {model.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="bg-muted/20 p-3 flex justify-between items-center">
                        <div className="space-x-1">
                          {model.status !== "active" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() =>
                                handleStatusChange(model.id, "active")
                              }
                            >
                              Activate
                            </Button>
                          )}
                          {model.status !== "inactive" &&
                            model.status !== "static" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                onClick={() =>
                                  handleStatusChange(model.id, "inactive")
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
                            onClick={() => navigate(`/ai-models/${model.id}`)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteModel(model.id)}
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
  );
};

export default AIModels;
