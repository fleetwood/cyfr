import { useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { GetResponseError, ResponseError } from "../types/response"
import { getApi, sendApi } from "../utils/api"
import { PostCommentProps, PostCreateProps, PostEngageProps, PostWithDetails } from "../prisma/types/post"
import { log } from "../utils/log"

const allPostsQuery = "allPostsQuery"
const fetchPosts = async () => await getApi(`post`)

const usePostsApi = () => {
  const qc = useQueryClient()
  const [posts, setPosts] = useState<PostWithDetails[]>([])
  const [commentId, setCommentId] = useState<string|null>(null)
  const [error, setError] = useState<ResponseError>()

  const getPosts = () =>{
    log(`usePostsApi.getPosts() refetchInterval: 5000`)
    return fetchPosts()
      .then((data) => {
        if (data.result) {
          // log(`\tGot posts ${data.result.length}`)
          setPosts(data.result)
        }
        if (data.error) {
          log(`\tGot ERROR ${JSON.stringify(data.error)}`)
          throw data.error
        }
        if (!data) {
          log(`'\tGot nothin`)
        }
      })
      .catch((e) => {
        setError(GetResponseError(e))
      })
    }

  const create = async (props: PostCreateProps) => await sendApi("post/create", props)

  const share = async (props: PostEngageProps) => await sendApi("post/share", props)

  const like = async (props: PostEngageProps) => await sendApi("post/like", props)

  const comment = async (props:PostCommentProps) => await sendApi("post/comment", props)

  useQuery([allPostsQuery], getPosts, { refetchInterval: 5000 })

  const invalidatePosts = () => qc.invalidateQueries([allPostsQuery])

  return {posts, comment, commentId, setCommentId, share, like, create, error, invalidatePosts}
}

export default usePostsApi
