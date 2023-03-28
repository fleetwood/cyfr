import { useEffect, useState } from "react"
import useDebug from "../../hooks/useDebug"
import { UserDetail, UserSimple } from "../../prisma/prismaContext"
import { uniqueKey } from "../../utils/helpers"
import { useCyfrUserContext } from "../context/CyfrUserProvider"
import Avatar from "./avatar"
import Spinner from "./spinner"

const {debug} = useDebug('components/ui/mentionsMenu', 'DEBUG')

type MentionsMenuProps = {
    onSelect: Function
    searchTerm: string
    show?: boolean
    type?: 'MENTION' | 'MESSAGABLE'
}

const MentionsMenu = ({onSelect, searchTerm, show = true, type='MENTION'}:MentionsMenuProps) => {
    const [cyfrUser] = useCyfrUserContext()
    const [showMenu, setShowMenu] = useState(show)
    const [list, setList] = useState<Array<UserSimple>>([])
    const [search, setSearch] = useState<string>('')
    const [isLoading, setIsLoading] = useState(true)

    const chooseMention = (user:UserDetail) => {
        setShowMenu(() => false)
        onSelect(user)
    }

    const cyfrUserList = ():UserSimple[] => type === 'MENTION'
        ? cyfrUser.canMention  // FOR MENTION TYPE, use the cyfrUser mentions
        : cyfrUser.messagable // FOR MESSAGE TYPE, use the cyfrUSer messagables
    || []

    useEffect(() => {
        debug('search change', {
            search,
            searchTerm,
            list
        })
        setShowMenu(() => true)
        setList(() => cyfrUserList().filter(m => m.name.toLowerCase().indexOf(search.toLowerCase()) >= 0))
    }, [search])

    useEffect(() => {
        setList(() => cyfrUserList())
        setIsLoading(() => false)
        setShowMenu(() => false)
    },[])

  return (
    <div className="relative">
        <button className="cursor-pointer p-2 rounded-sm bg-secondary bg-opacity-0 text-xl hover:bg-opacity-30 hover:text-secondary-content" onClick={()=> {setShowMenu(() => !showMenu)}}>@</button>
        {showMenu && 
        <>
        <input type="text" className="opacity-50" value={search} onChange={(e:React.ChangeEvent<HTMLInputElement>) => setSearch(e.currentTarget.value)} />
        <ul className="absolute right-0 bottom-10 shadow-md shadow-primary bg-opacity-90 bg-base-200 p-2 rounded-lg min-w-max flex flex-col space-y-2">
        {isLoading  
            ? <li><Spinner size="sm" /></li>
            : cyfrUser && list.map((user:any) => (
                <li 
                    onClick={() => chooseMention(user)} 
                    key={uniqueKey(user,list)} 
                    className="
                        flex justify-items-start space-x-1 
                        cursor-pointer px-2 rounded-sm 
                        hover:bg-opacity-30 hover:bg-primary">
                    <Avatar user={user} link={false} sz="xs" />
                    <span>{user.name}</span>
                </li>
        ))}
        </ul>
        </>
        }
    </div>
  )
}
export default MentionsMenu