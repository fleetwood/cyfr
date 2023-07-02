import { PostStub, User, UserStub } from "./../prismaContext"

export const LikesSharesInclude = {
  likes: true,
  shares: true
}