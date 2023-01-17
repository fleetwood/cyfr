
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useSession } from "../lib/next-auth-react-query";
import { UserWithPostsLikes } from "../prisma/users";
import { GetResponseError, ResponseError } from "../types/response";
import { getApi } from "../utils/api";
import { log } from "../utils/log";

const cyfrUserQuery = 'cyfrUserQuery'

export type useCyfrUserHookType = {
    cyfrUser?: UserWithPostsLikes,
    setCyfrUser: Dispatch<SetStateAction<UserWithPostsLikes | undefined>>,
    invalidateUser: () => Promise<void>
}

const fetchUser = async (email:string) =>  await getApi(`user/byEmail/${email}`)

const useCyfrUser = (owner?: string):useCyfrUserHookType => {
    const qc = useQueryClient()
    const [session] = useSession({required:false})
    const [cyfrUser, setCyfrUser] = useState<UserWithPostsLikes>();
    const [error, setError] = useState<ResponseError>()

    const getCyfrUser = () => fetchUser(session.user.email)
        .then(user => {
            if (user.result) {
                setCyfrUser(user.result)
            } else if (user.error) {
                log('getCyfrUser error', user)
                setError(user.error)
            }
        })
        .catch(e => setError(GetResponseError(e)))
    
    useQuery([cyfrUserQuery],
        getCyfrUser, 
        { 
            enabled: session?.user?.email !== undefined,
            refetchInterval: 60000
        })

    const invalidateUser = () => qc.invalidateQueries([cyfrUserQuery])
    
    return {cyfrUser, setCyfrUser, invalidateUser}
}

export default useCyfrUser