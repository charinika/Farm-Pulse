import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MessageSquare, Plus, ThumbsUp, ThumbsDown, CheckCircle, Search, User, Calendar } from "lucide-react";

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  tags: z.string().optional(),
});

const replySchema = z.object({
  content: z.string().min(1, "Reply content is required"),
});

export default function CommunityForum() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  const { data: forumPosts, isLoading, error: postsError } = useQuery({
    queryKey: ["/api/forum/posts", selectedCategory],
    queryFn: async () => {
      const url = selectedCategory === "all" 
        ? "/api/forum/posts"
        : `/api/forum/posts?category=${selectedCategory}`;
      
      const response = await fetch(url, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch forum posts");
      }
      
      return response.json();
    },
  });

  const { data: selectedPostData, isLoading: isLoadingPost } = useQuery({
    queryKey: ["/api/forum/posts", selectedPost],
    queryFn: async () => {
      if (!selectedPost) return null;
      
      const response = await fetch(`/api/forum/posts/${selectedPost}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch post");
      }
      
      return response.json();
    },
    enabled: !!selectedPost,
  });

  const { data: replies } = useQuery({
    queryKey: ["/api/forum/posts", selectedPost, "replies"],
    queryFn: async () => {
      if (!selectedPost) return [];
      
      const response = await fetch(`/api/forum/posts/${selectedPost}/replies`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch replies");
      }
      
      return response.json();
    },
    enabled: !!selectedPost,
  });

  const postForm = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      tags: "",
    },
  });

  const replyForm = useForm<z.infer<typeof replySchema>>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      content: "",
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: z.infer<typeof postSchema>) => {
      await apiRequest("POST", "/api/forum/posts", {
        ...data,
        tags: data.tags ? data.tags.split(",").map(tag => tag.trim()) : [],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      toast({
        title: "Success",
        description: "Post created successfully",
      });
      setIsNewPostOpen(false);
      postForm.reset();
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    },
  });

  const createReplyMutation = useMutation({
    mutationFn: async (data: z.infer<typeof replySchema>) => {
      await apiRequest("POST", `/api/forum/posts/${selectedPost}/replies`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts", selectedPost, "replies"] });
      toast({
        title: "Success",
        description: "Reply posted successfully",
      });
      replyForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to post reply",
        variant: "destructive",
      });
    },
  });

  // Handle unauthorized errors
  useEffect(() => {
    if (postsError && isUnauthorizedError(postsError as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [postsError, toast]);

  const filteredPosts = forumPosts?.filter((post: any) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  }) || [];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "health":
        return "bg-destructive text-destructive-foreground";
      case "nutrition":
        return "bg-success text-success-foreground";
      case "breeding":
        return "bg-secondary text-secondary-foreground";
      case "general":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  if (isLoading) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold text-gray-900">Community Forum</h1>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (selectedPost) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          {/* Back Button */}
          <Button variant="outline" onClick={() => setSelectedPost(null)}>
            ← Back to Forum
          </Button>

          {/* Post Details */}
          {selectedPostData && (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedPostData.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={getCategoryColor(selectedPostData.category)}>
                        {selectedPostData.category}
                      </Badge>
                      {selectedPostData.isResolved && (
                        <Badge className="bg-success text-success-foreground">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Resolved
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {selectedPostData.user?.firstName || selectedPostData.user?.email?.split('@')[0] || "Anonymous"}
                    </div>
                    <div className="flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatTimeAgo(selectedPostData.createdAt)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedPostData.content}</p>
                </div>
                
                {selectedPostData.tags && selectedPostData.tags.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {selectedPostData.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    {selectedPostData.upvotes || 0}
                  </Button>
                  <Button variant="outline" size="sm">
                    <ThumbsDown className="w-4 h-4 mr-1" />
                    {selectedPostData.downvotes || 0}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Replies */}
          <Card>
            <CardHeader>
              <CardTitle>
                Replies ({replies?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {replies && replies.length > 0 ? (
                replies.map((reply: any) => (
                  <div key={reply.id} className="border-l-4 border-primary pl-4 py-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {reply.user?.firstName || reply.user?.email?.split('@')[0] || "Anonymous"}
                        </span>
                        {reply.isBestAnswer && (
                          <Badge className="bg-success text-success-foreground">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Best Answer
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatTimeAgo(reply.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                    <div className="mt-3 flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        {reply.upvotes || 0}
                      </Button>
                      <Button variant="outline" size="sm">
                        <ThumbsDown className="w-3 h-3 mr-1" />
                        {reply.downvotes || 0}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No replies yet. Be the first to reply!</p>
              )}

              {/* Add Reply Form */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Form {...replyForm}>
                  <form onSubmit={replyForm.handleSubmit((data) => createReplyMutation.mutate(data))} className="space-y-4">
                    <FormField
                      control={replyForm.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Reply</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Share your thoughts or answer..." 
                              rows={4}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={createReplyMutation.isPending}>
                      {createReplyMutation.isPending ? "Posting..." : "Post Reply"}
                    </Button>
                  </form>
                </Form>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Community Forum</h1>
            <p className="text-gray-600 mt-2">
              Connect with fellow farmers, ask questions, and share knowledge.
            </p>
          </div>
          <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
              </DialogHeader>
              <Form {...postForm}>
                <form onSubmit={postForm.handleSubmit((data) => createPostMutation.mutate(data))} className="space-y-4">
                  <FormField
                    control={postForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Ask a question or share knowledge..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={postForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="health">Health</SelectItem>
                            <SelectItem value="nutrition">Nutrition</SelectItem>
                            <SelectItem value="breeding">Breeding</SelectItem>
                            <SelectItem value="general">General</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={postForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your question or share your knowledge in detail..." 
                            rows={6}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={postForm.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="cattle, medicine, vaccination (comma separated)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsNewPostOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createPostMutation.isPending}>
                      {createPostMutation.isPending ? "Posting..." : "Create Post"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="nutrition">Nutrition</SelectItem>
              <SelectItem value="breeding">Breeding</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Forum Posts */}
        {filteredPosts.length > 0 ? (
          <div className="space-y-4">
            {filteredPosts.map((post: any) => (
              <Card key={post.id} className="hover-lift cursor-pointer" onClick={() => setSelectedPost(post.id)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getCategoryColor(post.category)}>
                          {post.category}
                        </Badge>
                        {post.isResolved && (
                          <Badge className="bg-success text-success-foreground">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Resolved
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{post.title}</h3>
                      <p className="text-gray-600 line-clamp-2">{post.content}</p>
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {post.tags.slice(0, 3).map((tag: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                          {post.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{post.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right text-sm text-gray-500 ml-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {post.user?.firstName || post.user?.email?.split('@')[0] || "Anonymous"}
                      </div>
                      <div className="flex items-center mt-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatTimeAgo(post.createdAt)}
                      </div>
                      <div className="flex items-center space-x-4 mt-3">
                        <div className="flex items-center">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {post.upvotes || 0}
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {post.replyCount || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            {searchQuery || selectedCategory !== "all" ? (
              <>
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No posts found</h3>
                <p className="text-gray-500">Try adjusting your search or filters.</p>
              </>
            ) : (
              <>
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                <p className="text-gray-500 mb-4">Be the first to start a discussion in the community forum.</p>
                <Button onClick={() => setIsNewPostOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Post
                </Button>
              </>
            )}
          </div>
        )}

        {/* Community Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Community Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Be Respectful</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Treat all members with respect and kindness</li>
                  <li>• Share knowledge and experiences constructively</li>
                  <li>• Help create a welcoming environment for everyone</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Stay on Topic</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Keep discussions related to livestock and farming</li>
                  <li>• Use appropriate categories for your posts</li>
                  <li>• Search before posting to avoid duplicates</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
