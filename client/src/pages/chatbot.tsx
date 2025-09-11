import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, User, Send, Loader2 } from "lucide-react";

interface ChatbotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export default function ChatbotPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // load/create a conversation automatically
  const { data: conversations } = useQuery({
    queryKey: ["/api/chatbot/conversations"],
    onSuccess: (data) => {
      if (data && data.length > 0 && !selectedConversationId) {
        setSelectedConversationId(data[0].id);
      }
    },
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
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: ["/api/chatbot/conversations"] });
      setSelectedConversationId(conversation.id);
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest(
        "POST",
        `/api/chatbot/conversations/${selectedConversationId}/messages`,
        { content }
      );
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-create conversation if none exists
  useEffect(() => {
    if (conversations && conversations.length === 0) {
      createConversationMutation.mutate();
    }
  }, [conversations]);

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto border rounded-lg">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoadingMessages ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          messages?.map((msg: ChatbotMessage) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-lg text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {sendMessageMutation.isPending && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg flex items-center space-x-2">
              <Bot className="w-4 h-4 text-gray-500" />
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSendMessage} className="border-t p-3 flex space-x-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          disabled={sendMessageMutation.isPending}
        />
        <Button type="submit" disabled={!message.trim() || sendMessageMutation.isPending}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
