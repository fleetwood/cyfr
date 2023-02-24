import { useEffect, useState } from "react"
import { User } from "../../prisma/prismaContext"
import { getApi } from "../../utils/api"
import { uniqueKey } from "../../utils/helpers"
import { log } from "../../utils/log"
import Avatar from "./avatar"
import Spinner from "./spinner"

type MentionsMenuProps = {
    onSelect: Function
    searchTerm: string
    show?: boolean
}

const MentionsMenu = ({onSelect, searchTerm, show = true}:MentionsMenuProps) => {
    const [showMenu, setShowMenu] = useState(show)
    const [search, setSearch] = useState<string>('')
    const [mentions, setMentions] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const getMentions = async () => {
        const res = await(await getApi(`user/mentions?search=${search}`)).result
        if (res) {
            setMentions(() => res)
            setIsLoading(() => false)
        }
    }

    const chooseMention = (user:User) => {
        setShowMenu(() => false)
        onSelect(user)
    }

    useEffect(() => {
        setSearch(() => searchTerm)
    }, [searchTerm])

    useEffect(() => {
        setIsLoading(() => true)
        getMentions()
    }, [search])

  return (
    <div className="relative">
        <button className="cursor-pointer p-2 rounded-sm bg-secondary bg-opacity-0 text-xl hover:bg-opacity-30 hover:text-secondary-content" onClick={()=> {setShowMenu(() => !showMenu)}}>@</button>
        {showMenu && 
        <>
        <input type="text" className="opacity-50" value={search} onChange={(e:React.ChangeEvent<HTMLInputElement>) => setSearch(e.currentTarget.value)} />
        <ul className="absolute right-0 bottom-10 shadow-md shadow-primary bg-opacity-90 bg-base-200 p-2 rounded-lg min-w-max flex flex-col space-y-2">
        {isLoading && 
            <li><Spinner size="sm" /></li>
        }
        {!isLoading && mentions && mentions.map(user => (
            <li onClick={() => chooseMention(user)} key={uniqueKey(user,mentions)} className="flex justify-items-start space-x-1 cursor-pointer px-2 rounded-sm hover:bg-opacity-30 hover:bg-primary"><Avatar user={user} link={false} sz="xs" /><span>{user.name}</span></li>
            ))}
        </ul>
        </>
        }
    </div>
  )
}
export default MentionsMenu