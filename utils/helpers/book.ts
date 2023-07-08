import {
  AuthorStub,
  BookDetail,
  BookStub,
  ChapterDetail,
  ChapterStub,
  CyfrUser,
  Follow,
  UserFollow,
  UserStub,
} from "../../prisma/prismaContext";

export function onlyFans(follow: (Follow|UserFollow)[]) {
  return follow.filter((f:Follow|UserFollow) => f.isFan);
}

export type IsAuthorProps = {
  book?:      BookDetail|BookStub
  chapter?:   ChapterDetail|ChapterStub, 
  cyfrUser?:  CyfrUser
}

export const isAuthor = ({book, chapter, cyfrUser}:IsAuthorProps) => cyfrUser && ((book||chapter?.book)!.authors??[]).filter((a:AuthorStub) => a.user.id === cyfrUser?.id).length > 0
