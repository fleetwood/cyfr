import React from "react"
import { PostStub, UserStub } from "prisma/prismaContext"
import { isShare, timeDifference } from "utils/helpers"
import Link from "next/link"
import Avatar from "components/ui/avatar"
import AvatarList from "components/ui/avatarList"

type FeedHeaderProps = {
  item:       PostStub
  isShared?:  boolean
}

const FeedHeader = ({ item, isShared }: FeedHeaderProps) => {

  const link = item.post ? `/post/${item.post.id}` :
               item.gallery ? `/gallery/${item.gallery.id}` :
               item.book ? `/book/${item.book.slug}` :
               item.character ? `/character/${item.character.id}` :
               `/`

  const sharedTime = item.book?.createdAt ?? 
                     item.character?.createdAt ?? 
                     item.cover?.createdAt ??
                     item.image?.createdAt ??
                     item.gallery?.createdAt ??
                     item.createdAt

  const originalAuthor:UserStub = item.creator
  // TODO: get creator for shared items
  // : (item.sharedPost ? item.sharedPost.creator
  // : item.gallery ? item.gallery.creator
  // : item.creator) as UserStub
  
  const originalAuthors:UserStub[] = [] 
  // TODO: get authors for books or characters
    // : item.book ? item.book.authors
    // : item.character ? item.character.authors
    // : []

  return (
    <div className="pb-2">
      {isShared &&
        <div className="border-b border-dashed border-base-content flex space-x-2 pb-2 mb-2">
            <Avatar shadow={true} user={item.creator} sz="sm" />
            <div>Shared {timeDifference(item.createdAt)}</div>
        </div>
      }
      <div className="flex space-x-2 pb-2 mb-2">
        {(!item.book) && 
          <Avatar shadow={true} user={originalAuthor} sz="sm" />
        }
        {/* BOOKS can have multiple authors */}
        {item.book && 
          <AvatarList users={originalAuthors} sz="sm" />
        }

        <Link href={link} className="text-primary underline">
          <span>Posted {timeDifference(isShared ? sharedTime : item.updatedAt)}</span>
        </Link>
      </div>
    </div>
  )
}
export default FeedHeader
