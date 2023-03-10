import { Image, ImageFeed, Like, Post, Share, User } from "./../prismaContext";
import { ImageFeedInclude } from "./image.def";
import { UserFeed, UserFeedInclude } from "./user.def";

export type PostCreateProps = {
  content: string;
  authorId: string;
  images?: string[];
};

export type PostDeleteProps = {
  postId: string;
  authorId: string;
};

export type PostEngageProps = {
  authorId: string;
  postId: string;
};

export type PostCommentProps = {
  commentId: string;
  authorId: string;
  content: string;
};

export const PostBaseInclude = {
  author: true,
  comment: true,
  post_comments: true,
  likes: true,
  shares: true,
};

type PostComments = Post & {
  author: User;
};

export type PostFeed = Post & {
  author: User;
  comment?: Post | null;
  post_comments: (Post & { author: User })[];
  likes: (Like & { author: User })[];
  shares: (Share & { author: User })[];
  images: Image[];
};

export const PostFeedInclude = {
  author: true,
  comment: true,
  images: true,
  post_comments: { include: { author: true } },
  likes: { include: { author: true } },
  shares: { include: { author: true } },
}

export type PostDetail = Post & {
  author: UserFeed;
  post_comments: PostFeed[];
  likes: (Like & { author: User })[];
  shares: (Share & { author: User })[];
  images: ImageFeed[];
};

export const PostDetailInclude = {
  author: { include: UserFeedInclude },
  post_comments: { include: PostFeedInclude },
  likes: { include: { author: true } },
  shares: { include: { author: true } },
  images: { include: ImageFeedInclude },
};
