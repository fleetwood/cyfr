
import { Dispatch, SetStateAction, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { ResponseError } from "../types/response";
import { getApi } from "../utils/api";
import { __cyfr_refetch__ } from "../utils/constants";
import { UserWithPostsLikes } from "../prisma/types/user";

const cyfrUserQuery = 'cyfrUserQuery'

export type useCyfrUserHookType = {
    cyfrUser?: UserWithPostsLikes,
    setCyfrUser: Dispatch<SetStateAction<UserWithPostsLikes | undefined>>,
    invalidateUser: () => Promise<void>
}

const useCyfrUser = ():useCyfrUserHookType => {
    const qc = useQueryClient()
    const [cyfrUser, setCyfrUser] = useState<UserWithPostsLikes>();
    const [error, setError] = useState<ResponseError>()
    const [refetchInterval, setRefetchInterval] = useState(__cyfr_refetch__)

    const getCyfrUser = async () => {
        const me = await getApi('/me')
        setRefetchInterval((c) => me ? __cyfr_refetch__ : 1000)
        if (me.result) {
            setCyfrUser((user) => me.result)
        }
    }
    
    useQuery([cyfrUserQuery],getCyfrUser, { refetchInterval })

    const invalidateUser = () => qc.invalidateQueries([cyfrUserQuery])
    
    return {cyfrUser, setCyfrUser, invalidateUser}
}

export default useCyfrUser