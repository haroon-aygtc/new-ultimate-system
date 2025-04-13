import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import GuestRegistrationForm from "./GuestRegistrationForm";
import {
  generateAIResponse,
  processFollowUpQuestion,
} from "@/services/aiResponseService";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  followUpQuestions?: any[];
}

interface ChatWidgetProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  mode?: "floating" | "inline" | "fullscreen";
  brandName?: string;
  brandLogo?: string;
  primaryColor?: string;
  welcomeMessage?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const ChatWidget = ({
  position = "bottom-right",
  mode = "floating",
  brandName = "AI Assistant",
  brandLogo = "https://api.dicebear.com/7.x/avataaars/svg?seed=assistant",
  primaryColor = "#4A6FA5",
  welcomeMessage = "Hello! How can I help you today?",
  isOpen = false,
  onClose = () => {},
}: ChatWidgetProps) => {
  const [open, setOpen] = useState(isOpen);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(mode === "fullscreen");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Position classes based on the position prop
  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
  };

  // Size classes based on mode and fullscreen state
  const getSizeClasses = () => {
    if (isFullscreen) {
      return "fixed inset-0 w-full h-full rounded-none z-50";
    }

    if (mode === "inline") {
      return "w-full h-[580px] rounded-lg";
    }

    return `fixed ${positionClasses[position]} w-[380px] h-[580px] rounded-lg shadow-lg z-50`;
  };

  // Add welcome message on first load
  useEffect(() => {
    if (isRegistered && messages.length === 0) {
      setMessages([
        {
          id: "1",
          content: welcomeMessage,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isRegistered, welcomeMessage, messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleToggleChat = () => {
    setOpen(!open);
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInput("");

    try {
      // Generate real AI response using the template system
      const userId = "guest-" + Date.now().toString();
      const sessionId = "session-" + Date.now().toString();

      const { response, followUpQuestions, error } = await generateAIResponse(
        input,
        userId,
        sessionId,
        {
          user_name: "Guest",
          conversation_history: messages
            .map((m) => `${m.sender}: ${m.content}`)
            .join("\n"),
        },
      );

      if (error) throw error;

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          response || "I'm sorry, I couldn't generate a response at this time.",
        sender: "bot",
        timestamp: new Date(),
        followUpQuestions: followUpQuestions,
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error generating AI response:", error);

      // Fallback response in case of error
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm sorry, I encountered an error while processing your request. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  // Handle follow-up question selection
  const handleFollowUpSelection = async (question: any) => {
    // Add user message with the selected follow-up
    const userMessage: Message = {
      id: Date.now().toString(),
      content: question.question,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      // Process the follow-up question
      const userId = "guest-" + Date.now().toString();
      const sessionId = "session-" + Date.now().toString();

      const { response, error } = await processFollowUpQuestion(
        question.id,
        userId,
        sessionId,
      );

      if (error) throw error;

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          response || "I'm sorry, I couldn't generate a response at this time.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error processing follow-up question:", error);

      // Fallback response
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm sorry, I encountered an error while processing your follow-up question.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleRegistrationComplete = (data: {
    fullName: string;
    phoneNumber: string;
    email?: string;
  }) => {
    setIsRegistered(true);
    // In a real implementation, you would save this data to your backend
    console.log("Registration complete:", data);
  };

  // Chat toggle button (only shown in floating mode)
  const renderChatButton = () => {
    if (mode !== "floating" || open) return null;

    return (
      <motion.button
        className="fixed bottom-4 right-4 w-14 h-14 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-lg z-40"
        style={{ backgroundColor: primaryColor }}
        onClick={handleToggleChat}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
      >
        <MessageCircle size={24} />
      </motion.button>
    );
  };

  // Main chat widget
  const renderChatWidget = () => {
    if (mode !== "floating" || open) {
      return (
        <motion.div
          className={`bg-background ${getSizeClasses()}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border-0 h-full flex flex-col bg-white">
            <CardHeader
              className="flex flex-row items-center justify-between py-3 px-4 border-b"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={brandLogo} alt={brandName} />
                  <AvatarFallback>{brandName.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-medium text-white">{brandName}</h3>
              </div>
              <div className="flex items-center space-x-1">
                {mode === "floating" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleFullscreen}
                    className="text-white hover:bg-white/20"
                  >
                    {isFullscreen ? (
                      <Minimize2 size={18} />
                    ) : (
                      <Maximize2 size={18} />
                    )}
                  </Button>
                )}
                {mode === "floating" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleChat}
                    className="text-white hover:bg-white/20"
                  >
                    <X size={18} />
                  </Button>
                )}
              </div>
            </CardHeader>

            {!isRegistered ? (
              <CardContent className="flex-1 p-4 flex items-center justify-center">
                <GuestRegistrationForm
                  onSubmit={handleRegistrationComplete}
                  isLoading={false}
                />
              </CardContent>
            ) : (
              <>
                <CardContent className="flex-1 p-0 overflow-hidden">
                  <ScrollArea className="h-full p-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`mb-4 ${message.sender === "user" ? "flex justify-end" : "flex justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.sender === "user"
                              ? "bg-brand-primary text-white ml-auto"
                              : "bg-brand-light text-brand-secondary"
                          }`}
                          style={
                            message.sender === "user"
                              ? { backgroundColor: primaryColor }
                              : {}
                          }
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </ScrollArea>
                </CardContent>

                <CardFooter className="p-3 border-t">
                  <div className="flex w-full items-center space-x-2">
                    <Textarea
                      placeholder="Type your message..."
                      className="min-h-10 flex-1 resize-none"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
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
                      className="bg-brand-primary hover:bg-brand-primary/90"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                </CardFooter>
              </>
            )}
          </Card>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <>
      {renderChatButton()}
      <AnimatePresence>{renderChatWidget()}</AnimatePresence>
    </>
  );
};

export default ChatWidget;
