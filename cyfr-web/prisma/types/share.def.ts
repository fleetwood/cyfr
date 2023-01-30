import { Share, User } from "@prisma/client"
import { PostWithAuthorLikes, PostWithAuthorLikesInclude } from "./post.def"
import { UserWithPostsLikes, UserWithPostsLikesInclude } from "./user.def"

export type ShareWithAuthorPost = Share & {
    author: UserWithPostsLikes
    post?: PostWithAuthorLikes
  }
  export const ShareWithAuthorPostInclude = {
    author: UserWithPostsLikesInclude,
    post: PostWithAuthorLikesInclude,
  }