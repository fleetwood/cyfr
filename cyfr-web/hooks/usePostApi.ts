import { useQuery, useQueryClient } from "react-query";
import { getApi } from "../utils/api";

export const usePostsApiQuery = 'usePostsApiQuery'
const fetchPosts = () => getApi('/post')

export const usePostsApi = (onSuccess: any, onError: any) => {
    return useQuery(usePostsApiQuery,fetchPosts,{onSuccess,onError,refetchInterval:10000})
}
