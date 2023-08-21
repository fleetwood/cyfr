import {Tooltip} from '@mui/material'
import {useToast} from 'components/context/ToastContextProvider'
import UserAvatarList from 'components/ui/avatar/userAvatarList'
import {MuiArticleIcon,HeartIcon,ShareIcon} from 'components/ui/icons'
import ShrinkableIconButton from 'components/ui/shrinkableIconButton'
import useDebug from 'hooks/useDebug'
import {ArticleStub} from 'prisma/prismaContext'
import useApi from 'prisma/useApi'
import React from 'react'
import {abbrNum} from 'utils/helpers'

const { debug } = useDebug('containers/Articles/ArticleFeedItem')

const ArticleFooter = ({article, invalidate, avatars}:{article: ArticleStub, avatars?: boolean|false, invalidate?: () => void}) => {
  const { cyfrUser, isLoading } = useApi.cyfrUser()
  const { like, share, comment } = useApi.article()
  const { notify, notifyLoginRequired } = useToast()
  
  const isLoggedIn = () => {
    if (!cyfrUser) {
      notifyLoginRequired()
      return false
    }
    return true
  }

  const handleLike = async () => {
    if (!isLoggedIn()) return

    debug(`handleLike`)
    const liked = await like({ articleId: article.id, creatorId: cyfrUser!.id })
    if (liked) {
      notify('You liked this article!!!!!!!!!!!', 'success')
      if (invalidate) invalidate()
      return
    }
    notify("Well that didn't work...", 'warning')
  }

  const handleShare = async () => {
    if (!isLoggedIn()) return

    debug(`handleShare`)
    const shared = await share({
      articleId: article.id,
      creatorId: cyfrUser!.id,
    })
    if (shared) {
      notify('You shared this articles', 'success')
      if (invalidate) invalidate()
      return
    }
    notify("Well that didn't work...", 'warning')
  }

  return (
    <div className="flex flex-row justify-around py-4">
      <div>
        <ShrinkableIconButton
          icon={HeartIcon}
          className="bg-opacity-0 hover:shadow-none"
          iconClassName="text-primary"
          labelClassName="text-primary"
          label={`Like (${abbrNum(article._count.likes)})`}
          onClick={() => handleLike()}
        />
        {avatars && article.likes && 
            <UserAvatarList
              users={article.likes.map((like) => like.creator)}
              count={article.likes.length}
              sz="sm"
            />
        }
      </div>

      <div>
        <ShrinkableIconButton
          icon={ShareIcon}
          className="bg-opacity-0 hover:shadow-none"
          iconClassName="text-primary"
          labelClassName="text-primary"
          label={`Shares (${abbrNum(article._count.shares)})`}
          onClick={() => handleShare()}
        />
        {avatars && article.shares && 
          <UserAvatarList
            users={article.shares.map((share) => share.creator)}
            sz="sm"
            count={article.shares.length}
          />
        }
      </div>

      <div>
        {/* <CreateCommentFooterButton
              articleId={article.id}
              comments={(article.commentThread?.comments ?? []).length}
            /> */}
        {/* {article.commentThread?.comments && (
              <UserAvatarList
                users={article.commentThread.comments.map(
                  (comment) => comment.creator
                )}
                sz="sm"
                count={article.commentThread.comments.length}
              />
            )} */}
      </div>
    </div>
  )
}

export default ArticleFooter