import { ReactNode, useEffect, useState } from "react"
import { User } from "../../prisma/prismaContext"
import { getApi } from "../../utils/api"
import Avatar from "./avatar"
import Spinner from "./spinner"

type MentionProps = {
    userId: string
    userName: string
    children?: ReactNode
}

const Mention = ({userId, userName, children}:MentionProps) => {
    const [user, setUser] = useState<User|undefined>()
    const [name, setName] = useState<string>(userName)
    const [loading, setLoading] = useState<boolean>(true)

    const getUser = async() => {
        const u = await (await getApi(`user/byId/${userId}`)).result
        if (u) {
            setUser(() => u)
            setName(() => u.name)
            setLoading(() => false)
        }
    }

    useEffect(() => {getUser()}, [userId])

    return (
        <span className="mention">
            <span className="mention-link">@{name||children}</span>
            
            <span className="mention-popover col-2">
                {loading && <Spinner />}
                {user && <span><Avatar user={user} sz="md"/> {name}</span>}
            </span>
        </span>
)}

export default Mention