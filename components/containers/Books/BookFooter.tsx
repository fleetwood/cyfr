import React from 'react'
import { valToLabel } from '../../../utils/helpers'
import { HeartIcon, ShareIcon, UserIcon, ReplyIcon, BookIcon, StarIcon, DollarIcon, FollowIcon } from '../../ui/icons'
import { BookDetail, BookStub } from '../../../prisma/prismaContext'
import { useToast } from '../../context/ToastContextProvider'
import { useCyfrUserContext } from '../../context/CyfrUserProvider'
import BookApi from '../../../prisma/api/book'
import ShrinkableIconLabel from '../../ui/shrinkableIconLabel'

type BookFooterProps = {
  bookDetail: BookDetail|BookStub
  onUpdate?:  () => void
}

const BookFooter = ({bookDetail, onUpdate}:BookFooterProps) => {
  const { notify, loginRequired } = useToast()
  const [cyfrUser] = useCyfrUserContext()
  const {share, follow, like} = BookApi()
  const bookId = bookDetail.id
  const data = {bookId}

  const numLikes = (bookDetail.likes?.length??0).toString()
  const numShares = (bookDetail.shares?.length??0).toString()
  const numFollows = (bookDetail.follows?.length??0).toString()

  const update = () => {
    onUpdate ? onUpdate() : {}
  }

  const onFollow = async () => {
    if (!cyfrUser) {
      loginRequired()
      return null
    }
    const result = await follow(bookId, cyfrUser.id)
    if (result) {
      notify(`You are now following ${bookDetail?.title}. Nice!`)
      update()
    }
  }

  const onShare = async () => {
    if (!cyfrUser) {
      loginRequired()
      return null
    }
    const result = await share(bookId, cyfrUser.id)
    if (result) {
      notify(`You shared ${bookDetail?.title}!`)
      update()
    }
  }

  const onLike = async () => {
    if (!cyfrUser) {
      loginRequired()
      return null
    }
    const result = await like(bookId, cyfrUser.id)
    if (result) {
      notify(`You liked ${bookDetail?.title}.`)
      update()
    }
  }

  return (
    <div className="flex space-x-4">
    <ShrinkableIconLabel 
      className='border border-opacity-50 border-primary rounded-lg p-2' 
      labelClassName='text-primary' iconClassName='text-primary' 
      label={numLikes} icon={HeartIcon} 
      onClick={onLike}
      />
    <ShrinkableIconLabel className='border border-opacity-50 border-primary rounded-lg p-2' labelClassName='text-primary' iconClassName='text-primary' label={numShares} icon={ShareIcon} />
    <ShrinkableIconLabel className='border border-opacity-50 border-primary rounded-lg p-2' labelClassName='text-primary' iconClassName='text-primary' label={numFollows} icon={FollowIcon} />
    <ShrinkableIconLabel className='border border-opacity-50 border-primary rounded-lg p-2' labelClassName='text-primary' iconClassName='text-primary' label='(NI)' icon={ReplyIcon} />
    <ShrinkableIconLabel className='border border-opacity-50 border-primary rounded-lg p-2' labelClassName='text-primary' iconClassName='text-primary' label='(NI)' icon={BookIcon} />
    <ShrinkableIconLabel className='border border-opacity-50 border-primary rounded-lg p-2' labelClassName='text-primary' iconClassName='text-primary' label='(NI)' icon={StarIcon} />
    <ShrinkableIconLabel className='border border-opacity-50 border-primary rounded-lg p-2' labelClassName='text-primary' iconClassName='text-primary' label='(NI)' icon={DollarIcon} />
  </div>
  )
}

export default BookFooter