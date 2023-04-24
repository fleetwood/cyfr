import {
  BookDetail,
  BookStub,
  CyfrUser,
  Follow,
} from "../../prisma/prismaContext";

export function isBookAuthor(
  book: BookDetail | BookStub,
  cyfrUser: CyfrUser | null
) {
  const isOwner =
    cyfrUser && book.authors
      ? book.authors.filter((a) => a.id === cyfrUser.id).length > 0
      : false;
  return isOwner;
}

export function onlyFans(follow: Follow[]) {
  return follow.filter((f) => f.isFan);
}
