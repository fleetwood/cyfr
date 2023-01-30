import { Share } from "@prisma/client"
import { PostWithShare } from "../../../prisma/types/post.def"
import ReactHtmlParser from 'react-html-parser'
import Avatar from "../../ui/avatar"
import { ShareWithAuthorPost } from "../../../prisma/types/share.def"

type ShareItemProps = {
    share: ShareWithAuthorPost
}
const ShareItem = ({share}:ShareItemProps) => {
  return (
    <>
    {share.post && 
        <div className="relative">
            <div>{ReactHtmlParser(share.post.content!)}</div>
            <div className="absolute -mt-6 right-0">
                <Avatar shadow={true} user={share.author} sz="sm" />
            </div>
        </div>
    }
    </>
  )
}
export default ShareItem