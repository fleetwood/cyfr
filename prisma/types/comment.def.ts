import {Block,Comment,CommentThread,Commune,CommuneUser,CreatorStub,User,UserStub} from "prisma/prismaContext";

export type AddCommentProps = {
  creatorId:  string
  threadId:   string
  content:    string
}

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
      user: UserStub
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
          // UserStubSelect
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              slug: true,
              // MembershipStubSelect
              membership: {
                select: {
                  id: true,
                  expiresAt: true,
                  type: {
                    select: {
                      id: true,
                      name: true,
                      level: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  comments: {
    where: {
      visible: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    include: {
      creator: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
  },
}

export type CommentThreadStub = Comment & {
  creator: CreatorStub
  comments: (Comment & {
    creator: CreatorStub
  })[]
  commune:  Commune
  blocked:  Block[]
  _count: {
    comments: number
  }
}

export const CommentThreadStubInclude = {
  include: {
    comments: {
      include: {
        // CreatorStubSelect
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
            slug: true,
            membership: {
              select: {
                id: true,
                expiresAt: true,
                type: {
                  select: {
                    id: true,
                    name: true,
                    level: true,
                  },
                },
              },
            },
          },
        },
      },
      take: 10,
    },
    commune: true,
    blocked: true,
    _count: {
      select: {
        comments: true,
      },
    },
  },
}