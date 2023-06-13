
import { useQuery, useQueryClient } from "react-query"
import { PostDetail } from "../prisma/prismaContext"
import { getApi } from "../utils/api"
import useDebug from "./useDebug"
import { RocketQuery } from "types/props"

const { debug, info } = useDebug("usePostQuery")

type PostRocketQuery = RocketQuery<PostDetail>

const usePostQuery = (postId:string):PostRocketQuery => {

  if (!postId) {
    debug('getPostDetail postId is null')
    return {
      data: {},
      isLoading: false,
      error: {
        message: 'Param postId is not available'
      },
      invalidate: () => {}
    } as PostRocketQuery
  }

  const qc = useQueryClient()
  const postQuery = ["postDetail", `postDetail-${postId}`]

  const getPostDetail = async () => {
    debug(`getPostDetail  ${postQuery}`, {url: `/post/${postId}`})
    const postDetail = await getApi(`/post/${postId}`)
    return (postDetail.result as PostDetail) || postDetail.error || null
  }

  const invalidate = () => {
    debug('invalidate',postQuery)
    qc.invalidateQueries(postQuery)
  }

  const query = useQuery(
    postQuery,
    getPostDetail,
    {
      onSettled(data: any,error: any) {
        if (error || data === null) {
          debug(`onSettled [${postQuery}] ERROR`, { error, data })
        }
        if (data) {
          const post = data.result ?? data
          debug(`onSettled [${postQuery}]`, {post})
          return post ?? undefined
        }
      }
    }
  )

  return {...query, invalidate} as PostRocketQuery
}

export default usePostQuery