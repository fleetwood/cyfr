import useBookApi from "./book"
import useChapterApi from "./chapter"
import useCoverApi from "./cover"
import useCyfrUserApi from "./cyfrUser"
import useGenreApi from "./genre"
import useGalleryApi from "./gallery"
import useImageApi from "./image"
import useInboxApi from "./inbox"
import usePostApi from "./post"
import useMembershipApi from "./membership"
import UserApi from "./user"

export default {
    book: useBookApi,
    chapter: useChapterApi,
    cover: useCoverApi,
    cyfrUser: useCyfrUserApi,
    gallery: useGalleryApi,
    genre: useGenreApi,
    image: useImageApi,
    inbox: useInboxApi,
    post: usePostApi,
    user: UserApi,
    membership: useMembershipApi
}