import useArticleApi from "./article"
import useBookApi from "./book"
import useChapterApi from "./chapter"
import useCommentApi from "./comment"
import useCoverApi from "./cover"
import useCyfrUserApi from "./cyfrUser"
import useGalleryApi from "./gallery"
import useGenreApi from "./genre"
import useImageApi from "./image"
import useInboxApi from "./inbox"
import useMembershipApi from "./membership"
import useNotifApi from "./notif"
import usePostApi from "./post"
import useShareApi from "./share"
import UserApi from "./user"

export default {
    article: useArticleApi,
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
    notif: useNotifApi,
    post: usePostApi,
    share: useShareApi,
    user: UserApi,
}