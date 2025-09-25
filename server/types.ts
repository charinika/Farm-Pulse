export interface User {
  id: number;
  firstName?: string;
  email: string;
}

export interface Reply {
  id: number;
  content: string;
  createdAt: string;
  user: User;
  isBestAnswer?: boolean;
  upvotes?: number;
  downvotes?: number;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  tags?: string[];
  createdAt: string;
  user: User;
  isResolved?: boolean;
  upvotes?: number;
  downvotes?: number;
  replies: Reply[];
}
