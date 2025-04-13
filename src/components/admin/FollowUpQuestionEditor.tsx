import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FollowUpQuestion {
  id?: string;
  question: string;
  order: number;
  prompt_id?: string;
  response_template?: string;
}

interface FollowUpQuestionEditorProps {
  promptId: string;
  initialQuestions?: FollowUpQuestion[];
  onSave: (questions: FollowUpQuestion[]) => void;
}

const FollowUpQuestionEditor: React.FC<FollowUpQuestionEditorProps> = ({
  promptId,
  initialQuestions = [],
  onSave,
}) => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<FollowUpQuestion[]>(
    initialQuestions.length > 0
      ? initialQuestions
      : [{ question: "", order: 1, prompt_id: promptId }],
  );

  useEffect(() => {
    if (initialQuestions.length > 0) {
      setQuestions(initialQuestions);
    }
  }, [initialQuestions]);

  const addQuestion = () => {
    const newOrder =
      questions.length > 0 ? Math.max(...questions.map((q) => q.order)) + 1 : 1;
    setQuestions([
      ...questions,
      { question: "", order: newOrder, prompt_id: promptId },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length <= 1) {
      toast({
        title: "Cannot Remove",
        description: "You must have at least one follow-up question.",
        variant: "destructive",
      });
      return;
    }

    const newQuestions = [...questions];
    newQuestions.splice(index, 1);

    // Reorder remaining questions
    const reorderedQuestions = newQuestions.map((q, idx) => ({
      ...q,
      order: idx + 1,
    }));

    setQuestions(reorderedQuestions);
  };

  const moveQuestion = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === questions.length - 1)
    ) {
      return;
    }

    const newQuestions = [...questions];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    // Swap order values
    const currentOrder = newQuestions[index].order;
    newQuestions[index].order = newQuestions[targetIndex].order;
    newQuestions[targetIndex].order = currentOrder;

    // Sort by order
    newQuestions.sort((a, b) => a.order - b.order);

    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleResponseTemplateChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].response_template = value;
    setQuestions(newQuestions);
  };

  const handleSave = () => {
    // Validate questions
    const emptyQuestions = questions.filter((q) => !q.question.trim());
    if (emptyQuestions.length > 0) {
      toast({
        title: "Validation Error",
        description: "All follow-up questions must have content.",
        variant: "destructive",
      });
      return;
    }

    onSave(questions);
    toast({
      title: "Success",
      description: "Follow-up questions saved successfully.",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Follow-up Questions</CardTitle>
        <Button variant="outline" size="sm" onClick={addQuestion}>
          <Plus className="h-4 w-4 mr-2" /> Add Question
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((question, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-md">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Question {index + 1}</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => moveQuestion(index, "up")}
                  disabled={index === 0}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => moveQuestion(index, "down")}
                  disabled={index === questions.length - 1}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeQuestion(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`question-${index}`}>Question Text</Label>
              <Input
                id={`question-${index}`}
                value={question.question}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                placeholder="Enter follow-up question"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`response-${index}`}>
                Response Template (Optional)
              </Label>
              <Textarea
                id={`response-${index}`}
                value={question.response_template || ""}
                onChange={(e) =>
                  handleResponseTemplateChange(index, e.target.value)
                }
                placeholder="Enter a template for responses to this follow-up"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                You can use variables like {{ user_name }} in the template
              </p>
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Follow-up Questions</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowUpQuestionEditor;
