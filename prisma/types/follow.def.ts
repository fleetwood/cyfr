export type UserFollowProps = {
  followingId: string
  followerId: string
  isFan?: boolean
  active?:  boolean
}

export type BookFollowProps = {
  bookId: string
  followerId: string
  isFan?: boolean
  active?:  boolean
}
