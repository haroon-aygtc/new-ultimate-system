import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Bot, X, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { GuestUser, ChatMessage, GuestSession } from "@/types/guestSession";
import GuestRegistrationForm from "./GuestRegistrationForm";

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

interface ChatWidgetProps {
  initialOpen?: boolean;
  title?: string;
  subtitle?: string;
  position?: "bottom-right" | "bottom-left";
  width?: number;
  height?: number;
}

const ChatWidgetWithFollowUp: React.FC<ChatWidgetProps> = ({
  initialOpen = false,
  title = "Chat Support",
  subtitle = "How can we help you today?",
  position = "bottom-right",
  width = 380,
  height = 580,
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState<GuestUser | null>(null);
  const [session, setSession] = useState<GuestSession | null>(null);
  const [followUpQuestions, setFollowUpQuestions] = useState<
    FollowUpQuestion[]
  >([]);
  const [currentFollowUpQuestion, setCurrentFollowUpQuestion] =
    useState<FollowUpQuestion | null>(null);
  const [activeModelId, setActiveModelId] = useState("gpt-4"); // Default model
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch active AI model
  useEffect(() => {
    const fetchActiveModel = async () => {
      try {
        const { data, error } = await supabase
          .from("ai_models")
          .select("id")
          .eq("status", "Active")
          .single();

        if (error) throw error;
        if (data) setActiveModelId(data.id);
      } catch (error) {
        console.error("Error fetching active AI model:", error);
      }
    };

    fetchActiveModel();
  }, []);

  // Fetch follow-up questions for the active model
  useEffect(() => {
    if (activeModelId) {
      const fetchFollowUpQuestions = async () => {
        try {
          const { data, error } = await supabase
            .from("follow_up_questions")
            .select("*")
            .eq("ai_model_id", activeModelId)
            .eq("is_active", true);

          if (error) throw error;
          setFollowUpQuestions(data || []);
        } catch (error) {
          console.error("Error fetching follow-up questions:", error);
        }
      };

      fetchFollowUpQuestions();
    }
  }, [activeModelId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !session) return;

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      session_id: session.id,
      content: message,
      sender_type: "user",
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    try {
      // Save user message to database
      const { error: saveError } = await supabase
        .from("chat_messages")
        .insert([userMessage]);

      if (saveError) throw saveError;

      // Get knowledge base articles for context
      const { data: knowledgeData, error: knowledgeError } = await supabase
        .from("knowledge_base_articles")
        .select("content")
        .eq("ai_model_id", activeModelId)
        .eq("is_active", true);

      if (knowledgeError) throw knowledgeError;

      // Simulate AI response with knowledge base context
      setTimeout(async () => {
        const knowledgeContext = knowledgeData
          ? knowledgeData.map((article) => article.content).join("\n\n")
          : "";

        // In a real implementation, you would send the message to your AI service
        // along with the knowledge context
        const aiResponse = generateAIResponse(message, knowledgeContext);

        // Select a follow-up question based on the message content and position
        const selectedQuestion = selectFollowUpQuestion(message, "end");
        setCurrentFollowUpQuestion(selectedQuestion);

        // Add AI response to chat
        const botMessage: ChatMessage = {
          id: Date.now().toString(),
          session_id: session.id,
          content: aiResponse,
          sender_type: "system",
          created_at: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);

        // Save AI response to database
        const { error: saveResponseError } = await supabase
          .from("chat_messages")
          .insert([botMessage]);

        if (saveResponseError) throw saveResponseError;
      }, 1500);
    } catch (error) {
      console.error("Error processing message:", error);
      setIsTyping(false);
    }
  };

  const handleFollowUpSelection = async (option: FollowUpOption) => {
    if (!session || !currentFollowUpQuestion) return;

    // Add selected follow-up as user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      session_id: session.id,
      content: option.text,
      sender_type: "user",
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentFollowUpQuestion(null);
    setIsTyping(true);

    try {
      // Save user message to database
      const { error: saveError } = await supabase
        .from("chat_messages")
        .insert([userMessage]);

      if (saveError) throw saveError;

      // Simulate AI response
      setTimeout(async () => {
        // In a real implementation, you would send the follow-up selection to your AI service
        const aiResponse = generateFollowUpResponse(
          option.text,
          currentFollowUpQuestion.question,
        );

        // Select a new follow-up question
        const selectedQuestion = selectFollowUpQuestion(option.text, "end");
        setCurrentFollowUpQuestion(selectedQuestion);

        // Add AI response to chat
        const botMessage: ChatMessage = {
          id: Date.now().toString(),
          session_id: session.id,
          content: aiResponse,
          sender_type: "system",
          created_at: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);

        // Save AI response to database
        const { error: saveResponseError } = await supabase
          .from("chat_messages")
          .insert([botMessage]);

        if (saveResponseError) throw saveResponseError;
      }, 1500);
    } catch (error) {
      console.error("Error processing follow-up selection:", error);
      setIsTyping(false);
    }
  };

  const selectFollowUpQuestion = (
    messageContent: string,
    preferredPosition: "start" | "middle" | "end",
  ): FollowUpQuestion | null => {
    if (followUpQuestions.length === 0) return null;

    // First try to find a question with the preferred position
    const positionQuestions = followUpQuestions.filter(
      (q) => q.position === preferredPosition,
    );

    if (positionQuestions.length > 0) {
      // Select a random question from the preferred position
      return positionQuestions[
        Math.floor(Math.random() * positionQuestions.length)
      ];
    }

    // If no questions with preferred position, select a random question
    return followUpQuestions[
      Math.floor(Math.random() * followUpQuestions.length)
    ];
  };

  const generateAIResponse = (
    userMessage: string,
    knowledgeContext: string,
  ): string => {
    // This is a simple mock response generator
    // In a real implementation, you would call your AI service
    const responses = [
      `Thank you for your question about "${userMessage}". Based on our knowledge base, I can provide you with the following information.`,
      `I understand you're asking about "${userMessage}". Here's what I can tell you based on our information.`,
      `Regarding "${userMessage}", I've found some relevant information that might help you.`,
    ];

    // Add some content based on the knowledge context if available
    let response = responses[Math.floor(Math.random() * responses.length)];

    if (knowledgeContext) {
      // Extract a relevant snippet from the knowledge context
      const contextSample = knowledgeContext.substring(0, 150) + "...";
      response += "\n\n" + contextSample;
    } else {
      response +=
        "\n\nI don't have specific information about this in my knowledge base, but I'd be happy to help you find what you're looking for.";
    }

    return response;
  };

  const generateFollowUpResponse = (
    selectedOption: string,
    question: string,
  ): string => {
    // This is a simple mock response generator for follow-up selections
    const responses = [
      `Thank you for selecting "${selectedOption}" regarding ${question}. Let me provide more details.`,
      `I see you're interested in "${selectedOption}". Here's what I can tell you about that.`,
      `Regarding "${selectedOption}", I have some additional information that might be helpful.`,
    ];

    return (
      responses[Math.floor(Math.random() * responses.length)] +
      "\n\nIs there anything else you'd like to know about this topic?"
    );
  };

  const handleUserRegistration = async (userData: {
    name: string;
    phone: string;
  }) => {
    try {
      // Create a new guest user
      const newUser: GuestUser = {
        id: crypto.randomUUID(),
        name: userData.name,
        phone: userData.phone,
        created_at: new Date().toISOString(),
        last_active_at: new Date().toISOString(),
      };

      const { error: userError } = await supabase
        .from("guest_users")
        .insert([newUser]);

      if (userError) throw userError;

      // Create a new session
      const newSession: GuestSession = {
        id: crypto.randomUUID(),
        user_id: newUser.id,
        status: "active",
        created_at: new Date().toISOString(),
        last_active_at: new Date().toISOString(),
      };

      const { error: sessionError } = await supabase
        .from("guest_sessions")
        .insert([newSession]);

      if (sessionError) throw sessionError;

      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        session_id: newSession.id,
        content: `Hello ${userData.name}! Welcome to our chat support. How can I help you today?`,
        sender_type: "system",
        created_at: new Date().toISOString(),
      };

      const { error: messageError } = await supabase
        .from("chat_messages")
        .insert([welcomeMessage]);

      if (messageError) throw messageError;

      // Update state
      setUser(newUser);
      setSession(newSession);
      setMessages([welcomeMessage]);

      // Select an initial follow-up question
      const initialQuestion = selectFollowUpQuestion("", "start");
      setCurrentFollowUpQuestion(initialQuestion);
    } catch (error) {
      console.error("Error during user registration:", error);
    }
  };

  return (
    <div
      className={`fixed ${position === "bottom-right" ? "right-4" : "left-4"} bottom-4 z-50`}
      style={{ width: `${width}px` }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: `${height}px` }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-2"
          >
            <Card className="w-full h-full flex flex-col overflow-hidden border-brand-primary/20 shadow-lg">
              <CardHeader className="bg-brand-primary text-white py-3 px-4 flex flex-row justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{title}</h3>
                  <p className="text-sm text-white/80">{subtitle}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleChat}
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>

              {!user ? (
                <CardContent className="flex-1 p-4 flex items-center justify-center">
                  <GuestRegistrationForm onSubmit={handleUserRegistration} />
                </CardContent>
              ) : (
                <>
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender_type === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`flex items-start max-w-[80%] ${msg.sender_type === "user" ? "flex-row-reverse" : ""}`}
                          >
                            <Avatar
                              className={`h-8 w-8 ${msg.sender_type === "user" ? "ml-2" : "mr-2"}`}
                            >
                              {msg.sender_type === "user" ? (
                                <div className="bg-brand-accent text-white h-full w-full flex items-center justify-center">
                                  <User className="h-4 w-4" />
                                </div>
                              ) : (
                                <div className="bg-brand-primary text-white h-full w-full flex items-center justify-center">
                                  <Bot className="h-4 w-4" />
                                </div>
                              )}
                            </Avatar>
                            <div
                              className={`rounded-lg p-3 ${msg.sender_type === "user" ? "bg-brand-accent/10 text-brand-secondary" : "bg-gray-100"}`}
                            >
                              <p className="whitespace-pre-line text-sm">
                                {msg.content}
                              </p>
                              <span className="text-xs text-gray-500 block mt-1">
                                {new Date(msg.created_at).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="flex items-start max-w-[80%]">
                            <Avatar className="h-8 w-8 mr-2">
                              <div className="bg-brand-primary text-white h-full w-full flex items-center justify-center">
                                <Bot className="h-4 w-4" />
                              </div>
                            </Avatar>
                            <div className="rounded-lg p-3 bg-gray-100">
                              <div className="flex space-x-1">
                                <div
                                  className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "0ms" }}
                                ></div>
                                <div
                                  className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "300ms" }}
                                ></div>
                                <div
                                  className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "600ms" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {currentFollowUpQuestion && !isTyping && (
                        <div className="bg-brand-light/30 rounded-lg p-3 border border-brand-primary/20">
                          <p className="text-sm font-medium mb-2">
                            {currentFollowUpQuestion.question}
                          </p>
                          <div className="space-y-2">
                            {currentFollowUpQuestion.options.map((option) => (
                              <Button
                                key={option.id}
                                variant="outline"
                                className="w-full justify-start text-left hover:bg-brand-primary/10 hover:text-brand-primary"
                                onClick={() => handleFollowUpSelection(option)}
                              >
                                {option.text}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  <CardFooter className="p-3 border-t">
                    <div className="flex w-full items-center space-x-2">
                      <Textarea
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="min-h-[40px] max-h-[120px] resize-none"
                      />
                      <Button
                        type="submit"
                        size="icon"
                        onClick={handleSendMessage}
                        disabled={!message.trim() || isTyping}
                        className="bg-brand-primary text-white hover:bg-brand-primary/90 h-10 w-10"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={toggleChat}
        className={`${isOpen ? "bg-brand-muted" : "bg-brand-primary"} text-white hover:opacity-90 shadow-lg w-full md:w-auto`}
      >
        {isOpen ? (
          <>
            <ChevronDown className="h-4 w-4 mr-2" /> Close Chat
          </>
        ) : (
          <>
            <ChevronUp className="h-4 w-4 mr-2" /> Chat With Us
          </>
        )}
      </Button>
    </div>
  );
};

export default ChatWidgetWithFollowUp;
