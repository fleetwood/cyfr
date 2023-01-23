import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { GetResponseError, ResponseError } from "../types/response";
import { getApi, sendApi } from "../utils/api";
import { PostWithDetails } from "../prisma/types/post";

const allPostsQuery = "allPostsQuery";
const fetchPosts = async () => await getApi(`post`);

const usePostsApi = () => {
  const qc = useQueryClient();
  const [posts, setPosts] = useState<PostWithDetails[]>([]);
  const [error, setError] = useState<ResponseError>();

  const getPosts = () =>
    fetchPosts()
      .then((data) => {
        if (data.result) {
          setPosts(data.result);
        }
        if (data.error) {
          throw data.error;
        }
      })
      .catch((e) => {
        setError(GetResponseError(e));
      });

  const create = async (props: {
      title:string
      authorid:string
      content:string
      subtitle?:string
      headerImage?:string
    }) => {

    return await sendApi("post/create", props)
  }

  const share = async (props: {
    postid: string
    userid: string
  }) => {
    return await sendApi("post/share", props)
  }

  const like = async (props: {
    postid: string
    userid: string
  }) => {
    return await sendApi("post/like", props)
  }

  const comment = async (props: {
    postid: string
    userid: string
    content: string
  }) => {
    return await sendApi("post/comment", props)
  }

  useQuery([allPostsQuery], getPosts, { refetchInterval: 15000 });

  const invalidatePosts = () => qc.invalidateQueries([allPostsQuery]);

  return {posts, comment, share, like, create, error, invalidatePosts}
};

export default usePostsApi;
