import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { UserDetail } from "../prisma/users";
import { GetResponseError, ResponseError } from "../types/response";
import { getApi } from "../utils/api";

const userDetailQuery = "userDetailQuery";
const getUser = async (id:string) => getApi(`user/byId/${id}`)

const useUserDetailApi = (id:string) => {
  const qc = useQueryClient();
  const [userDetail, setUserDetail] = useState<UserDetail>();
  const [error, setError] = useState<ResponseError>();

  const getUserDetail = () =>
    getUser(id)
      .then((data) => {
        if (data.result) {
          setUserDetail(data.result);
        }
        if (data.error) {
          throw data.error;
        }
      })
      .catch((e) => {
        setError(GetResponseError(e));
      });

  useQuery([userDetailQuery], getUserDetail, { refetchInterval: 15000 });

  const invalidate = () => qc.invalidateQueries([userDetailQuery]);

  return {userDetail, error, invalidate}
};

export default useUserDetailApi;
