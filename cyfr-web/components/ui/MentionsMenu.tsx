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
    showMenu: boolean
    setShowMenu: Function
    index:number
    setIndex:Function
}

const MentionsMenu = ({onSelect, searchTerm='', index, setIndex, showMenu, setShowMenu}:MentionsMenuProps) => {
    const [search, setSearch] = useState<string>('')
    const [mentions, setMentions] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    
    const repl = (id:string, name:string) => `<span class="mention-link" username="${name}" userid="${id}">@${name}</span>`

    const onChoose = (user:User) => {
        const chose = repl(user.id, (user.name||user.email)!)
        log(`onChoose ${chose}`)
        if (onSelect) {
            onSelect(chose)
            setShowMenu(false)
            setSearch('')
            setIndex(() => 0)
        }
    }

    const getMentions = async () => {
        const res = await(await getApi(`user/mentions?search=${search}`)).result
        if (res) {
            setMentions(() => res)
            setIsLoading(() => false)
            setIndex(() => 0)
        }
    }

    useEffect(() => {
        setSearch(() => searchTerm)
    }, [searchTerm])

    useEffect(() => {
        getMentions()
    }, [search])

  return (
    <div className="relative">
        <button className="
            cursor-pointer p-2 rounded-sm bg-secondary bg-opacity-0 text-xl 
            hover:bg-opacity-30 hover:text-secondary-content" 
            onClick={(e)=> {e.stopPropagation(); setShowMenu(() => !showMenu)}}>@</button>
        {showMenu && 
        <>
            <input type="text" className="opacity-50 text-base-content" value={search} onChange={(e:React.ChangeEvent<HTMLInputElement>) => setSearch(e.currentTarget.value)} />
            {isLoading && 
                <li><Spinner size="sm" /></li>
            }
            {!isLoading && mentions && mentions.length > 0 && 
                <ul className="
                    absolute right-0 bottom-10 shadow-md shadow-primary 
                    bg-opacity-90 bg-base-200 p-2 rounded-lg min-w-max 
                    flex flex-col space-y-2">
                {mentions && mentions.map((user, i) => (
                    <li onClick={(e) => onChoose(user)} 
                        key={uniqueKey(user,mentions)} 
                        className={`
                            flex justify-items-start space-x-1 cursor-pointer px-2 
                            rounded-sm bg-primary hover:bg-opacity-50 
                            ${index === i ? 'bg-opacity-30' : 'bg-opacity-0'}
                            `}>
                        <Avatar user={user} link={false} sz="xs" />
                        <span>{user.name}</span>
                    </li>
                ))}
                </ul>
            }
        </>
        }
    </div>
  )
}
export default MentionsMenu