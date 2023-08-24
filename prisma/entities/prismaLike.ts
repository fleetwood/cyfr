import useDebug from "hooks/useDebug"
import { Like, LikeStub } from "prisma/prismaContext"

const {debug, info, fileMethod} = useDebug('entities/prismaLike')

const like = async (creatorId: string, item: any):Promise<Like> => await prisma.like.create({
    data: {
        creator: { connect: {
            id: creatorId
        }},
        ...item
    }
})

const likeAuthor = ({creatorId, authorId}:{creatorId: string, authorId: string}): Promise<Like> => like(creatorId, {
    author: { connect: {
        id: authorId
    }}
})

const likeAgent = ({creatorId, agentId}:{creatorId: string, agentId: string}): Promise<Like> => like(creatorId, {
    agent: { connect: {
        id: agentId
    }}
})
const likePublisher = ({creatorId, publisherId}:{creatorId: string, publisherId: string}): Promise<Like> => like(creatorId, {
    publisher: { connect: {
        id: publisherId
    }}
})

const likeSubmission = ({creatorId, submissionId}:{creatorId: string, submissionId: string}): Promise<Like> => like(creatorId, {
    submissions: { connect: {
        id: submissionId
    }}
})

const likeEvent = ({creatorId, eventId}:{creatorId: string, eventId: string}): Promise<Like> => like(creatorId, {
    event: { connect: {
        id: eventId
    }}
})

const likeReview = ({creatorId, reviewId}:{creatorId: string, reviewId: string}): Promise<Like> => like(creatorId, {
    review: { connect: {
        id: reviewId
    }}
})

const likeBook = ({creatorId, bookId}:{creatorId: string, bookId: string}): Promise<Like> => like(creatorId, {
    book: { connect: {
        id: bookId
    }}
})

const likeChapter = ({creatorId, chapterId}:{creatorId: string, chapterId: string}): Promise<Like> => like(creatorId, {
    chapter: { connect: {
        id: chapterId
    }}
})

const likeCharacter = ({creatorId, characterId}:{creatorId: string, characterId: string}): Promise<Like> => like(creatorId, {
    character: { connect: {
        id: characterId
    }}
})

const likeCover = ({creatorId, coverId}:{creatorId: string, coverId: string}): Promise<Like> => like(creatorId, {
    cover: { connect: {
        id: coverId
    }}
})

const likeGallery = ({creatorId, galleryId}:{creatorId: string, galleryId: string}): Promise<Like> => like(creatorId, {
    gallery: { connect: {
        id: galleryId
    }}
})

const likeImage = ({creatorId, imageId}:{creatorId: string, imageId: string}): Promise<Like> => like(creatorId, {
    image: { connect: {
        id: imageId
    }}
})

const likePost = ({creatorId, postId}:{creatorId: string, postId: string}) => like(creatorId, {
    post: { connect: {
        id: postId
    }}
})

const likeArticle = ({creatorId, articleId}:{creatorId: string, articleId: string}): Promise<Like> => like(creatorId, {
    article: { connect: {
        id: articleId
    }}
})

const likeUser = ({creatorId, userId}:{creatorId: string, userId: string}): Promise<Like> => like(creatorId, {
    user: { connect: {
        id: userId
    }}
})

export const PrismaLike = { 
    likeAgent,
    likeArticle,
    likeAuthor,
    likeBook,
    likeChapter,
    likeCharacter,
    likeCover,
    likeEvent,
    likeGallery,
    likeImage,
    likePost,
    likePublisher,
    likeReview,
    likeSubmission,
    likeUser
}
