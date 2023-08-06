import React from "react"
import { CreatorStub, PostStub, ShareStub, UserStub } from "prisma/prismaContext"
import { timeDifference } from "utils/helpers"
import Link from "next/link"
import UserAvatar from "components/ui/avatar/userAvatar"
import UserAvatarList from "components/ui/avatar/userAvatarList"

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

  const sharedId = book?.id ?? 
                   character?.id ?? 
                   cover?.id ??
                   image?.id ??
                   gallery?.id ??
                   post?.id ??
                   item.id

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
      <div className="flex space-x-2 p-2">
        <UserAvatar user={item.creator as UserStub} sz="sm" />
        <div>Shared {timeDifference(item.updatedAt)}</div>
          <span className="text-xs ml-4">{item.id}</span>
      </div>
      
      <div className="p-2 bg-base-300">
        <div className="flex space-x-2 py-2">
          {originalAuthors && originalAuthors.length > 0 && <UserAvatarList users={originalAuthors} sz="md" /> }
          {originalAuthor && <UserAvatar user={originalAuthor} sz="md" /> } 

          <Link href={link} className="text-primary underline">
            <span>Posted {timeDifference(sharedTime)}</span>
            <span className="text-xs ml-4">{sharedId}</span>
          </Link>
        </div>
      </div>

    </div>
  )
}
export default ShareHeader
