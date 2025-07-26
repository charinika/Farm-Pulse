import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Bot, User, Send, Plus, MessageCircle, Loader2 } from "lucide-react";
import Layout from "@/components/layout/layout";

interface ChatbotConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatbotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export default function ChatbotPage() {
  const { user } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversations, isLoading: isLoadingConversations } = useQuery({
    queryKey: ["/api/chatbot/conversations"],
  });

  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["/api/chatbot/conversations", selectedConversationId, "messages"],
    enabled: !!selectedConversationId,
  });

  const createConversationMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/chatbot/conversations", {
        title: "New Conversation",
      });
      return await res.json();
    },
    onSuccess: (conversation: ChatbotConversation) => {
      queryClient.invalidateQueries({ queryKey: ["/api/chatbot/conversations"] });
      setSelectedConversationId(conversation.id);
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", `/api/chatbot/conversations/${selectedConversationId}/messages`, {
        content,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/chatbot/conversations", selectedConversationId, "messages"],
      });
      setMessage("");
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedConversationId || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate(message.trim());
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-select first conversation if none selected
  useEffect(() => {
    if (conversations && conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Conversations Sidebar */}
        <div className="w-80 border-r bg-gray-50 flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <Bot className="w-5 h-5 mr-2" />
                FarmCare AI
              </h2>
              <Button
                size="sm"
                onClick={() => createConversationMutation.mutate()}
                disabled={createConversationMutation.isPending}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Get expert advice on livestock health and farm management
            </p>
          </div>

          <ScrollArea className="flex-1">
            {isLoadingConversations ? (
              <div className="p-4 flex justify-center">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            ) : conversations && conversations.length > 0 ? (
              <div className="p-2">
                {conversations.map((conversation: ChatbotConversation) => (
                  <Button
                    key={conversation.id}
                    variant={selectedConversationId === conversation.id ? "secondary" : "ghost"}
                    className="w-full mb-2 justify-start h-auto p-3"
                    onClick={() => setSelectedConversationId(conversation.id)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    <div className="text-left flex-1 min-w-0">
                      <div className="truncate font-medium">
                        {conversation.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(conversation.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center">
                <p className="text-gray-500 mb-4">No conversations yet</p>
                <Button
                  onClick={() => createConversationMutation.mutate()}
                  disabled={createConversationMutation.isPending}
                >
                  Start Your First Chat
                </Button>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversationId ? (
            <>
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                {isLoadingMessages ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : messages && messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((msg: ChatbotMessage) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[80%] ${msg.role === "user" ? "order-2" : "order-1"}`}>
                          <div
                            className={`p-3 rounded-lg ${
                              msg.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <div className="whitespace-pre-wrap">{msg.content}</div>
                          </div>
                          <div className={`text-xs text-gray-500 mt-1 ${
                            msg.role === "user" ? "text-right" : "text-left"
                          }`}>
                            {formatTime(msg.createdAt)}
                          </div>
                        </div>
                        <div className={`flex items-end ${msg.role === "user" ? "order-1 mr-2" : "order-2 ml-2"}`}>
                          {msg.role === "user" ? (
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-primary-foreground" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {sendMessageMutation.isPending && (
                      <div className="flex justify-start">
                        <div className="flex items-end">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-2">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-gray-100 p-3 rounded-lg">
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <Bot className="w-16 h-16 mb-4 text-green-500" />
                    <h3 className="text-lg font-medium mb-2">FarmCare AI Assistant</h3>
                    <p className="text-center max-w-md mb-4">
                      I'm here to help with livestock health questions, farm management advice, 
                      disease diagnosis, nutrition guidance, and more. What would you like to know?
                    </p>
                    <div className="text-sm bg-gray-50 p-3 rounded-lg max-w-md">
                      <strong>Try asking:</strong>
                      <ul className="mt-2 space-y-1">
                        <li>• "My cow has been limping, what should I check?"</li>
                        <li>• "What vaccinations do my sheep need?"</li>
                        <li>• "How often should I deworm my cattle?"</li>
                      </ul>
                    </div>
                  </div>
                )}
              </ScrollArea>

              {/* Message Input */}
              <div className="border-t p-4">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask about livestock health, nutrition, diseases..."
                    className="flex-1"
                    disabled={sendMessageMutation.isPending}
                  />
                  <Button
                    type="submit"
                    disabled={!message.trim() || sendMessageMutation.isPending}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Bot className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <h3 className="text-lg font-medium mb-2">Welcome to FarmCare AI</h3>
                <p>Select a conversation or start a new one to begin chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}