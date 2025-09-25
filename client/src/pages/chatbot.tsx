import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await res.json();
      const reply: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.reply || "Sorry, I couldn't respond.",
      };

      setMessages((prev) => [...prev, reply]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Error: Could not reach server.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen border shadow-lg bg-white relative">
      
      <div className="p-4 border-b bg-primary text-primary-foreground font-semibold text-lg rounded-t-none">
  Farm AI Assistant
</div>

      
      <div
        className="flex-1 relative overflow-y-auto p-4 space-y-3 bg-gray-100"
        style={{ paddingBottom: "6rem" }}
      >
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] p-3 text-sm rounded-xl shadow ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-white text-gray-900"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-xl shadow text-sm animate-pulse">
              AI is typing...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      
      <form
        onSubmit={handleSendMessage}
        className="absolute left-0 right-0 px-4 flex space-x-2 bg-gray-50 rounded-t-xl"
        style={{ bottom: "3rem" }}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about your farm..."
          className="flex-1"
          disabled={loading}
        />
        <Button
          type="submit"
          disabled={!input.trim() || loading}
          className="bg-primary hover:bg-primary/90"
        >
          <Send className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
}
