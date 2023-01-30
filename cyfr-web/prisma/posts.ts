import { Post, User } from "@prisma/client";
import { log } from "../utils/log";
import { prisma } from "./prismaContext";
import { PostWithDetails, PostWithDetailsInclude, PostAllProps, PostCreateProps, PostEngageProps, PostCommentProps, PostWithAuthorLikesInclude } from "./types/post.def";
import { UserWithPostsLikesInclude } from "./types/user.def";
import { ShareWithAuthorPostInclude } from "./types/share.def";

const byId = async (id: string): Promise<PostWithDetails | null> => {
  try {
    return await prisma.post.findFirst({
      where: {
        id: id,
        visible: true
      },
      include: {
       author: {
        include: UserWithPostsLikesInclude
       },
       share: {
        include: ShareWithAuthorPostInclude
      },
       shares: {
        include: ShareWithAuthorPostInclude
       },
       likes: true,
       post_comments: {
        include: PostWithAuthorLikesInclude
       }
      },
    });
  } catch (error) {
    throw { code: "posts/byId", message: "No posts were returned!" };
  }
};

const all = async (props?: PostAllProps): Promise<PostWithDetails[] | []> => {
  try {
    const { take = 10, skip = 0 } = { ...props };
    return await prisma.post.findMany({
      take,
      skip,
      where: {
        visible: true,
        commentId: null
      },
      include: PostWithDetailsInclude,
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

const create = async (props: PostCreateProps): Promise<Post> => {
  const data = { ...props };
  try {
    log("Posts.create", data);
    return await prisma.post.create({ data });
  } catch (error) {
    log("\tERROR: ", error);
    throw { code: "posts/create", message: "Post was not created!" };
  }
};

const like = async (props: PostEngageProps): Promise<Post> => {
  const data = { ...props };
  try {
    log("Posts.like", data);
    const user = await prisma.user.findUnique({ where: { id: data.userid } });
    const post = await prisma.post.findUnique({ where: { id: data.postid } });
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

const share = async (props: PostEngageProps): Promise<Post> => {
  const { userid, postid } = props;
  try {
    log("Posts.share", props);
    const post = await prisma.post.findUnique({ where: { id: postid } });

    const newShare = await prisma.share.create({
      data: {
        authorId: userid,
        postId: postid
      },
    });
    const updatePost = await prisma.post.update({
      where: { id: postid },
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

const comment = async (props: PostCommentProps): Promise<Post> => {
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

export const Posts = { all, create, byId, like, share, comment };
