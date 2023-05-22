import {
  BookDetail,
  BookStub,
  CyfrUser,
  Follow,
  UserFollow,
} from "../../prisma/prismaContext";

export function onlyFans(follow: (Follow|UserFollow)[]) {
  return follow.filter((f:Follow|UserFollow) => f.isFan);
}
