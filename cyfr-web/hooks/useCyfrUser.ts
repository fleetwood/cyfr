
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useSession } from "../lib/next-auth-react-query";
import { UserWithPosts } from "../prisma/users";
import { GetResponseError, ResponseError } from "../types/response";
import { getApi } from "../utils/api";
import { log } from "../utils/log";

const cyfrUserQuery = 'cyfrUserQuery'

type useCyfrUserQuery = {
    cyfrUser?: UserWithPosts,
    setCyfrUser: Dispatch<SetStateAction<UserWithPosts | undefined>>,
    invalidate: Promise<void>
}

const fetchUser = async (email:string) =>  await getApi(`user/byEmail/${email}`)

const useCyfrUser = (owner?: string) => {
    const qc = useQueryClient()
    const [session] = useSession({required:false})
    const [cyfrUser, setCyfrUser] = useState<UserWithPosts>();
    const [error, setError] = useState<ResponseError>()

    const getCyfrUser = () => fetchUser(session.user.email)
        .then(user => {
            if (user.result) {
                setCyfrUser(user.result)
            } else if (user.error) {
                setError(user.error)
            }
        })
        .catch(e => setError(GetResponseError(e)))
    
    useQuery([cyfrUserQuery],
        getCyfrUser, 
        { 
            enabled: session?.user?.email !== undefined,
            refetchInterval: cyfrUser ? 60000 : 50
        })

    const invalidate = () => qc.invalidateQueries([cyfrUserQuery])
    
    return {cyfrUser, setCyfrUser, invalidate}
}

export default useCyfrUser