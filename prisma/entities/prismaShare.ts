import useDebug from "hooks/useDebug"
import { Share } from "prisma/prismaContext"

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

const shareAuthor = ({creatorId, authorId}:{creatorId: string, authorId: string}) => share(creatorId, {
    author: { connect: {
        id: authorId
    }}
})

const shareAgent = ({creatorId, agentId}:{creatorId: string, agentId: string}) => share(creatorId, {
    agent: { connect: {
        id: agentId
    }}
})
const sharePublisher = ({creatorId, publisherId}:{creatorId: string, publisherId: string}) => share(creatorId, {
    publisher: { connect: {
        id: publisherId
    }}
})

const shareSubmission = ({creatorId, submissionId}:{creatorId: string, submissionId: string}) => share(creatorId, {
    submissions: { connect: {
        id: submissionId
    }}
})

const shareEvent = ({creatorId, eventId}:{creatorId: string, eventId: string}) => share(creatorId, {
    event: { connect: {
        id: eventId
    }}
})

const shareReview = ({creatorId, reviewId}:{creatorId: string, reviewId: string}) => share(creatorId, {
    review: { connect: {
        id: reviewId
    }}
})

const shareBook = ({creatorId, bookId}:{creatorId: string, bookId: string}) => share(creatorId, {
    book: { connect: {
        id: bookId
    }}
})

const shareCharacter = ({creatorId, characterId}:{creatorId: string, characterId: string}) => share(creatorId, {
    character: { connect: {
        id: characterId
    }}
})

const shareCover = ({creatorId, coverId}:{creatorId: string, coverId: string}) => share(creatorId, {
    cover: { connect: {
        id: coverId
    }}
})

const shareGallery = ({creatorId, galleryId}:{creatorId: string, galleryId: string}) => share(creatorId, {
    gallery: { connect: {
        id: galleryId
    }}
})

const shareImage = ({creatorId, imageId}:{creatorId: string, imageId: string}) => share(creatorId, {
    image: { connect: {
        id: imageId
    }}
})

const sharePost = ({creatorId, postId}:{creatorId: string, postId: string}) => share(creatorId, {
    post: { connect: {
        id: postId
    }}
})

export const PrismaShare = { 
    shareAgent,
    shareAuthor,
    shareBook,
    shareCharacter,
    shareCover,
    shareEvent,
    shareGallery,
    shareImage,
    sharePost,
    sharePublisher,
    shareReview,
    shareSubmission
}
