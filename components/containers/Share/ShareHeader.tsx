import React from "react"
import { CreatorStub, PostStub, ShareStub, UserStub } from "prisma/prismaContext"
import { timeDifference } from "utils/helpers"
import Link from "next/link"
import Avatar from "components/ui/avatar/avatar"
import AvatarList from "components/ui/avatarList"

type ShareHeaderProps = {
  share:      ShareStub
  isShared?:  boolean
}

const ShareHeader = ({ share: item, isShared }: ShareHeaderProps) => {
  const {book, character, cover, gallery, image, post} = item

  const link = gallery ? `/gallery/${gallery.id}` :
               book ? `/book/${book.slug}` :
               character ? `/character/${character.id}` :
               `/post/${(post ?? item).id}`

  const sharedTime = book?.createdAt ?? 
                     character?.createdAt ?? 
                     cover?.createdAt ??
                     image?.createdAt ??
                     gallery?.createdAt ??
                     post?.createdAt ??
                     item.createdAt

  // TODO: get creator for shared items
  const originalAuthor:CreatorStub = 
    post ? post.creator :
    image ? image.creator :
    gallery ? gallery.creator : 
    cover ? cover.creator : 
    // event ? event.creator : 
    item.creator
    
  
  const originalAuthors:UserStub[] = [] 
  // TODO: get authors for books or characters
    // : book ? book.authors
    // : character ? character.authors
    // : []

  return (
    <div className="pb-2">
      <div className="border-b border-dashed border-base-content flex space-x-2 pb-2 mb-2">
        <Avatar user={item.creator as UserStub} sz="sm" />
        <div>Shared {timeDifference(item.createdAt)}</div>
      </div>
      
      <div className="flex space-x-2 pb-2 mb-2">
        
        {originalAuthors && originalAuthors.length > 0 && <AvatarList users={originalAuthors} sz="sm" /> }
        {originalAuthor && <Avatar user={originalAuthor} sz="sm" /> } 

        <Link href={link} className="text-primary underline">
          <span>Posted {timeDifference(item.updatedAt)}</span>
        </Link>
      </div>
    </div>
  )
}
export default ShareHeader
