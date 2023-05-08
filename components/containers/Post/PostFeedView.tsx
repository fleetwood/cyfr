import ReactHtmlParser from "react-html-parser";
import { MainFeed, PostStub, UserStub } from "../../../prisma/prismaContext";
import FeedFooter from "../Feed/FeedFooter";

import useDebug from "../../../hooks/useDebug";
import UserInfo from "../../ui/userInfo";
import { timeDifference, uuid } from "../../../utils/helpers";
import Link from "next/link";
import HtmlContent from "../../ui/htmlContent";
import Avatar from "../../ui/avatar";
import GalleryPhotoswipe from "../Gallery/GalleryPhotoswipe";
const { debug, jsonBlock } = useDebug("MainFeedItem", "DEBUG");

type PostFeedItemProps = {
  item: MainFeed;
};

const PostFeedView = ({ item }: PostFeedItemProps) => {
  const { post, isShare, author } = item;
  const comments: any[] = [];

  return post ? (
    <div className="p-4 mt-4 font-feed">
      <div className="font-semibold">Post</div>
      {post.content && <HtmlContent content={post.content} />}

      {post.images?.length > 0 && post.images[0] !== null && (
        <GalleryPhotoswipe images={post.images} />
      )}

      {comments && comments.length > 0 && (
        <div className="mt-4 text-sm font-semibold">⤵ Replies</div>
      )}
      {/* {comments && comments.slice(0, 5).map((comment) => (
          <div className="font-feed even:bg-base-300 odd:bg-base-200 bg-opacity-50 p-4 rounded-lg text-base-content mt-2 flex space-x-4" key={`item:${item.post?.id||item.share?.id||uuid()}-comment:${comment.id}`}>
            <Avatar user={comment.author} sz="xs" />
            <>{ReactHtmlParser(comment.content!)}</>
          </div>
        ))}
        {comments && comments.length >= 5 && (
          <div
            tabIndex={0}
            className="collapse border border-base-300 bg-base-100 rounded-box"
          >
            <div className="collapse-content">
              {post.post_comments.slice(5).map((comment) => (
                <div className="bg-base-300 bg-opacity-50 p-4 rounded-lg text-base-content flex space-x-4" key={`item:${item.post?.id||item.share?.id||uuid()}-comment:${comment.id}`}>
                  <Avatar user={comment.author} sz="xs" />
                  <>{ReactHtmlParser(comment.content!)}</>
                </div>
              ))}
            </div>
            <div className="collapse-title collapse-arrow">{""}</div>
          </div>
        )} */}
    </div>
  ) : (
    <></>
  );
};

export default PostFeedView;
