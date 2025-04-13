import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Plus, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function FollowUpQuestionStoryboard() {
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
  const [newQuestion, setNewQuestion] = useState("");

  const handleSelectQuestion = (question) => {
    setUserInput(question);
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;

    const newQuestions = [
      ...questions,
      {
        id: `temp-${Date.now()}`,
        prompt_id: "prompt-1",
        question: newQuestion,
        order: questions.length + 1,
        created_at: new Date().toISOString(),
      },
    ];

    setQuestions(newQuestions);
    setNewQuestion("");
  };

  return (
    <div className="bg-white min-h-screen p-6 flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Follow-up Questions</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Follow-up Question Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Input
                placeholder="Enter a follow-up question..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />
              <Button onClick={handleAddQuestion}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((question, index) => (
                    <TableRow key={question.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{question.question}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={index === questions.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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

              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Suggested questions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {questions.map((question) => (
                    <button
                      key={question.id}
                      onClick={() => handleSelectQuestion(question.question)}
                      className="text-sm px-3 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-colors text-left"
                    >
                      {question.question}
                    </button>
                  ))}
                </div>
              </div>
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
