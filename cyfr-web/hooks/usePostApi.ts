import { Post } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { ResponseError, ResponseResult } from "../types/Response";
import { getApi } from "../utils/api";
import { log } from "../utils/log";

const usePostsApiQuery = "usePostsApiQuery";
const fetchPosts = () => getApi("/post");

type usePostApiType = {
  posts?: Post[];
  setPosts?: Dispatch<SetStateAction<Post[]>>;
  postsError?: ResponseError | undefined;
  invalidatePosts: Function;
};

export default function usePostsApi(): usePostApiType {
  const qc = useQueryClient();
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsError, setPostsError] = useState<ResponseError | undefined>();
  const onSuccess = (data: ResponseResult<Post[]>) => {
    if (data?.result) {
      setPosts(data.result!);
    } else if (data.error) {
      onError(data.error);
    }
  };
  const onError = (error: any) => {
    log("usePostsApiQuery ERROR", error);
    setPostsError(error);
  };
  useQuery(usePostsApiQuery, fetchPosts, {
    onSuccess,
    onError,
    refetchInterval: 10000,
  });

  const invalidatePosts = () => {
    qc.invalidateQueries(usePostsApiQuery);
  };
  return { posts, setPosts, postsError, invalidatePosts };
}
