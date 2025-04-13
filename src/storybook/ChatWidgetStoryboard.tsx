import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, Bot, X } from "lucide-react";

const ChatWidgetStoryboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState("");

  // Mock data for the chat widget
  const mockSettings = {
    primaryColor: "#4A6FA5",
    widgetTitle: "Chat with us",
    welcomeMessage: "Hello! How can we assist you today?",
    inputPlaceholder: "Type your message...",
    cornerRadius: 8,
    headerOpacity: 100,
    showAvatar: true,
    brandName: "GuestApp",
  };

  const mockMessages = [
    {
      id: "1",
      content: mockSettings.welcomeMessage,
      sender: "ai",
      timestamp: new Date(Date.now() - 60000).toISOString(),
    },
    {
      id: "2",
      content: "Hi, I have a question about your services.",
      sender: "guest",
      timestamp: new Date(Date.now() - 45000).toISOString(),
    },
    {
      id: "3",
      content:
        "Of course! I'd be happy to help. What would you like to know about our services?",
      sender: "ai",
      timestamp: new Date(Date.now() - 30000).toISOString(),
    },
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // In a real implementation, this would send the message
    setMessage("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="relative">
        {isOpen && (
          <Card
            className="w-80 md:w-96 shadow-lg overflow-hidden"
            style={{
              borderRadius: `${mockSettings.cornerRadius}px`,
            }}
          >
            <div
              className="p-3 flex items-center justify-between"
              style={{
                backgroundColor: mockSettings.primaryColor,
                opacity: mockSettings.headerOpacity / 100,
              }}
            >
              <div className="flex items-center space-x-2">
                {mockSettings.showAvatar && (
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs">
                    {mockSettings.brandName.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <span className="text-white font-medium">
                  {mockSettings.widgetTitle}
                </span>
              </div>
              <button
                className="text-white/80 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <CardContent className="p-0">
              <div className="h-80 overflow-y-auto p-3 flex flex-col space-y-3">
                {mockMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "ai" ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-[80%] ${msg.sender === "ai" ? "" : "flex-row-reverse space-x-reverse"}`}
                    >
                      <div
                        className={`p-1 rounded-full ${msg.sender === "ai" ? "bg-primary/10" : "bg-muted"}`}
                      >
                        {msg.sender === "ai" ? (
                          <Bot className="h-5 w-5 text-primary" />
                        ) : (
                          <User className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div
                        className={`p-3 rounded-lg ${msg.sender === "ai" ? "bg-muted" : "bg-primary text-primary-foreground"}`}
                      >
                        <p>{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t flex items-center space-x-2">
                <Input
                  placeholder={mockSettings.inputPlaceholder}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  style={{ backgroundColor: mockSettings.primaryColor }}
                >
                  <Send className="h-4 w-4 text-white" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!isOpen && (
          <Button
            className="rounded-full h-14 w-14 shadow-lg"
            style={{ backgroundColor: mockSettings.primaryColor }}
            onClick={() => setIsOpen(true)}
          >
            <MessageSquare className="h-6 w-6 text-white" />
          </Button>
        )}
      </div>
    </div>
  );
};

// Helper component for the MessageSquare icon
const MessageSquare = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

export default ChatWidgetStoryboard;
