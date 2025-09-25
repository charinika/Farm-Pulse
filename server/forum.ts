// server/routes/forum.ts
import express from "express";

const router = express.Router();

// In-memory storage (replace with DB in production)
let posts: {
  id: number;
  userId: number;
  title: string;
  body: string;
  likes: number;
}[] = [];

let comments: {
  id: number;
  postId: number;
  userId: number;
  body: string;
}[] = [];

let postIdCounter = 1;
let commentIdCounter = 1;

// GET all posts
router.get("/posts", (req, res) => {
  res.json(posts);
});

// POST a new post
router.post("/posts", (req, res) => {
  const { title, content } = req.body;
  const newPost = {
    id: postIdCounter++,
    userId: 1, // Replace with real user ID
    title,
    body: content,
    likes: 0,
  };
  posts.unshift(newPost);
  res.json(newPost);
});

// PATCH like a post
router.patch("/posts/:id/like", (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find((p) => p.id === id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  post.likes++;
  res.json(post);
});

// GET comments for a post
router.get("/posts/:id/comments", (req, res) => {
  const postId = parseInt(req.params.id);
  const postComments = comments.filter((c) => c.postId === postId);
  res.json(postComments);
});

// POST a comment
router.post("/posts/:id/comments", (req, res) => {
  const postId = parseInt(req.params.id);
  const { body } = req.body;
  const newComment = {
    id: commentIdCounter++,
    postId,
    userId: 1, // Replace with real user ID
    body,
  };
  comments.push(newComment);
  res.json(newComment);
});

export default router;
