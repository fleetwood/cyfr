import React from "react"
import { MainFeed, UserStub } from "../../../prisma/types"
import { timeDifference } from "../../../utils/helpers"
import Avatar from "../../ui/avatar"
import Link from "next/link"
import AvatarList from "../../ui/avatarList"

type FeedHeaderProps = {
  item: MainFeed
}

const FeedHeader = ({ item }: FeedHeaderProps) => {
  const { isShare, author } = item

  const link = item.post ? `/post/${item.post.id}`
    : item.gallery ? `/gallery/${item.gallery.id}`
    : item.book ? `/book/${item.book.slug}`
    : item.character ? `/character/${item.character.id}`
    : `/`

  const originalAuthor:UserStub = (item.post ? item.post.author
    : item.gallery ? item.gallery.author
    : item.author) as UserStub
  
  const originalAuthors:UserStub[] = item.book ? item.book.authors
    : item.character ? item.character.authors
    : []

  return (
    <div className="pb-2">
      {isShare &&
        <div className="border-b border-dashed border-base-content">
          <Avatar shadow={true} user={item.author} sz="sm" />
          <div>Shared {timeDifference((item.updatedAt || "").toString())}</div>
        </div>
      }
      <div className="">
        <div>
          {(item.book || item.character) && (
            <AvatarList users={originalAuthors || []} sz="sm" />
          )}
          {(item.post || item.gallery) && (
            <Avatar shadow={true} user={originalAuthor} sz="sm" />
          )}
        </div>
        <div>
          <Link href={link} className="text-primary underline">
            {item.post &&
              <span>Posted {timeDifference((item.updatedAt || "").toString())}</span>
            }
          </Link>
        </div>
      </div>
    </div>
  )
}
export default FeedHeader
