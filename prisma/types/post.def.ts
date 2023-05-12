import { Image, ImageFeed, Like, Post, Share, User } from "./../prismaContext";
import { ImageFeedInclude } from "./image.def";
import { UserFeed, UserFeedInclude, UserStub } from "./user.def";

export type PostCreateProps = {
  content: string;
  authorId: string;
  images?: Image[];
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

export type PostStub = Post & {
  createdat?:     string
  updatedat?:     string
  author:         UserStub
  comment?:       Post | null;
  post_comments:  (Post & { author: User })[];
  likes:          UserStub[];
  shares:         UserStub[];
  images:         Image[];
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
  createdat?: string
  updatedat?: string
  author: UserFeed;
  post_comments: PostStub[];
  likes: UserStub[];
  shares: UserStub[];
  images: ImageFeed[];
};

export const PostDetailInclude = {
  author: { include: UserFeedInclude },
  post_comments: { include: PostFeedInclude },
  likes: { include: { author: true } },
  shares: { include: { author: true } },
  images: { include: ImageFeedInclude },
};
