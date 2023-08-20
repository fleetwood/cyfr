import useDebug from "hooks/useDebug"
import { Share, ShareStub } from "prisma/prismaContext"

const {debug, info, fileMethod} = useDebug('entities/prismaShare')

const share = async (creatorId: string, item: any):Promise<Share> => await prisma.share.create({
    data: {
        creator: { connect: {
            id: creatorId
        }},
        attachingPost: { create: {
            creatorId
        }},
        ...item
    }
})

const shareAuthor = ({creatorId, authorId}:{creatorId: string, authorId: string}): Promise<Share> => share(creatorId, {
    author: { connect: {
        id: authorId
    }}
})

const shareAgent = ({creatorId, agentId}:{creatorId: string, agentId: string}): Promise<Share> => share(creatorId, {
    agent: { connect: {
        id: agentId
    }}
})
const sharePublisher = ({creatorId, publisherId}:{creatorId: string, publisherId: string}): Promise<Share> => share(creatorId, {
    publisher: { connect: {
        id: publisherId
    }}
})

const shareSubmission = ({creatorId, submissionId}:{creatorId: string, submissionId: string}): Promise<Share> => share(creatorId, {
    submissions: { connect: {
        id: submissionId
    }}
})

const shareEvent = ({creatorId, eventId}:{creatorId: string, eventId: string}): Promise<Share> => share(creatorId, {
    event: { connect: {
        id: eventId
    }}
})

const shareReview = ({creatorId, reviewId}:{creatorId: string, reviewId: string}): Promise<Share> => share(creatorId, {
    review: { connect: {
        id: reviewId
    }}
})

const shareBook = ({creatorId, bookId}:{creatorId: string, bookId: string}): Promise<Share> => share(creatorId, {
    book: { connect: {
        id: bookId
    }}
})

const shareChapter = ({creatorId, chapterId}:{creatorId: string, chapterId: string}): Promise<Share> => share(creatorId, {
    chapter: { connect: {
        id: chapterId
    }}
})

const shareCharacter = ({creatorId, characterId}:{creatorId: string, characterId: string}): Promise<Share> => share(creatorId, {
    character: { connect: {
        id: characterId
    }}
})

const shareCover = ({creatorId, coverId}:{creatorId: string, coverId: string}): Promise<Share> => share(creatorId, {
    cover: { connect: {
        id: coverId
    }}
})

const shareGallery = ({creatorId, galleryId}:{creatorId: string, galleryId: string}): Promise<Share> => share(creatorId, {
    gallery: { connect: {
        id: galleryId
    }}
})

const shareImage = ({creatorId, imageId}:{creatorId: string, imageId: string}): Promise<Share> => share(creatorId, {
    image: { connect: {
        id: imageId
    }}
})

const sharePost = ({creatorId, postId}:{creatorId: string, postId: string}) => share(creatorId, {
    post: { connect: {
        id: postId
    }}
})

const shareArticle = ({creatorId, articleId}:{creatorId: string, articleId: string}): Promise<Share> => share(creatorId, {
    article: { connect: {
        id: articleId
    }}
})

const shareUser = ({creatorId, userId}:{creatorId: string, userId: string}): Promise<Share> => share(creatorId, {
    user: { connect: {
        id: userId
    }}
})

export const PrismaShare = { 
    shareAgent,
    shareArticle,
    shareAuthor,
    shareBook,
    shareChapter,
    shareCharacter,
    shareCover,
    shareEvent,
    shareGallery,
    shareImage,
    sharePost,
    sharePublisher,
    shareReview,
    shareSubmission,
    shareUser,
}
