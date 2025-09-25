import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const replySchema = z.object({ content: z.string().min(1, "Reply content is required") });

interface Props { postId: string }

export default function ReplyForm({ postId }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof replySchema>>({
    resolver: zodResolver(replySchema),
    defaultValues: { content: "" },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof replySchema>) => {
      await apiRequest("POST", `/api/forum/posts/${postId}/replies`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts", postId, "replies"] });
      form.reset();
      toast({ title: "Reply posted" });
    },
    onError: () => toast({ title: "Failed to post reply", variant: "destructive" }),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-3">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Reply</FormLabel>
              <FormControl>
                <Textarea placeholder="Share your answer..." rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Posting..." : "Post Reply"}</Button>
      </form>
    </Form>
  );
}
