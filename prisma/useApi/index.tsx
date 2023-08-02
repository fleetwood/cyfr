import useBookApi from "./book"
import useChapterApi from "./chapter"
import useCommentApi from "./comment"
import useCoverApi from "./cover"
import useCyfrUserApi from "./cyfrUser"
import useGenreApi from "./genre"
import useGalleryApi from "./gallery"
import useImageApi from "./image"
import useInboxApi from "./inbox"
import useMembershipApi from "./membership"
import usePostApi from "./post"
import useShareApi from "./share"
import UserApi from "./user"

export default {
    book: useBookApi,
    chapter: useChapterApi,
    comment: useCommentApi,
    cover: useCoverApi,
    cyfrUser: useCyfrUserApi,
    gallery: useGalleryApi,
    genre: useGenreApi,
    image: useImageApi,
    inbox: useInboxApi,
    membership: useMembershipApi,
    post: usePostApi,
    share: useShareApi,
    user: UserApi,
}