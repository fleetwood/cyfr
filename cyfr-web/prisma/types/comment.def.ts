import { CommentThread, Comment, Commune, CommuneUser, User } from "./../prismaContext";

/**
 * @property threadId Will create a new CommentThread if undefined
 * @property userId required
 * @property partyId required
 * @property data 
 */
export type UpsertInboxProps = {
  threadId?: string;
  userId: string;
  partyId: string;
  messages?: ({
    authorId: string,
    content: string
  })[]
}

export type StartInboxThreadProps = {
  ownerId: string
  partyId: string
  content: string
}

export type CommentThreadDetails = CommentThread & {
  commune: Commune & {
    users: (CommuneUser & {
      user: User
    })[];
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
      users: {
        include: {
          user: true
        }
      }
    }
  },
  comments: {
    where: {
      visible: true
    },
    orderBy: {
      updatedAt: 'desc'
    },
    include: {
      author: true,
      _count: {
        select: {
          likes: true
        }
      }
    }
  }
}
