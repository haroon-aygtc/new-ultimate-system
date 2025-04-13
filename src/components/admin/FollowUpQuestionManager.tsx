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
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabaseClient";

interface FollowUpOption {
  id: string;
  text: string;
}

interface FollowUpQuestion {
  id: string;
  question: string;
  options: FollowUpOption[];
  position: "start" | "middle" | "end";
  ai_model_id: string;
  is_active: boolean;
}

interface FollowUpQuestionManagerProps {
  activeModelId: string;
}

const FollowUpQuestionManager: React.FC<FollowUpQuestionManagerProps> = ({
  activeModelId,
}) => {
  const [questions, setQuestions] = useState<FollowUpQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<FollowUpQuestion>({
    id: "",
    question: "",
    options: [{ id: "1", text: "" }],
    position: "end",
    ai_model_id: activeModelId,
    is_active: true,
  });
  const { toast } = useToast();

  // Fetch follow-up questions for the active model
  useEffect(() => {
    if (activeModelId) {
      fetchFollowUpQuestions();
    }
  }, [activeModelId]);

  const fetchFollowUpQuestions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("follow_up_questions")
        .select("*")
        .eq("ai_model_id", activeModelId);

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error("Error fetching follow-up questions:", error);
      toast({
        title: "Error",
        description: "Failed to load follow-up questions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOption = () => {
    setCurrentQuestion({
      ...currentQuestion,
      options: [
        ...currentQuestion.options,
        { id: Date.now().toString(), text: "" },
      ],
    });
  };

  const handleRemoveOption = (id: string) => {
    if (currentQuestion.options.length <= 1) {
      toast({
        title: "Error",
        description: "A follow-up question must have at least one option",
        variant: "destructive",
      });
      return;
    }

    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options.filter((option) => option.id !== id),
    });
  };

  const handleOptionChange = (id: string, text: string) => {
    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options.map((option) =>
        option.id === id ? { ...option, text } : option,
      ),
    });
  };

  const handleSaveQuestion = async () => {
    // Validate inputs
    if (!currentQuestion.question.trim()) {
      toast({
        title: "Error",
        description: "Question text is required",
        variant: "destructive",
      });
      return;
    }

    if (
      currentQuestion.options.some((option) => !option.text.trim()) ||
      currentQuestion.options.length === 0
    ) {
      toast({
        title: "Error",
        description: "All options must have text",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      let result;
      if (isEditing) {
        // Update existing question
        result = await supabase
          .from("follow_up_questions")
          .update({
            question: currentQuestion.question,
            options: currentQuestion.options,
            position: currentQuestion.position,
            is_active: currentQuestion.is_active,
          })
          .eq("id", currentQuestion.id);
      } else {
        // Create new question
        result = await supabase.from("follow_up_questions").insert([
          {
            question: currentQuestion.question,
            options: currentQuestion.options,
            position: currentQuestion.position,
            ai_model_id: activeModelId,
            is_active: currentQuestion.is_active,
          },
        ]);
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: isEditing
          ? "Follow-up question updated successfully"
          : "Follow-up question created successfully",
      });

      // Reset form and refresh questions
      setCurrentQuestion({
        id: "",
        question: "",
        options: [{ id: "1", text: "" }],
        position: "end",
        ai_model_id: activeModelId,
        is_active: true,
      });
      setIsEditing(false);
      setShowDialog(false);
      fetchFollowUpQuestions();
    } catch (error) {
      console.error("Error saving follow-up question:", error);
      toast({
        title: "Error",
        description: "Failed to save follow-up question",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditQuestion = (question: FollowUpQuestion) => {
    setCurrentQuestion(question);
    setIsEditing(true);
    setShowDialog(true);
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm("Are you sure you want to delete this follow-up question?")) {
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("follow_up_questions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Follow-up question deleted successfully",
      });

      fetchFollowUpQuestions();
    } catch (error) {
      console.error("Error deleting follow-up question:", error);
      toast({
        title: "Error",
        description: "Failed to delete follow-up question",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("follow_up_questions")
        .update({ is_active: !isActive })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Follow-up question ${!isActive ? "activated" : "deactivated"} successfully`,
      });

      fetchFollowUpQuestions();
    } catch (error) {
      console.error("Error toggling follow-up question status:", error);
      toast({
        title: "Error",
        description: "Failed to update follow-up question status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Follow-up Questions</h3>
        <Button
          onClick={() => {
            setCurrentQuestion({
              id: "",
              question: "",
              options: [{ id: "1", text: "" }],
              position: "end",
              ai_model_id: activeModelId,
              is_active: true,
            });
            setIsEditing(false);
            setShowDialog(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      {isLoading && questions.length === 0 ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-muted-foreground">
            Loading follow-up questions...
          </p>
        </div>
      ) : questions.length === 0 ? (
        <Card className="border-dashed border-2 bg-muted/10">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground text-center mb-4">
              No follow-up questions defined for this AI model yet.
            </p>
            <Button
              onClick={() => {
                setCurrentQuestion({
                  id: "",
                  question: "",
                  options: [{ id: "1", text: "" }],
                  position: "end",
                  ai_model_id: activeModelId,
                  is_active: true,
                });
                setIsEditing(false);
                setShowDialog(true);
              }}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Question
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <Card key={question.id} className="border overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-base">
                      {question.question}
                    </CardTitle>
                    <CardDescription>
                      Position:{" "}
                      {question.position.charAt(0).toUpperCase() +
                        question.position.slice(1)}{" "}
                      of response
                    </CardDescription>
                  </div>
                  <Badge
                    variant={question.is_active ? "default" : "outline"}
                    className={
                      question.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {question.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <Label className="text-sm">Options:</Label>
                  <ul className="space-y-1 pl-5 list-disc">
                    {question.options.map((option) => (
                      <li key={option.id} className="text-sm">
                        {option.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 pt-2 border-t">
                <Switch
                  checked={question.is_active}
                  onCheckedChange={() =>
                    handleToggleActive(question.id, question.is_active)
                  }
                  id={`active-${question.id}`}
                />
                <Label htmlFor={`active-${question.id}`} className="text-sm">
                  {question.is_active ? "Active" : "Inactive"}
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditQuestion(question)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Follow-up Question" : "Add Follow-up Question"}
            </DialogTitle>
            <DialogDescription>
              Define a follow-up question that will be presented to users after
              an AI response.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="question-text">Question Text</Label>
              <Textarea
                id="question-text"
                placeholder="Enter the follow-up question text"
                value={currentQuestion.question}
                onChange={(e) =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    question: e.target.value,
                  })
                }
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Position in Response</Label>
              <Select
                value={currentQuestion.position}
                onValueChange={(value: "start" | "middle" | "end") =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    position: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="start">Start of response</SelectItem>
                  <SelectItem value="middle">Middle of response</SelectItem>
                  <SelectItem value="end">End of response</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Response Options</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddOption}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Option
                </Button>
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Input
                      placeholder="Option text"
                      value={option.text}
                      onChange={(e) =>
                        handleOptionChange(option.id, e.target.value)
                      }
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveOption(option.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9 w-9"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is-active"
                checked={currentQuestion.is_active}
                onCheckedChange={(checked) =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    is_active: checked,
                  })
                }
              />
              <Label htmlFor="is-active">Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveQuestion} disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Saving...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Question
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FollowUpQuestionManager;
