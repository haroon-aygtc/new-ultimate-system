import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  Check,
  Info,
  Save,
  Settings,
  Trash2,
  Plus,
  Search,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabaseClient";
import FollowUpQuestionManager from "./FollowUpQuestionManager";
import KnowledgeBaseManager from "./KnowledgeBaseManager";

interface AIModel {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Inactive" | "Static";
  config: {
    temperature: number;
    maxTokens: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
  };
}

const AIModelSettings = () => {
  const [activeModel, setActiveModel] = useState("gpt-4");
  const [customPrompt, setCustomPrompt] = useState(
    "You are a helpful assistant for our company. Please provide accurate and concise information to our customers.",
  );
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [currentModelConfig, setCurrentModelConfig] = useState<AIModel | null>(
    null,
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Model configurations
  const [models, setModels] = useState<AIModel[]>([]);
  const [filteredModels, setFilteredModels] = useState<AIModel[]>([]);

  // Fetch AI models from the database
  useEffect(() => {
    fetchAIModels();
  }, []);

  // Filter models when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredModels(models);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = models.filter(
        (model) =>
          model.name.toLowerCase().includes(lowercaseSearch) ||
          model.description.toLowerCase().includes(lowercaseSearch) ||
          model.id.toLowerCase().includes(lowercaseSearch),
      );
      setFilteredModels(filtered);
    }
  }, [searchTerm, models]);

  const fetchAIModels = async () => {
    setIsInitialLoading(true);
    try {
      const { data, error } = await supabase.from("ai_models").select("*");

      if (error) throw error;

      if (data && data.length > 0) {
        setModels(data as AIModel[]);
        setFilteredModels(data as AIModel[]);
        // Set the first active model as the selected one
        const activeModelData = data.find(
          (m: AIModel) => m.status === "Active",
        );
        if (activeModelData) {
          setActiveModel(activeModelData.id);
          setTemperature(activeModelData.config.temperature);
          setMaxTokens(activeModelData.config.maxTokens);
        }
      } else {
        // If no models exist, create default ones
        const defaultModels: AIModel[] = [
          {
            id: "gpt-4",
            name: "GPT-4",
            description: "Most powerful model for complex tasks",
            status: "Active",
            config: {
              temperature: 0.7,
              maxTokens: 2048,
              topP: 1,
              frequencyPenalty: 0,
              presencePenalty: 0,
            },
          },
          {
            id: "gpt-3.5-turbo",
            name: "GPT-3.5 Turbo",
            description: "Fast and cost-effective for most use cases",
            status: "Inactive",
            config: {
              temperature: 0.8,
              maxTokens: 1024,
              topP: 1,
              frequencyPenalty: 0,
              presencePenalty: 0,
            },
          },
          {
            id: "claude-2",
            name: "Claude 2",
            description: "Alternative model with different strengths",
            status: "Static",
            config: {
              temperature: 0.5,
              maxTokens: 1536,
              topP: 0.9,
              frequencyPenalty: 0.1,
              presencePenalty: 0.1,
            },
          },
        ];

        // Insert default models into the database
        const { error: insertError } = await supabase
          .from("ai_models")
          .insert(defaultModels);

        if (insertError) throw insertError;

        setModels(defaultModels);
        setFilteredModels(defaultModels);
        setActiveModel("gpt-4");
      }
    } catch (error) {
      console.error("Error fetching AI models:", error);
      toast({
        title: "Error",
        description: "Failed to load AI models",
        variant: "destructive",
      });

      // Fallback to default models if database operation fails
      const defaultModels = [
        {
          id: "gpt-4",
          name: "GPT-4",
          description: "Most powerful model for complex tasks",
          status: "Active",
          config: {
            temperature: 0.7,
            maxTokens: 2048,
            topP: 1,
            frequencyPenalty: 0,
            presencePenalty: 0,
          },
        },
        {
          id: "gpt-3.5-turbo",
          name: "GPT-3.5 Turbo",
          description: "Fast and cost-effective for most use cases",
          status: "Inactive",
          config: {
            temperature: 0.8,
            maxTokens: 1024,
            topP: 1,
            frequencyPenalty: 0,
            presencePenalty: 0,
          },
        },
        {
          id: "claude-2",
          name: "Claude 2",
          description: "Alternative model with different strengths",
          status: "Static",
          config: {
            temperature: 0.5,
            maxTokens: 1536,
            topP: 0.9,
            frequencyPenalty: 0.1,
            presencePenalty: 0.1,
          },
        },
      ];
      setModels(defaultModels);
      setFilteredModels(defaultModels);
    } finally {
      setIsInitialLoading(false);
    }
  };

  // Update temperature and maxTokens when active model changes
  useEffect(() => {
    const model = models.find((m) => m.id === activeModel);
    if (model) {
      setTemperature(model.config.temperature);
      setMaxTokens(model.config.maxTokens);
    }
  }, [activeModel, models]);

  // Handle model status change
  const handleStatusChange = async (
    modelId: string,
    newStatus: "Active" | "Inactive" | "Static",
  ) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("ai_models")
        .update({ status: newStatus })
        .eq("id", modelId);

      if (error) throw error;

      setModels(
        models.map((model) =>
          model.id === modelId ? { ...model, status: newStatus } : model,
        ),
      );

      setHasChanges(true);
      toast({
        title: "Model status updated",
        description: `${models.find((m) => m.id === modelId)?.name} is now ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating model status:", error);
      toast({
        title: "Error",
        description: "Failed to update model status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Open configuration dialog for a model
  const openConfigDialog = (modelId: string) => {
    const model = models.find((m) => m.id === modelId);
    if (model) {
      setCurrentModelConfig({ ...model });
      setShowConfigDialog(true);
    }
  };

  // Save model configuration
  const saveModelConfig = async () => {
    if (!currentModelConfig) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("ai_models")
        .update({
          config: currentModelConfig.config,
          name: currentModelConfig.name,
          description: currentModelConfig.description,
        })
        .eq("id", currentModelConfig.id);

      if (error) throw error;

      setModels(
        models.map((model) =>
          model.id === currentModelConfig.id
            ? { ...currentModelConfig }
            : model,
        ),
      );

      if (currentModelConfig.id === activeModel) {
        setTemperature(currentModelConfig.config.temperature);
        setMaxTokens(currentModelConfig.config.maxTokens);
      }

      setShowConfigDialog(false);
      setHasChanges(true);
      toast({
        title: "Configuration saved",
        description: `${currentModelConfig.name} configuration has been updated`,
      });
    } catch (error) {
      console.error("Error saving model configuration:", error);
      toast({
        title: "Error",
        description: "Failed to save model configuration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save all changes
  const saveAllChanges = async () => {
    setIsLoading(true);
    try {
      // Update the active model's parameters
      const activeModelData = models.find((m) => m.id === activeModel);
      if (activeModelData) {
        const updatedModel = {
          ...activeModelData,
          config: {
            ...activeModelData.config,
            temperature,
            maxTokens,
          },
        };

        const { error } = await supabase
          .from("ai_models")
          .update({
            config: updatedModel.config,
          })
          .eq("id", activeModel);

        if (error) throw error;

        // Update local state
        setModels(
          models.map((model) =>
            model.id === activeModel ? updatedModel : model,
          ),
        );
      }

      setHasChanges(false);
      toast({
        title: "Changes saved successfully",
        description: "All AI model configurations have been updated",
      });
    } catch (error) {
      console.error("Error saving changes:", error);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to defaults
  const resetToDefaults = async () => {
    if (
      !confirm(
        "Are you sure you want to reset all settings to their default values?",
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      // Get the default configuration for the active model
      const defaultModels = [
        {
          id: "gpt-4",
          config: {
            temperature: 0.7,
            maxTokens: 2048,
            topP: 1,
            frequencyPenalty: 0,
            presencePenalty: 0,
          },
        },
        {
          id: "gpt-3.5-turbo",
          config: {
            temperature: 0.8,
            maxTokens: 1024,
            topP: 1,
            frequencyPenalty: 0,
            presencePenalty: 0,
          },
        },
        {
          id: "claude-2",
          config: {
            temperature: 0.5,
            maxTokens: 1536,
            topP: 0.9,
            frequencyPenalty: 0.1,
            presencePenalty: 0.1,
          },
        },
      ];

      const defaultModel = defaultModels.find((m) => m.id === activeModel);
      if (defaultModel) {
        const { error } = await supabase
          .from("ai_models")
          .update({
            config: defaultModel.config,
          })
          .eq("id", activeModel);

        if (error) throw error;

        // Update local state
        setModels(
          models.map((model) =>
            model.id === activeModel
              ? { ...model, config: defaultModel.config }
              : model,
          ),
        );

        setTemperature(defaultModel.config.temperature);
        setMaxTokens(defaultModel.config.maxTokens);
      }

      toast({
        title: "Reset to defaults",
        description: "All settings have been reset to their default values",
      });
    } catch (error) {
      console.error("Error resetting to defaults:", error);
      toast({
        title: "Error",
        description: "Failed to reset settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add new model
  const [showAddModelDialog, setShowAddModelDialog] = useState(false);
  const [newModel, setNewModel] = useState<{
    id: string;
    name: string;
    description: string;
  }>({
    id: "",
    name: "",
    description: "",
  });

  const handleAddModel = async () => {
    // Validate inputs
    if (!newModel.id.trim() || !newModel.name.trim()) {
      toast({
        title: "Error",
        description: "Model ID and name are required",
        variant: "destructive",
      });
      return;
    }

    // Check if model ID already exists
    if (models.some((m) => m.id === newModel.id)) {
      toast({
        title: "Error",
        description: "A model with this ID already exists",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const newModelData: AIModel = {
        id: newModel.id,
        name: newModel.name,
        description: newModel.description,
        status: "Inactive",
        config: {
          temperature: 0.7,
          maxTokens: 1024,
          topP: 1,
          frequencyPenalty: 0,
          presencePenalty: 0,
        },
      };

      const { error } = await supabase.from("ai_models").insert([newModelData]);

      if (error) throw error;

      setModels([...models, newModelData]);
      setNewModel({ id: "", name: "", description: "" });
      setShowAddModelDialog(false);

      toast({
        title: "Model added",
        description: `${newModel.name} has been added successfully`,
      });
    } catch (error) {
      console.error("Error adding model:", error);
      toast({
        title: "Error",
        description: "Failed to add model",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white border-brand-primary/10">
        <CardHeader>
          <CardTitle className="text-brand-secondary">
            AI Model Configuration
          </CardTitle>
          <CardDescription className="text-brand-muted">
            Select and configure the AI models used in your chat system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="models">
            <TabsList className="mb-4">
              <TabsTrigger value="models">Models</TabsTrigger>
              <TabsTrigger value="prompts">Prompts</TabsTrigger>
              <TabsTrigger value="follow-up">Follow-up Questions</TabsTrigger>
              <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
            </TabsList>

            <TabsContent value="models" className="space-y-4">
              {isInitialLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-brand-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-2 text-brand-muted">Loading AI models...</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Available Models</h3>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search models..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8 w-[200px]"
                        />
                      </div>
                      <Button
                        onClick={() => setShowAddModelDialog(true)}
                        className="bg-brand-primary text-white"
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Model
                      </Button>
                    </div>
                  </div>

                  {filteredModels.length === 0 ? (
                    <div className="text-center py-8 text-brand-muted">
                      No models found matching "{searchTerm}"
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {filteredModels.map((model) => (
                        <Card
                          key={model.id}
                          className={`border transition-all duration-200 ${activeModel === model.id ? "border-brand-primary shadow-md" : "border-muted hover:border-brand-primary/50"}`}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-base flex items-center">
                                {model.name}
                                {activeModel === model.id && (
                                  <Badge className="ml-2 bg-brand-primary text-white text-xs">
                                    Active
                                  </Badge>
                                )}
                              </CardTitle>
                              <div className="flex items-center space-x-2">
                                <Select
                                  value={model.status}
                                  onValueChange={(
                                    value: "Active" | "Inactive" | "Static",
                                  ) => handleStatusChange(model.id, value)}
                                >
                                  <SelectTrigger className="h-8 w-24">
                                    <SelectValue placeholder="Status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Active">
                                      Active
                                    </SelectItem>
                                    <SelectItem value="Inactive">
                                      Inactive
                                    </SelectItem>
                                    <SelectItem value="Static">
                                      Static
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <p className="text-sm text-brand-muted">
                              {model.description}
                            </p>
                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-brand-muted">
                                  Temperature:
                                </span>{" "}
                                <span className="font-medium">
                                  {model.config.temperature}
                                </span>
                              </div>
                              <div>
                                <span className="text-brand-muted">
                                  Max Tokens:
                                </span>{" "}
                                <span className="font-medium">
                                  {model.config.maxTokens}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="pt-2 border-t">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full text-brand-primary"
                              onClick={() => openConfigDialog(model.id)}
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Configure
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}

                  {activeModel && (
                    <div className="mt-8 space-y-4">
                      <h3 className="text-sm font-medium">
                        Active Model Settings
                      </h3>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="temperature">Temperature</Label>
                                <div className="flex items-center space-x-2">
                                  <Input
                                    id="temperature"
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={temperature}
                                    onChange={(e) => {
                                      setTemperature(
                                        parseFloat(e.target.value),
                                      );
                                      setHasChanges(true);
                                    }}
                                    className="w-full"
                                  />
                                  <span className="w-12 text-center">
                                    {temperature}
                                  </span>
                                </div>
                                <p className="text-xs text-brand-muted">
                                  Controls randomness: Lower values are more
                                  deterministic, higher values are more
                                  creative.
                                </p>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="maxTokens">Max Tokens</Label>
                                <div className="flex items-center space-x-2">
                                  <Input
                                    id="maxTokens"
                                    type="range"
                                    min="256"
                                    max="4096"
                                    step="256"
                                    value={maxTokens}
                                    onChange={(e) => {
                                      setMaxTokens(parseInt(e.target.value));
                                      setHasChanges(true);
                                    }}
                                    className="w-full"
                                  />
                                  <span className="w-12 text-center">
                                    {maxTokens}
                                  </span>
                                </div>
                                <p className="text-xs text-brand-muted">
                                  Maximum length of generated responses.
                                </p>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="customPrompt">
                                  System Prompt
                                </Label>
                                <Textarea
                                  id="customPrompt"
                                  value={customPrompt}
                                  onChange={(e) => {
                                    setCustomPrompt(e.target.value);
                                    setHasChanges(true);
                                  }}
                                  rows={5}
                                  className="resize-none"
                                />
                                <p className="text-xs text-brand-muted">
                                  Instructions that define how the AI assistant
                                  behaves.
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-4">
                          <Button
                            variant="outline"
                            onClick={resetToDefaults}
                            disabled={isLoading}
                          >
                            Reset to Defaults
                          </Button>
                          <Button
                            onClick={saveAllChanges}
                            disabled={!hasChanges || isLoading}
                            className="bg-brand-primary text-white"
                          >
                            {isLoading ? (
                              <div className="flex items-center">
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                Saving...
                              </div>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                              </>
                            )}
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="prompts" className="space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Prompt Templates</h3>
                  <Button size="sm" className="bg-brand-primary text-white">
                    Add Template
                  </Button>
                </div>

                <div className="border rounded-md divide-y">
                  {[
                    {
                      name: "General Assistant",
                      prompt:
                        "You are a helpful assistant for our company. Please provide accurate and concise information to our customers.",
                      isActive: true,
                    },
                    {
                      name: "Technical Support",
                      prompt:
                        "You are a technical support specialist. Help users troubleshoot their issues with clear step-by-step instructions.",
                      isActive: false,
                    },
                    {
                      name: "Sales Representative",
                      prompt:
                        "You are a sales representative. Provide helpful information about our products and services to potential customers.",
                      isActive: false,
                    },
                  ].map((template, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3"
                    >
                      <div>
                        <div className="font-medium text-sm">
                          {template.name}
                        </div>
                        <div className="text-xs text-brand-muted mt-1 line-clamp-2">
                          {template.prompt}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className={
                            template.isActive
                              ? "bg-brand-accent/20 text-brand-accent"
                              : "bg-brand-muted/20 text-brand-muted"
                          }
                        >
                          {template.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="follow-up" className="space-y-4">
              {isInitialLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-brand-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-2 text-brand-muted">
                    Loading follow-up questions...
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <FollowUpQuestionManager activeModelId={activeModel} />
                  </div>
                  <div>
                    <FollowUpQuestionPreview activeModelId={activeModel} />
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="knowledge" className="space-y-4">
              {isInitialLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-brand-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-2 text-brand-muted">
                    Loading knowledge base...
                  </p>
                </div>
              ) : (
                <KnowledgeBaseManager activeModelId={activeModel} />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Configuration Dialog */}
      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Configure AI Model</DialogTitle>
            <DialogDescription>
              Adjust advanced settings for this model
            </DialogDescription>
          </DialogHeader>

          {currentModelConfig && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="modelName">Model Name</Label>
                <Input
                  id="modelName"
                  value={currentModelConfig.name}
                  onChange={(e) =>
                    setCurrentModelConfig({
                      ...currentModelConfig,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modelDescription">Description</Label>
                <Textarea
                  id="modelDescription"
                  value={currentModelConfig.description}
                  onChange={(e) =>
                    setCurrentModelConfig({
                      ...currentModelConfig,
                      description: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modelTemperature">Temperature</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="modelTemperature"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={currentModelConfig.config.temperature}
                    onChange={(e) =>
                      setCurrentModelConfig({
                        ...currentModelConfig,
                        config: {
                          ...currentModelConfig.config,
                          temperature: parseFloat(e.target.value),
                        },
                      })
                    }
                  />
                  <span>{currentModelConfig.config.temperature}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="modelMaxTokens">Max Tokens</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="modelMaxTokens"
                    type="range"
                    min="256"
                    max="4096"
                    step="256"
                    value={currentModelConfig.config.maxTokens}
                    onChange={(e) =>
                      setCurrentModelConfig({
                        ...currentModelConfig,
                        config: {
                          ...currentModelConfig.config,
                          maxTokens: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                  <span>{currentModelConfig.config.maxTokens}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="modelTopP">Top P</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="modelTopP"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={currentModelConfig.config.topP}
                    onChange={(e) =>
                      setCurrentModelConfig({
                        ...currentModelConfig,
                        config: {
                          ...currentModelConfig.config,
                          topP: parseFloat(e.target.value),
                        },
                      })
                    }
                  />
                  <span>{currentModelConfig.config.topP}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frequencyPenalty">Frequency Penalty</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="frequencyPenalty"
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={currentModelConfig.config.frequencyPenalty}
                      onChange={(e) =>
                        setCurrentModelConfig({
                          ...currentModelConfig,
                          config: {
                            ...currentModelConfig.config,
                            frequencyPenalty: parseFloat(e.target.value),
                          },
                        })
                      }
                    />
                    <span>{currentModelConfig.config.frequencyPenalty}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="presencePenalty">Presence Penalty</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="presencePenalty"
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={currentModelConfig.config.presencePenalty}
                      onChange={(e) =>
                        setCurrentModelConfig({
                          ...currentModelConfig,
                          config: {
                            ...currentModelConfig.config,
                            presencePenalty: parseFloat(e.target.value),
                          },
                        })
                      }
                    />
                    <span>{currentModelConfig.config.presencePenalty}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfigDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={saveModelConfig}
              disabled={isLoading}
              className="bg-brand-primary text-white"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Model Dialog */}
      <Dialog open={showAddModelDialog} onOpenChange={setShowAddModelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New AI Model</DialogTitle>
            <DialogDescription>
              Configure a new AI model for your chat system
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newModelId">Model ID</Label>
              <Input
                id="newModelId"
                placeholder="e.g., gpt-4-turbo"
                value={newModel.id}
                onChange={(e) =>
                  setNewModel({ ...newModel, id: e.target.value })
                }
              />
              <p className="text-xs text-brand-muted">
                Unique identifier for the model
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newModelName">Display Name</Label>
              <Input
                id="newModelName"
                placeholder="e.g., GPT-4 Turbo"
                value={newModel.name}
                onChange={(e) =>
                  setNewModel({ ...newModel, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newModelDescription">Description</Label>
              <Textarea
                id="newModelDescription"
                placeholder="Brief description of the model's capabilities"
                value={newModel.description}
                onChange={(e) =>
                  setNewModel({ ...newModel, description: e.target.value })
                }
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddModelDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddModel}
              disabled={isLoading}
              className="bg-brand-primary text-white"
            >
              {isLoading ? "Adding..." : "Add Model"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIModelSettings;
