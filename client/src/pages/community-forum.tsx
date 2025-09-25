// client/src/pages/community-forum.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import NewPostModal from "@/components/forum/NewPostModal";

// Types
type Post = {
  id: number;
  userId: number;
  title: string;
  body: string; // post description
  likes: number;
};

type Comment = {
  id: number;
  postId: number;
  userId: number;
  body: string;
};

export default function CommunityForum() {
  const queryClient = useQueryClient();
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);

 
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["forumPosts"],
    queryFn: async () => {
      const res = await fetch("/api/forum/posts", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
  });

  
  const likeMutation = useMutation({
    mutationFn: async (postId: number) => {
      const res = await fetch(`/api/forum/posts/${postId}/like`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to like post");
      return res.json();
    },
    onSuccess: (updatedPost: Post) => {
      queryClient.setQueryData<Post[]>(["forumPosts"], (old) =>
        old?.map((p) => (p.id === updatedPost.id ? updatedPost : p))
      );
    },
  });

  
  const deleteMutation = useMutation({
    mutationFn: async (postId: number) => {
      const res = await fetch(`/api/forum/posts/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete post");
      return postId;
    },
    onSuccess: (deletedPostId) => {
      queryClient.setQueryData<Post[]>(["forumPosts"], (old) =>
        old?.filter((p) => p.id !== deletedPostId)
      );
    },
  });

  if (isLoading) return <p className="p-4">Loading forum...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Community Forum</h1>
        <div className="flex items-center gap-2">
          <NewPostModal
            open={isNewPostOpen}
            setOpen={setIsNewPostOpen}
            onPostCreated={(newPost: Post) =>
              queryClient.setQueryData<Post[]>(["forumPosts"], (old) =>
                old ? [newPost, ...old] : [newPost]
              )
            }
          />
          <Button onClick={() => setIsNewPostOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      
      <div className="space-y-4">
        {posts?.map((post) => (
          <Card key={post.id} className="p-4">
            <p className="text-sm text-gray-500 mb-2">👤 Anonymous</p>
            <h2 className="font-semibold">{post.title}</h2>
            
            <p className="text-gray-700 mb-3">{post.body}</p>

            
            <div className="flex gap-4 text-sm text-gray-500">
              
              <button onClick={() => likeMutation.mutate(post.id)}>
                👍 Like ({post.likes || 0})
              </button>
              
              <button
                onClick={() =>
                  setExpandedPostId(expandedPostId === post.id ? null : post.id)
                }
              >
                💬 {expandedPostId === post.id ? "Hide" : "Show"} Comments
              </button>
              
              <button
                className="text-red-500"
                onClick={() => deleteMutation.mutate(post.id)}
              >
                🗑 Delete
              </button>
            </div>

            
            {expandedPostId === post.id && <CommentsSection postId={post.id} />}
          </Card>
        ))}
      </div>
    </div>
  );
}


function CommentsSection({ postId }: { postId: number }) {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");

  const { data: comments, isLoading } = useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const res = await fetch(`/api/forum/posts/${postId}/comments`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch comments");
      return res.json();
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async (body: string) => {
      const res = await fetch(`/api/forum/posts/${postId}/comments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      if (!res.ok) throw new Error("Failed to add comment");
      return res.json();
    },
    onSuccess: (newCommentData: Comment) => {
      queryClient.setQueryData<Comment[]>(["comments", postId], (old) =>
        old ? [...old, newCommentData] : [newCommentData]
      );
      setNewComment("");
    },
  });

  if (isLoading)
    return <p className="mt-2 text-sm text-gray-500">Loading comments...</p>;

  return (
    <div className="mt-3 border-t pt-2 space-y-2">
      {comments?.map((c) => (
        <div key={c.id} className="text-sm flex justify-between items-start">
          <div>
            <p className="font-semibold">Anonymous</p>
            <p className="text-gray-700">{c.body}</p>
          </div>
          
          <button
            className="text-red-500 ml-2"
            onClick={async () => {
              await fetch(`/api/forum/posts/${postId}/comments/${c.id}`, {
                method: "DELETE",
                credentials: "include",
              });
              queryClient.setQueryData<Comment[]>(["comments", postId], (old) =>
                old?.filter((com) => com.id !== c.id)
              );
            }}
          >
            🗑
          </button>
        </div>
      ))}
      
      <div className="flex gap-2 mt-2">
        <Input
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button onClick={() => addCommentMutation.mutate(newComment)}>Comment</Button>
      </div>
    </div>
  );
}
