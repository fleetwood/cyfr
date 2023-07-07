import { CommentThread, Comment, Commune, CommuneUser, User, Block } from "./../prismaContext";

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
    creatorId: string,
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
    creator: User;
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
      creator: true,
      _count: {
        select: {
          likes: true
        }
      }
    }
  }
}

export type CommentThreadStub = {
  comments: Comment[]
  commune:  Commune
  blocked:  Block[]
  _count: {
    comments: number
  }
}

export const CommentThreadStubInclude = { include: {
  comments: {
    take: 10,
    orderBy: {
      createdAt: 'desc'
    }
  },
  commune: true,
  blocked: true,
  _count: {
    select: {
      comments: true
    }
  },
}}