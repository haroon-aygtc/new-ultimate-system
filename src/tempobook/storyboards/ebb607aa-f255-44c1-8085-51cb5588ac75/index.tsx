import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import FollowUpQuestionManager from "@/components/admin/FollowUpQuestionManager";
import FollowUpQuestionPreview from "@/components/admin/FollowUpQuestionPreview";

export default function FollowUpQuestionsStoryboard() {
  const [questions, setQuestions] = useState([
    {
      id: "1",
      prompt_id: "prompt-1",
      question: "How do I reset my password?",
      order: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      prompt_id: "prompt-1",
      question: "What payment methods do you accept?",
      order: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      prompt_id: "prompt-1",
      question: "How can I contact customer support?",
      order: 3,
      created_at: new Date().toISOString(),
    },
  ]);

  const [userInput, setUserInput] = useState("");

  const handleSelectQuestion = (question: string) => {
    setUserInput(question);
  };

  return (
    <div className="bg-white min-h-screen p-6 flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Follow-up Question Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <FollowUpQuestionManager
              questions={questions}
              onChange={setQuestions}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chat Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md p-4 h-[300px] mb-4 overflow-y-auto flex flex-col justify-end">
              <div className="bg-brand-primary/10 p-3 rounded-lg self-start max-w-[80%] mb-2">
                Hello! How can I help you today?
              </div>

              <FollowUpQuestionPreview
                questions={questions}
                onSelectQuestion={handleSelectQuestion}
              />
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
              <Button>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
