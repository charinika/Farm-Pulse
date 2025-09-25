// client/src/components/forum/ForumPostCard.tsx
import { Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ForumPostCardProps = {
  post: {
    id: string;
    title: string;
    content: string;
    author?: string;
    category?: string;
    tags?: string[];
  };
  onSelect: () => void;
};

export default function ForumPostCard({ post, onSelect }: ForumPostCardProps) {
  return (
    <div
      className="border rounded-lg p-4 bg-white shadow hover:shadow-md cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">{post.author || "Anonymous"}</span>
        {post.category && (
          <span className="text-xs px-2 py-1 rounded bg-gray-100">{post.category}</span>
        )}
      </div>

      <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-4">{post.content}</p>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation(); // prevent opening post details
            console.log("Liked post:", post.id);
          }}
        >
          <Heart className="w-4 h-4 mr-1" /> Like
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            console.log("Comment on post:", post.id);
          }}
        >
          <MessageCircle className="w-4 h-4 mr-1" /> Comment
        </Button>
      </div>
    </div>
  );
}
