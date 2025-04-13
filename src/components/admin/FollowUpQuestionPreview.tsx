import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
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

interface FollowUpQuestionPreviewProps {
  activeModelId: string;
}

const FollowUpQuestionPreview: React.FC<FollowUpQuestionPreviewProps> = ({
  activeModelId,
}) => {
  const [questions, setQuestions] = useState<FollowUpQuestion[]>([]);
  const [selectedQuestion, setSelectedQuestion] =
    useState<FollowUpQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewMessages, setPreviewMessages] = useState<
    Array<{ type: "user" | "system"; content: string }>
  >([]);

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
        .eq("ai_model_id", activeModelId)
        .eq("is_active", true);

      if (error) throw error;

      const questions = data || [];
      setQuestions(questions);

      // Select a random question for preview
      if (questions.length > 0) {
        const randomQuestion =
          questions[Math.floor(Math.random() * questions.length)];
        setSelectedQuestion(randomQuestion);

        // Initialize preview with a sample conversation
        initializePreview(randomQuestion);
      }
    } catch (error) {
      console.error("Error fetching follow-up questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializePreview = (question: FollowUpQuestion) => {
    // Create a sample conversation based on the question position
    let messages: Array<{ type: "user" | "system"; content: string }> = [];

    // Add initial user query
    messages.push({
      type: "user",
      content: "Can you tell me more about your services?",
    });

    // Add AI response
    const aiResponse =
      "Thank you for your interest in our services. We offer a wide range of solutions including web development, mobile app development, and cloud services. Our team of experts is dedicated to delivering high-quality solutions tailored to your specific needs.";

    if (question.position === "start") {
      // For start position, show the follow-up question first
      messages.push({
        type: "system",
        content: "Hello! I'd be happy to help you today.",
      });
      // Follow-up question will be shown separately
    } else if (question.position === "middle") {
      // For middle position, split the AI response
      messages.push({
        type: "system",
        content: aiResponse.split(".")[0] + ".",
      });
      // Follow-up question will be shown in the middle
      // Then the rest of the response will follow user selection
    } else {
      // For end position, show the full AI response first
      messages.push({
        type: "system",
        content: aiResponse,
      });
      // Follow-up question will be shown at the end
    }

    setPreviewMessages(messages);
  };

  const handleOptionSelect = (option: FollowUpOption) => {
    // Add the selected option as a user message
    setPreviewMessages((prev) => [
      ...prev,
      { type: "user", content: option.text },
    ]);

    // Add a simulated AI response
    setTimeout(() => {
      setPreviewMessages((prev) => [
        ...prev,
        {
          type: "system",
          content: `Thank you for selecting "${option.text}". Here's more information about that specific topic...`,
        },
      ]);
    }, 500);
  };

  const refreshPreview = () => {
    if (questions.length > 0) {
      const randomQuestion =
        questions[Math.floor(Math.random() * questions.length)];
      setSelectedQuestion(randomQuestion);
      initializePreview(randomQuestion);
    }
  };

  return (
    <Card className="border overflow-hidden">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-base">Follow-up Question Preview</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No active follow-up questions available for preview.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 h-[300px] overflow-y-auto">
              {/* Chat messages */}
              <div className="space-y-4">
                {previewMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex items-start max-w-[80%] ${msg.type === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <Avatar
                        className={`h-8 w-8 ${msg.type === "user" ? "ml-2" : "mr-2"}`}
                      >
                        {msg.type === "user" ? (
                          <div className="bg-primary text-primary-foreground h-full w-full flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                        ) : (
                          <div className="bg-secondary text-secondary-foreground h-full w-full flex items-center justify-center">
                            <Bot className="h-4 w-4" />
                          </div>
                        )}
                      </Avatar>
                      <div
                        className={`rounded-lg p-3 ${msg.type === "user" ? "bg-primary/10 text-foreground" : "bg-gray-100"}`}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Follow-up question display */}
                {selectedQuestion && (
                  <div className="bg-muted/30 rounded-lg p-3 border border-primary/20 mt-4">
                    <p className="text-sm font-medium mb-2">
                      {selectedQuestion.question}
                    </p>
                    <div className="space-y-2">
                      {selectedQuestion.options.map((option) => (
                        <Button
                          key={option.id}
                          variant="outline"
                          className="w-full justify-start text-left hover:bg-primary/10 hover:text-primary"
                          onClick={() => handleOptionSelect(option)}
                        >
                          {option.text}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Position:{" "}
                <span className="font-medium">
                  {selectedQuestion?.position.charAt(0).toUpperCase() +
                    selectedQuestion?.position.slice(1)}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={refreshPreview}>
                Refresh Preview
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FollowUpQuestionPreview;
