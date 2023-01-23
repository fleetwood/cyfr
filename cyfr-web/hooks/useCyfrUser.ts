
import { Dispatch, SetStateAction, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { ResponseError } from "../types/response";
import { getApi } from "../utils/api";
import { __cyfr_refetch__ } from "../utils/constants";
import { UserWithPostsLikes } from "../prisma/types/user";
import { log } from "../utils/log";
import { uuid } from "../utils/helpers";

const cyfrUserQuery = 'cyfrUserQuery'
const id = uuid().slice(0,4)
export type useCyfrUserHookType = {
    cyfrUser?: UserWithPostsLikes,
    setCyfrUser: Dispatch<SetStateAction<UserWithPostsLikes | undefined>>,
    invalidateUser: () => Promise<void>
    setRefetchInterval: Dispatch<SetStateAction<number>>
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
            log(`${id} getCyfrUser() success, refetch:${refetchInterval}`)
            setCyfrUser((user) => me.result)
        } else {
            log(`${id} getCyfrUser() weirdness ${JSON.stringify(me)}, refetch:${refetchInterval}`)
        }
    }
    
    useQuery([cyfrUserQuery],getCyfrUser, { refetchInterval })

    const invalidateUser = () => {
        log(`${id} useCyfrUser.invalidateUser() refetch:${refetchInterval}`)
        return qc.invalidateQueries([cyfrUserQuery])
    }
    
    return {cyfrUser, setCyfrUser, invalidateUser, setRefetchInterval}
}

export default useCyfrUser