import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, CheckCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import ReplyCard from "./ReplyCard";
import ReplyForm from "./ReplyForm";

interface Props {
  postId: string;
  goBack: () => void;
}

export default function PostDetails({ postId, goBack }: Props) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isResolved, setIsResolved] = useState(false);

  const { data: post, isLoading } = useQuery({
    queryKey: ["/api/forum/posts", postId],
    queryFn: async () => {
      const res = await fetch(`/api/forum/posts/${postId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch post");
      return res.json();
    },
  });

  const { data: replies } = useQuery({
    queryKey: ["/api/forum/posts", postId, "replies"],
    queryFn: async () => {
      const res = await fetch(`/api/forum/posts/${postId}/replies`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch replies");
      return res.json();
    },
  });

  const markResolvedMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/forum/posts/${postId}/resolve`);
    },
    onSuccess: () => {
      setIsResolved(true);
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts", postId] });
      toast({ title: "Post marked as resolved" });
    },
    onError: () => toast({ title: "Failed to mark resolved", variant: "destructive" }),
  });

  if (isLoading) return <div>Loading post...</div>;

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
      <Button variant="outline" onClick={goBack}>← Back to Forum</Button>

      {post && (
        <Card>
          <CardHeader className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{post.title}</CardTitle>
              <div className="flex items-center space-x-2 mt-2">
                <Badge>{post.category}</Badge>
                {(post.isResolved || isResolved) && (
                  <Badge className="bg-success text-success-foreground">
                    <CheckCircle className="w-3 h-3 mr-1" /> Resolved
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div className="flex items-center"><User className="w-4 h-4 mr-1" /> {post.user?.firstName || "Anonymous"}</div>
              <div className="flex items-center mt-1"><Calendar className="w-4 h-4 mr-1" /> {new Date(post.createdAt).toLocaleString()}</div>
              {!post.isResolved && !isResolved && (
                <Button size="sm" className="mt-2" onClick={() => markResolvedMutation.mutate()}>Mark Resolved</Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
          </CardContent>
        </Card>
      )}

      {/* Replies */}
      <div className="space-y-4">
        {replies?.map((reply: any) => (
          <ReplyCard key={reply.id} reply={reply} postId={postId} />
        ))}

        <ReplyForm postId={postId} />
      </div>
    </main>
  );
}
