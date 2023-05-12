import React from 'react'
import { valToLabel } from '../../../utils/helpers'
import { HeartIcon, ShareIcon, UserIcon, ReplyIcon, BookIcon, StarIcon, DollarIcon } from '../../ui/icons'
import { BookDetail, BookStub } from '../../../prisma/prismaContext'

type BookFooterProps = {
    book: BookDetail|BookStub
}

const BookFooter = ({book}:BookFooterProps) => {
  return (
    <div className="flex">
    <div className="flex px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
      <label className="font-semibold mr-2">{HeartIcon}</label>
      <span className="text-primary">{(book.likes||[]).length}</span>
    </div>
    <div className="flex px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
      <label className="font-semibold mr-2">{ShareIcon}</label>
      <span className="text-primary">{(book.shares||[]).length}</span>
    </div>
    <div className="flex px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
      <label className="font-semibold mr-2">{UserIcon}</label>
      <span className="text-primary">{(book.follows||[]).length}</span>
    </div>
    <div className="flex px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
      <label className="font-semibold mr-2">{ReplyIcon}</label>
      <span className="text-primary">(NI)</span>
    </div>
    <div className="flex px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
      <label className="font-semibold mr-2">{BookIcon}</label>
      <span className="text-primary">(NI)</span>
    </div>
    <div className="flex px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
      <label className="font-semibold mr-2">{StarIcon}</label>
      <span className="text-primary">(NI)</span>
    </div>
    <div className="flex px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
      <label className="font-semibold mr-2">{DollarIcon}</label>
      <span className="text-primary">(NI)</span>
    </div>
  </div>
  )
}

export default BookFooter