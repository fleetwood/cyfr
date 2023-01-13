import { Post } from "@prisma/client";
import React from "react";
import { timeDifference } from "../../../utils/helpers";
import { log } from "../../../utils/log";
import { HeartIcon, ShareIcon, ReplyIcon } from "../../ui/icons";
import ShrinkableIconButton from "../../ui/shrinkableIconButton";

type UserPostDetailProps = {
  post: Post;
};

const UserDetailPostItem = ({ post }: UserPostDetailProps) => {
  const likePost = () => {
    log("likePost", post.id);
  };

  const sharePost = () => {
    log("sharePost", post.id);
  };

  const replyPost = () => {
    log("replyPost", post.id);
  };

  return (
    <div className="even:bg-base-100 odd:bg-base-200 bg-opacity-50 rounded-lg mb-2 md:mb-4 p-2 md:p-4">
      <div className="mb-2 md:mb-4">
        <div>{timeDifference(post.createdAt)}</div>
        <h2>{post.title}</h2>
        <h3>{post.subtitle}</h3>
      </div>
      <div className="mb-2 md:mb-4">{post.content}</div>

      <div
        className="
        flex flex-row 
        justify-around 
        py-4
        border-t 
        border-base-content 
        border-opacity-50"
      >
        <ShrinkableIconButton
          label="Like"
          icon={HeartIcon}
          className="bg-opacity-0 hover:shadow-none"
          iconClassName="text-primary"
          labelClassName="text-primary"
          onClick={likePost}
        />
        <ShrinkableIconButton
          label="Share"
          icon={ShareIcon}
          className="bg-opacity-0 hover:shadow-none"
          iconClassName="text-primary"
          labelClassName="text-primary"
          onClick={sharePost}
        />
        <ShrinkableIconButton
          label="Reply"
          icon={ReplyIcon}
          className="bg-opacity-0 hover:shadow-none"
          iconClassName="text-primary"
          labelClassName="text-primary"
          onClick={replyPost}
        />
      </div>
    </div>
  );
};

export default UserDetailPostItem;
