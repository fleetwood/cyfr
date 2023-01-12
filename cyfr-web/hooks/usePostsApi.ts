import { Post } from "@prisma/client";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { PostWithAuthor } from "../prisma/posts";
import { GetResponseError, ResponseError } from "../types/response";
import { getApi } from "../utils/api";

const allPostsQuery = "allPostsQuery";
const fetchPosts = async () => await getApi(`post`);

const usePostsApi = () => {
  const qc = useQueryClient();
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
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

  useQuery([allPostsQuery], getPosts, { refetchInterval: 15000 });

  const invalidate = () => qc.invalidateQueries([allPostsQuery]);

  return {posts, error, invalidate}
};

export default usePostsApi;
