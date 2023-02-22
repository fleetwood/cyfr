import { CommentThread, Comment, Commune, CommuneUser, User } from "./../prismaContext";

export type InboxProps = {
  threadId?: string;
  userId: string;
  partyId: string;
};

export type CommentThreadDetails = CommentThread & {
  commune: Commune & {
    users: CommuneUser[];
  };
  comments: (Comment & {
    author: User;
    _count: {
      likes: number;
    };
  })[];
};

export const CommentThreadDetailsInclude = {
  commune: {
    include: {
      users: true,
    },
  },
  comments: {
    include: {
      author: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
  },
};
