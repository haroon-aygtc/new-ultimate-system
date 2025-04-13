import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Plus, Trash2, Save, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createPrompt,
  updatePrompt,
  getPrompt,
} from "@/services/promptService";
import { getAIModels } from "@/services/aiModelService";
import { getKnowledgeBases } from "@/services/knowledgeBaseService";

interface PromptEditorProps {
  promptId?: string;
  isNew?: boolean;
}

const PromptEditor: React.FC<PromptEditorProps> = ({
  promptId,
  isNew = false,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [aiModels, setAIModels] = useState<any[]>([]);
  const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]);
  const [followUpQuestions, setFollowUpQuestions] = useState<
    { question: string }[]
  >([{ question: "" }]);

  const [promptData, setPromptData] = useState({
    name: "",
    description: "",
    content: "",
    template: "",
    system_prompt: "",
    model_id: "",
    knowledge_base_id: "",
    status: "inactive",
    is_template: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch AI models
        const { data: modelsData } = await getAIModels();
        if (modelsData) {
          setAIModels(modelsData);
        }

        // Fetch knowledge bases
        const { data: kbData } = await getKnowledgeBases();
        if (kbData) {
          setKnowledgeBases(kbData);
        }

        // If editing an existing prompt, fetch its data
        if (promptId && !isNew) {
          const { data: promptData, error } = await getPrompt(promptId);
          if (error) throw error;
          if (promptData) {
            setPromptData({
              name: promptData.name || "",
              description: promptData.description || "",
              content: promptData.content || "",
              template: promptData.template || "",
              system_prompt: promptData.system_prompt || "",
              model_id: promptData.model_id || "",
              knowledge_base_id: promptData.knowledge_base_id || "",
              status: promptData.status || "inactive",
              is_template: promptData.is_template || false,
            });

            if (
              promptData.follow_up_questions &&
              promptData.follow_up_questions.length > 0
            ) {
              setFollowUpQuestions(
                promptData.follow_up_questions.map((q: any) => ({
                  question: q.question,
                })),
              );
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [promptId, isNew, toast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setPromptData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setPromptData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setPromptData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleFollowUpChange = (index: number, value: string) => {
    const updatedQuestions = [...followUpQuestions];
    updatedQuestions[index] = { question: value };
    setFollowUpQuestions(updatedQuestions);
  };

  const addFollowUpQuestion = () => {
    setFollowUpQuestions([...followUpQuestions, { question: "" }]);
  };

  const removeFollowUpQuestion = (index: number) => {
    const updatedQuestions = [...followUpQuestions];
    updatedQuestions.splice(index, 1);
    setFollowUpQuestions(updatedQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out empty follow-up questions
      const filteredFollowUps = followUpQuestions.filter(
        (q) => q.question.trim() !== "",
      );

      const submitData = {
        ...promptData,
        follow_up_questions: filteredFollowUps,
      };

      let result;
      if (isNew) {
        result = await createPrompt(submitData);
      } else if (promptId) {
        result = await updatePrompt(promptId, submitData);
      }

      if (result?.success) {
        toast({
          title: isNew ? "Prompt Created" : "Prompt Updated",
          description: isNew
            ? "New prompt has been created successfully."
            : "Prompt has been updated successfully.",
        });
        navigate("/admin/guest-session-management?tab=prompts");
      } else {
        throw new Error(result?.error || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Error saving prompt:", error);
      toast({
        title: "Error",
        description: `Failed to ${isNew ? "create" : "update"} prompt. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              navigate("/admin/guest-session-management?tab=prompts")
            }
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">
            {isNew ? "Create New Prompt" : "Edit Prompt"}
          </h2>
        </div>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </span>
          ) : (
            <span className="flex items-center">
              <Save className="mr-2 h-4 w-4" /> Save Prompt
            </span>
          )}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Prompt Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={promptData.name}
                  onChange={handleInputChange}
                  placeholder="Enter prompt name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={promptData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="static">Static</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={promptData.description}
                onChange={handleInputChange}
                placeholder="Enter a description for this prompt"
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_template"
                checked={promptData.is_template}
                onCheckedChange={(checked) =>
                  handleSwitchChange("is_template", checked)
                }
              />
              <Label htmlFor="is_template">Use as Template</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="model_id">AI Model</Label>
                <Select
                  value={promptData.model_id}
                  onValueChange={(value) =>
                    handleSelectChange("model_id", value)
                  }
                >
                  <SelectTrigger id="model_id">
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {aiModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="knowledge_base_id">Knowledge Base</Label>
                <Select
                  value={promptData.knowledge_base_id}
                  onValueChange={(value) =>
                    handleSelectChange("knowledge_base_id", value)
                  }
                >
                  <SelectTrigger id="knowledge_base_id">
                    <SelectValue placeholder="Select knowledge base" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {knowledgeBases.map((kb) => (
                      <SelectItem key={kb.id} value={kb.id}>
                        {kb.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prompt Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="system_prompt">System Prompt</Label>
              <Textarea
                id="system_prompt"
                name="system_prompt"
                value={promptData.system_prompt}
                onChange={handleInputChange}
                placeholder="Enter system prompt instructions"
                rows={3}
              />
              <p className="text-sm text-muted-foreground">
                System instructions that set the behavior of the AI model
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="content">Prompt Content</Label>
              <Textarea
                id="content"
                name="content"
                value={promptData.content}
                onChange={handleInputChange}
                placeholder="Enter the main prompt content"
                rows={5}
                required
              />
              <p className="text-sm text-muted-foreground">
                The main prompt content that will be sent to the AI model
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="template">Template (with Variables)</Label>
              <Textarea
                id="template"
                name="template"
                value={promptData.template}
                onChange={handleInputChange}
                placeholder="Enter template with variables like {{variable_name}}"
                rows={5}
              />
              <p className="text-sm text-muted-foreground">
                Template version of the prompt with variables in the format
                {{ variable_name }}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Follow-up Questions</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFollowUpQuestion}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Question
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {followUpQuestions.map((q, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="flex-1">
                  <Input
                    value={q.question}
                    onChange={(e) =>
                      handleFollowUpChange(index, e.target.value)
                    }
                    placeholder={`Follow-up question ${index + 1}`}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFollowUpQuestion(index)}
                  disabled={followUpQuestions.length <= 1}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <p className="text-sm text-muted-foreground">
              Follow-up questions will be shown to users after the AI response
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              navigate("/admin/guest-session-management?tab=prompts")
            }
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              <span className="flex items-center">
                <Save className="mr-2 h-4 w-4" /> Save Prompt
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PromptEditor;
