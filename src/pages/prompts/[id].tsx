import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  Save,
  Trash2,
  Play,
  MessageSquare,
  Bot,
  Book,
} from "lucide-react";
import Layout from "@/components/Layout";
import FollowUpQuestionManager from "@/components/admin/FollowUpQuestionManager";
import FollowUpQuestionPreview from "@/components/admin/FollowUpQuestionPreview";
import {
  getPrompt,
  updatePrompt,
  deletePrompt,
  testPrompt,
  updatePromptStatus,
} from "@/services/promptService";
import { supabase } from "@/lib/supabaseClient";

const PromptDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [testInput, setTestInput] = useState("");
  const [testResult, setTestResult] = useState("");
  const [aiModels, setAiModels] = useState([]);
  const [knowledgeBases, setKnowledgeBases] = useState([]);
  const [prompt, setPrompt] = useState({
    id: "",
    title: "",
    content: "",
    system_prompt: "",
    description: "",
    model_id: "",
    knowledge_base_id: "",
    status: "inactive",
    created_at: "",
    updated_at: "",
    follow_up_questions: [],
  });

  useEffect(() => {
    if (id) {
      fetchPrompt();
      fetchAiModels();
      fetchKnowledgeBases();
    }
  }, [id]);

  const fetchPrompt = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getPrompt(id);
      if (error) throw error;
      if (data) setPrompt(data);
    } catch (error) {
      console.error("Error fetching prompt:", error);
      toast({
        title: "Error",
        description: "Could not load prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAiModels = async () => {
    try {
      const { data, error } = await supabase
        .from("ai_models")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setAiModels(data || []);
    } catch (error) {
      console.error("Error fetching AI models:", error);
    }
  };

  const fetchKnowledgeBases = async () => {
    try {
      const { data, error } = await supabase
        .from("knowledge_bases")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setKnowledgeBases(data || []);
    } catch (error) {
      console.error("Error fetching knowledge bases:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrompt((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = async (status) => {
    try {
      const { success, error } = await updatePromptStatus(id, status);
      if (error) throw error;
      if (success) {
        setPrompt((prev) => ({ ...prev, status }));
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

  const handleSave = async () => {
    // Validate inputs
    if (!prompt.title.trim()) {
      toast({
        title: "Error",
        description: "Title is required.",
        variant: "destructive",
      });
      return;
    }

    if (!prompt.content.trim()) {
      toast({
        title: "Error",
        description: "Prompt content is required.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const {
        success,
        prompt: updatedPrompt,
        error,
      } = await updatePrompt(id, prompt);

      if (error) throw error;

      if (success) {
        toast({
          title: "Success",
          description: "Prompt updated successfully.",
        });
        if (updatedPrompt) {
          setPrompt(updatedPrompt);
        }
      }
    } catch (error) {
      console.error("Error updating prompt:", error);
      toast({
        title: "Error",
        description: "Could not update prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this prompt? This action cannot be undone.",
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const { success, error } = await deletePrompt(id);
      if (error) throw error;

      if (success) {
        toast({
          title: "Success",
          description: "Prompt deleted successfully.",
        });
        navigate("/prompts");
      }
    } catch (error) {
      console.error("Error deleting prompt:", error);
      toast({
        title: "Error",
        description: "Could not delete prompt. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleTest = async () => {
    if (!testInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter a test input.",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);
    setTestResult("");

    try {
      const { data, error } = await testPrompt(id, testInput);
      if (error) throw error;

      if (data) {
        setTestResult(data.response || "No response generated.");
      }
    } catch (error) {
      console.error("Error testing prompt:", error);
      toast({
        title: "Error",
        description: "Could not test prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const getStatusBadge = (status) => {
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
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/prompts")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">
              {isLoading ? "Loading..." : prompt.title}
            </h1>
            {!isLoading && getStatusBadge(prompt.status)}
          </div>

          <div className="flex items-center space-x-2">
            {prompt.status !== "active" && (
              <Button
                variant="outline"
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => handleStatusChange("active")}
                disabled={isLoading || isSaving}
              >
                Activate
              </Button>
            )}
            {prompt.status === "active" && (
              <Button
                variant="outline"
                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                onClick={() => handleStatusChange("inactive")}
                disabled={isLoading || isSaving}
              >
                Deactivate
              </Button>
            )}
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleDelete}
              disabled={isLoading || isSaving}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button onClick={handleSave} disabled={isLoading || isSaving}>
              {isSaving ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <span className="ml-2 text-muted-foreground">
              Loading prompt...
            </span>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="general">
                <MessageSquare className="h-4 w-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger value="ai-settings">
                <Bot className="h-4 w-4 mr-2" />
                AI Settings
              </TabsTrigger>
              <TabsTrigger value="follow-up">
                <MessageSquare className="h-4 w-4 mr-2" />
                Follow-up Questions
              </TabsTrigger>
              <TabsTrigger value="test">
                <Play className="h-4 w-4 mr-2" />
                Test Prompt
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Prompt Details</CardTitle>
                  <CardDescription>
                    Configure the basic information for this prompt.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={prompt.title}
                      onChange={handleInputChange}
                      placeholder="Enter a descriptive title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={prompt.description || ""}
                      onChange={handleInputChange}
                      placeholder="Enter a brief description of this prompt's purpose"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Prompt Content</Label>
                    <Textarea
                      id="content"
                      name="content"
                      value={prompt.content}
                      onChange={handleInputChange}
                      placeholder="Enter the main prompt content"
                      rows={6}
                      className="font-mono"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai-settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Model Settings</CardTitle>
                  <CardDescription>
                    Configure AI model and knowledge base settings for this
                    prompt.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="system_prompt">System Prompt</Label>
                    <Textarea
                      id="system_prompt"
                      name="system_prompt"
                      value={prompt.system_prompt || ""}
                      onChange={handleInputChange}
                      placeholder="Enter system instructions for the AI model"
                      rows={4}
                      className="font-mono"
                    />
                    <p className="text-sm text-muted-foreground">
                      System prompts provide context and instructions to the AI
                      model about how it should behave and respond.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="model_id">AI Model</Label>
                      <select
                        id="model_id"
                        name="model_id"
                        value={prompt.model_id || ""}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        <option value="">Select an AI model</option>
                        {aiModels.map((model) => (
                          <option key={model.id} value={model.id}>
                            {model.name} ({model.provider})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="knowledge_base_id">Knowledge Base</Label>
                      <select
                        id="knowledge_base_id"
                        name="knowledge_base_id"
                        value={prompt.knowledge_base_id || ""}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        <option value="">None (No knowledge base)</option>
                        {knowledgeBases.map((kb) => (
                          <option key={kb.id} value={kb.id}>
                            {kb.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="follow-up" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Follow-up Questions</CardTitle>
                    <CardDescription>
                      Create follow-up questions to guide users after receiving
                      an AI response.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FollowUpQuestionManager promptId={id} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>
                      See how follow-up questions will appear to users.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FollowUpQuestionPreview promptId={id} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="test" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Test Prompt</CardTitle>
                  <CardDescription>
                    Test how this prompt responds to user input.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="test-input">Test Input</Label>
                    <Textarea
                      id="test-input"
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                      placeholder="Enter a test message to see how the AI responds"
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleTest}
                    disabled={isTesting || !prompt.model_id}
                    className="w-full"
                  >
                    {isTesting ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                        Testing...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Run Test
                      </>
                    )}
                  </Button>

                  {!prompt.model_id && (
                    <p className="text-sm text-amber-600">
                      You need to select an AI model in the AI Settings tab
                      before testing.
                    </p>
                  )}

                  {testResult && (
                    <div className="mt-4 space-y-2">
                      <Label>Response</Label>
                      <div className="p-4 rounded-md bg-muted/50 whitespace-pre-wrap">
                        {testResult}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default PromptDetail;
