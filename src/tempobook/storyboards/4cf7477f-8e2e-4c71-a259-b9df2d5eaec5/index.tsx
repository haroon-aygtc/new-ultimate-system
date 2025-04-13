import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

export default function FollowUpQuestionsDemo() {
  const [messages, setMessages] = useState([
    { role: "system", content: "Hello! How can I help you today?" },
  ]);

  const [userInput, setUserInput] = useState("");
  const [showFollowUp, setShowFollowUp] = useState(true);

  const followUpQuestions = [
    "How do I reset my password?",
    "What payment methods do you accept?",
    "How can I contact customer support?",
  ];

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    // Add user message
    setMessages([...messages, { role: "user", content: userInput }]);
    setUserInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content:
            "Thank you for your question. I've found some information that might help you. Is there anything specific you'd like to know more about?",
        },
      ]);
      setShowFollowUp(true);
    }, 1000);
  };

  const handleFollowUpClick = (question) => {
    // Add selected follow-up as user message
    setMessages([...messages, { role: "user", content: question }]);
    setShowFollowUp(false);

    // Simulate AI response to follow-up
    setTimeout(() => {
      let response = "";
      if (question.includes("password")) {
        response =
          "To reset your password, please click on the 'Forgot Password' link on the login page. You'll receive an email with instructions to create a new password.";
      } else if (question.includes("payment")) {
        response =
          "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers. For enterprise customers, we also offer invoicing options.";
      } else if (question.includes("support")) {
        response =
          "Our customer support team is available 24/7. You can reach us via email at support@example.com, through live chat on our website, or by phone at +1-800-123-4567.";
      }

      setMessages((prev) => [...prev, { role: "system", content: response }]);
      setShowFollowUp(true);
    }, 1000);
  };

  return (
    <div className="bg-white min-h-screen p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>AI Chat with Follow-up Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] overflow-y-auto mb-4 space-y-4 p-4 border rounded-md">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-start max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <Avatar
                    className={`h-8 w-8 ${message.role === "user" ? "ml-2" : "mr-2"}`}
                  >
                    {message.role === "user" ? (
                      <div className="bg-blue-500 text-white h-full w-full flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="bg-purple-500 text-white h-full w-full flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}
                  </Avatar>
                  <div
                    className={`rounded-lg p-3 ${message.role === "user" ? "bg-blue-100" : "bg-gray-100"}`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}

            {showFollowUp && messages.length > 1 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Suggested questions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {followUpQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleFollowUpClick(question)}
                      className="text-sm px-3 py-1.5 rounded-full bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors text-left"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
