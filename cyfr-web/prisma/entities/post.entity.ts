import { Post, User } from "@prisma/client";
import { PostCommentProps, PostCreateProps, PostDetail, PostEngageProps, PostFeed } from "../types/post.def";
import { log } from "../../utils/log";

const byId = async (id: string): Promise<PostDetail | null> => {
  try {
    return await prisma.post.findFirst({
      where: {
        id: id,
        visible: true
      },
      include: {
       author: true,
       shares: true,
       likes: true,
       post_comments: true
      },
    });
  } catch (error) {
    throw { code: "posts/byId", message: "No posts were returned!" };
  }
};

const all = async (): Promise<PostFeed[] | []> => {
  try {
    return await prisma.post.findMany({
      where: {
        visible: true,
        commentId: null
      },
      include: {
        author: true,
        shares: true,
        likes: true,
        post_comments: true
      },
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
    });
  } catch (error) {
    throw { code: "posts/all", message: "No posts were returned!" };
  }
};

const createPost = async (props: PostCreateProps): Promise<Post> => {
  const data = { ...props };
  try {
    log("Posts.create", data);
    return await prisma.post.create({ data });
  } catch (error) {
    log("\tERROR: ", error);
    throw { code: "posts/create", message: "Post was not created!" };
  }
};

const likePost = async (props: PostEngageProps): Promise<Post> => {
  const data = { ...props };
  try {
    log("Posts.like", data);
    const user = await prisma.user.findUnique({ where: { id: data.authorId } });
    const post = await prisma.post.findUnique({ where: { id: data.postId } });
    if (user && post) {
      const success = await prisma.post.update({
        where: { id: post.id },
        data: { likes: { connect: { id: user.id } } },
      });
      if (success) {
        return success;
      } else {
        throw {
          message: "Unable to connect like to post",
        };
      }
    }
    throw {
      message: "Unable to find user and post to like",
    };
  } catch (error) {
    log("\tERROR: ", error);
    throw { code: "posts/like", message: "Post not liked!" };
  }
};

const sharePost = async (props: PostEngageProps): Promise<Post> => {
  const { authorId, postId } = props;
  try {
    log("Posts.share", props);
    const post = await prisma.post.findUnique({ where: { id: postId } });

    const newShare = await prisma.share.create({
      data: {
        authorId,
        postId
      },
    });
    const updatePost = await prisma.post.update({
      where: { id: postId },
      data: {
        shares: {
          connect: {
            id: newShare.id,
          },
        },
      },
    });
    return updatePost;
  } catch (error) {
    log("\tERROR: ", error);
    throw { code: "posts/share", message: "Post not shared!" };
  }
};

const commentOnPost = async (props: PostCommentProps): Promise<Post> => {
  const {commentId, authorId, content} = props
  try {
    log("Posts.comment", {...props})
    const success = await prisma.post.update({
      where: {id: commentId},
      data: { comment: { create: {
        authorId,
        commentId,
        content
      }}}
    })
    if (success) {
      return success
    }
    else {
      throw ({
        message: 'Unable to comment on post'
      })
    }
  } catch (error) {
    log("\tERROR: ", error);
    throw { code: "posts/comment", message: "Post not commented!" };
  }
};

export const Posts = { all, byId, createPost, likePost, sharePost, commentOnPost };
