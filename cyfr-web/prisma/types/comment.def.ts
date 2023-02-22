import { CommentThread, Commune, CommuneUser, User } from "./../prismaContext"

export type CommentThreadDetails = CommentThread &  {
    commune: Commune & {
        users: CommuneUser[]
    },
    comments: Comment & {
        author: User,
        _count: {
            likes: number
        }
    }
}

export const CommentThreadDetailsInclude = {
    commune: {  include: {
        users: true
    }},
    comments: { include: {
        author: true,
        _count: { select: {
            likes: true
    }}}}
}