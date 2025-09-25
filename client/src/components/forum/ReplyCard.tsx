import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ThumbsUp, ThumbsDown, User } from "lucide-react";

interface Props {
  reply: any;
  postId: string;
}

export default function ReplyCard({ reply, postId }: Props) {
  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: async (type: "up" | "down") => {
      await apiRequest("POST", `/api/forum/posts/${postId}/replies/${reply.id}/vote`, { type });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/forum/posts", postId, "replies"] }),
  });

  const markBestMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/forum/posts/${postId}/replies/${reply.id}/best`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/forum/posts", postId, "replies"] }),
  });

  return (
    <div className="border-l-4 border-primary pl-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-900">{reply.user?.firstName || "Anonymous"}</span>
          {reply.isBestAnswer && (
            <Badge className="bg-success text-success-foreground">
              <CheckCircle className="w-3 h-3 mr-1" /> Best Answer
            </Badge>
          )}
        </div>
        <span className="text-sm text-gray-500">{new Date(reply.createdAt).toLocaleString()}</span>
      </div>
      <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
      <div className="mt-2 flex items-center space-x-2">
        <Button size="sm" variant="outline" onClick={() => voteMutation.mutate("up")}>
          <ThumbsUp className="w-3 h-3 mr-1" /> {reply.upvotes || 0}
        </Button>
        <Button size="sm" variant="outline" onClick={() => voteMutation.mutate("down")}>
          <ThumbsDown className="w-3 h-3 mr-1" /> {reply.downvotes || 0}
        </Button>
        {!reply.isBestAnswer && (
          <Button size="sm" variant="outline" onClick={() => markBestMutation.mutate()}>
            Mark Best
          </Button>
        )}
      </div>
    </div>
  );
}
