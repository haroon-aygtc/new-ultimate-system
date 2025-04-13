import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft, Send, User, Bot } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  getGuestSessionById,
  getGuestSessionMessages,
  addGuestSessionMessage,
  updateGuestSessionStatus,
} from "@/services/guestSessionService";
import { GuestSession, GuestMessage } from "@/types";

const GuestSessionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [session, setSession] = useState<GuestSession | null>(null);
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadSessionData = async () => {
      setIsLoading(true);
      try {
        // Load session details
        const { data: sessionData, error: sessionError } =
          await getGuestSessionById(id);
        if (sessionError) throw sessionError;
        if (sessionData) setSession(sessionData);

        // Load session messages
        const { data: messagesData, error: messagesError } =
          await getGuestSessionMessages(id);
        if (messagesError) throw messagesError;
        if (messagesData) setMessages(messagesData);
      } catch (error) {
        console.error("Error loading session data:", error);
        toast({
          title: "Error",
          description: "Could not load session data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSessionData();
  }, [id, toast]);

  useEffect(() => {
    // Scroll to bottom of messages when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!id || !newMessage.trim() || !session) return;

    setIsSending(true);
    try {
      // Send the message as admin
      const { data, error } = await addGuestSessionMessage(
        id,
        newMessage.trim(),
        "ai", // Sending as AI/admin
        { sent_by_admin: true },
      );

      if (error) throw error;
      if (data) {
        setMessages([...messages, data]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Could not send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleStatusChange = async (
    status: "active" | "inactive" | "completed",
  ) => {
    if (!id || !session) return;

    try {
      const { success, error } = await updateGuestSessionStatus(id, status);
      if (error) throw error;
      if (success) {
        setSession({ ...session, status });
        toast({
          title: "Status Updated",
          description: `Session status changed to ${status}.`,
        });
      }
    } catch (error) {
      console.error("Error updating session status:", error);
      toast({
        title: "Error",
        description: "Could not update session status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-amber-100 text-amber-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/guest-sessions")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Guest Session</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading session...</span>
        </div>
      ) : !session ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Session not found or has been deleted.
            </p>
            <Button
              className="mt-4"
              onClick={() => navigate("/guest-sessions")}
            >
              Back to Sessions
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Session Info */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Session Info</CardTitle>
              <CardDescription>
                Details about this guest session.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Guest Name
                </h3>
                <p className="font-medium">{session.name}</p>
              </div>

              {session.email && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Email
                  </h3>
                  <p>{session.email}</p>
                </div>
              )}

              {session.phone && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Phone
                  </h3>
                  <p>{session.phone}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Status
                </h3>
                <Badge className={getStatusColor(session.status)}>
                  {session.status.charAt(0).toUpperCase() +
                    session.status.slice(1)}
                </Badge>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Created At
                </h3>
                <p>{new Date(session.created_at).toLocaleString()}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Last Active
                </h3>
                <p>{new Date(session.last_active).toLocaleString()}</p>
              </div>

              <div className="pt-4">
                <h3 className="text-sm font-medium mb-2">Change Status</h3>
                <Select
                  value={session.status}
                  onValueChange={(value) =>
                    handleStatusChange(
                      value as "active" | "inactive" | "completed",
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Chat Messages */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Conversation</CardTitle>
              <CardDescription>Chat history with this guest.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-4 h-[500px] overflow-y-auto flex flex-col space-y-4">
                {messages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-muted-foreground">No messages yet.</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_type === "ai" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex items-start space-x-2 max-w-[80%] ${message.sender_type === "ai" ? "flex-row-reverse space-x-reverse" : ""}`}
                      >
                        <div
                          className={`p-1 rounded-full ${message.sender_type === "ai" ? "bg-primary/10" : "bg-muted"}`}
                        >
                          {message.sender_type === "ai" ? (
                            <Bot className="h-5 w-5 text-primary" />
                          ) : (
                            <User className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div
                          className={`p-3 rounded-lg ${message.sender_type === "ai" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex w-full space-x-2">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                  disabled={session.status !== "active"}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={
                    !newMessage.trim() ||
                    isSending ||
                    session.status !== "active"
                  }
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GuestSessionDetail;
