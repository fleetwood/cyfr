import { Like } from "@prisma/client"
import { PostWithAuthorLikes, PostWithAuthorLikesInclude } from "./post.def"
import { UserWithPostsLikes, UserWithPostsLikesInclude } from "./user.def"

export type ShareWithAuthorPost = Like & {
  author: UserWithPostsLikes
  post?: PostWithAuthorLikes
}
export const ShareWithAuthorPostInclude = {
  author: UserWithPostsLikesInclude,
  post: PostWithAuthorLikesInclude,
}
