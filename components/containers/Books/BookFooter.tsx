import { useCyfrUserContext } from 'components/context/CyfrUserProvider'
import { ToastNotifyType, useToast } from 'components/context/ToastContextProvider'
import { BookIcon, DollarIcon, FireIcon, FollowIcon, HeartIcon, ReplyIcon, ShareIcon, StarIcon } from 'components/ui/icons'
import ShrinkableIconLabel from 'components/ui/shrinkableIconLabel'
import { useBookApi } from 'prisma/hooks/useBookApi'
import { BookDetail, BookStub, UserFollow } from 'prisma/prismaContext'

type BookFooterProps = {
  bookDetail: BookDetail|BookStub
  onUpdate?:  () => void
}

const BookFooter = ({bookDetail, onUpdate}:BookFooterProps) => {
  const { notify, loginRequired } = useToast()
  const [cyfrUser] = useCyfrUserContext()
  const {share, follow, like} = useBookApi
  const bookId = bookDetail.id
  const engageProps = cyfrUser ? {bookId, authorId: cyfrUser.id} : undefined
  const followProps = bookDetail && cyfrUser ? {bookId, followerId: cyfrUser.id} : undefined

  const numLikes = (bookDetail.likes?.length??0).toString()
  const numShares = (bookDetail.shares?.length??0).toString()
  const numFollows = (bookDetail.follows?.length??0).toString()
  const numFans = ((bookDetail.follows??[]).filter((f:UserFollow) => f.isFan === true).length).toString()

  const update = (message:string, type:ToastNotifyType = 'info') => {
    notify(message,type)
    onUpdate ?  onUpdate() : {}
  }

  const onFan = () => onFollow(true)

  const onFollow = async (fan=false) => {
    if (!followProps) { 
      loginRequired()
      return null
    }
    const result = await follow({bookId, followerId: cyfrUser.id, isFan: fan===true})
    result 
      ? update(`You are now ${fan === true ? 'stanning' : 'following'} ${bookDetail?.title}. Nice!`)
      : update('Ya that dint work', 'warning')
  }

  const onShare = async () => {
    if (!engageProps) {
      loginRequired()
      return null
    }
    // the share author, not the book author
    const result = await share(engageProps)
    result 
      ? update(`You shared ${bookDetail?.title}.`)
      : update('Ya that dint work', 'warning')
  }

  const onLike = async () => {
    if (!engageProps) {
      loginRequired()
      return null
    }
    const result = await like(engageProps)
    
    result 
      ? update(`You liked ${bookDetail?.title}.`)
      : update('Ya that dint work', 'warning')
  }


  return (
    <div className="flex space-x-4">
    <ShrinkableIconLabel 
      className='border border-opacity-50 border-primary rounded-lg p-2' 
      labelClassName='text-primary' iconClassName='text-primary' 
      label={numLikes} icon={HeartIcon} 
      onClick={onLike}
      />
    <ShrinkableIconLabel className='border border-opacity-50 border-primary rounded-lg p-2' labelClassName='text-primary' iconClassName='text-primary' label={numShares} icon={ShareIcon} onClick={onShare} />
    <ShrinkableIconLabel className='border border-opacity-50 border-primary rounded-lg p-2' labelClassName='text-primary' iconClassName='text-primary' label={numFollows} icon={FollowIcon} onClick={onFollow} />
    <ShrinkableIconLabel className='border border-opacity-50 border-primary rounded-lg p-2' labelClassName='text-primary' iconClassName='text-primary' label={numFans} icon={FireIcon} onClick={onFan} />
    <ShrinkableIconLabel className='border border-opacity-50 border-primary rounded-lg p-2' labelClassName='text-primary' iconClassName='text-primary' label='(NI)' icon={ReplyIcon} />
    <ShrinkableIconLabel className='border border-opacity-50 border-primary rounded-lg p-2' labelClassName='text-primary' iconClassName='text-primary' label='(NI)' icon={BookIcon} />
    <ShrinkableIconLabel className='border border-opacity-50 border-primary rounded-lg p-2' labelClassName='text-primary' iconClassName='text-primary' label='(NI)' icon={StarIcon} />
    <ShrinkableIconLabel className='border border-opacity-50 border-primary rounded-lg p-2' labelClassName='text-primary' iconClassName='text-primary' label='(NI)' icon={DollarIcon} />
  </div>
  )
}

export default BookFooter