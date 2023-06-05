import useDebug from "../../../hooks/useDebug"
import useBookApi from "../../../prisma/hooks/useBookApi"
import { BookCategory, UserFollow } from "../../../prisma/prismaContext"
import { KeyVal } from "../../../types/props"
import {
  uuid
} from "../../../utils/helpers"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"
import { ToastNotifyType, useToast } from "../../context/ToastContextProvider"
import { BookDetailProps } from "../../layouts/BookDetailLayout"
import HtmlContent from "../../ui/htmlContent"
import {
  FireIcon,
  FollowIcon,
  HeartIcon,
  QuestionMarkIcon,
  ShareIcon
} from "../../ui/icons"
import ShrinkableIconLabel from "../../ui/shrinkableIconLabel"
import BookAuthorHeader from "./BookAuthorHeader"

const { jsonBlock, debug } = useDebug("components/Books/BookDetailHeader")

type BookInfoProps = {
  className?:       string
  labelClassName?:  string,
  iconClassName?:   string,
  label:            string
  icon?:            JSX.Element,
  info?:            string | number | null
  onClick?:         () => void,
  variant?:         'primary' | 'secondary' | 'accent' | 'neutral' | 'NI'
}

const BookInfo = ({className, label, labelClassName, icon, iconClassName, info, onClick = () => {}, variant = 'primary'}:BookInfoProps) => {
  const variantClass = variant === 'NI' ? 'neutral' : variant
  const click = variant === 'NI' ? () => debug('BookInfo click', 'Not implemented') : onClick
  return (
  <div className={className ?? `flex justify-between p-2 mb-2 mr-4 bg-${variantClass} rounded-lg`}>
    <ShrinkableIconLabel
      iconClassName={iconClassName ?? labelClassName ?? `text-${variantClass}-content`}
      labelClassName={labelClassName ?? `text-${variantClass}-content font-semibold`}
      label={label}
      icon={icon ?? QuestionMarkIcon}
      onClick={click}
    />
    <span className={labelClassName ?? `text-${variantClass}-content`}>
      {variant === 'NI' ? '[NI]' : info ?? ''}
    </span>
  </div>
)}

const BookDetailHeader = ({bookDetail, onUpdate}:BookDetailProps) => {  
  const { notify, loginRequired } = useToast()
  const [cyfrUser] = useCyfrUserContext()
  const {shareBook, followBook, likeBook, save} = useBookApi()
  const bookId = bookDetail.id
  const engageProps = bookDetail && cyfrUser ? {bookId, authorId: cyfrUser.id} : undefined
  const followProps = bookDetail && cyfrUser ? {bookId, followerId: cyfrUser.id} : undefined

  const isAuthor = cyfrUser ? (bookDetail?.authors??[]).filter(a => a.id === cyfrUser?.id).length > 0 : false

  const fans = (bookDetail?.follows??[]).filter((f:UserFollow) => f.isFan === true)

  const statusOptions: KeyVal[] = [
    { key: "DRAFT" },
    { key: "MANUSCRIPT" },
    { key: "PRIVATE" },
    { key: "PUBLISHED" },
  ]

  const updated = (message:string, type:ToastNotifyType = 'info', showNotice = true) => {
    debug('updated')
    showNotice ? notify(message,type) : {}
    onUpdate ?  onUpdate() : {}
  }

  const onFan = () => onFollow(true)

  const onFollow = async (fan=false) => {
    if (!followProps) { 
      loginRequired()
      return null
    }
    const result = await followBook({bookId, followerId: cyfrUser.id, isFan: fan===true})
    result 
      ? updated(`You are now ${fan === true ? 'stanning' : 'following'} ${bookDetail?.title}. Nice!`)
      : updated('Ya that dint work', 'warning')
  }

  const onShare = async () => {
    if (!engageProps) {
      loginRequired()
      return null
    }
    // the share author, not the book author
    const result = await shareBook(engageProps)
    result 
      ? updated(`You shared ${bookDetail?.title}.`)
      : updated('Ya that dint work', 'warning')
  }

  const onLike = async () => {
    if (!engageProps) {
      loginRequired()
      return null
    }
    const result = await likeBook(engageProps)
    
    result 
      ? updated(`You liked ${bookDetail?.title}.`)
      : updated('Ya that dint work', 'warning')
  }

  return bookDetail ? 
    isAuthor ? (
      <BookAuthorHeader bookDetail={bookDetail} onUpdate={onUpdate} />
    ) : (
    <div>
      <div>
        <div>{bookDetail?.fiction ? "FICTION" : "NON-FICTION"}</div>
        <div className="flex">
          <span className="font-semibold text-primary-content mr-4">
            {bookDetail.genre?.title}
          </span>
            
          {/* TODO Categories view is broken in db */}
          {bookDetail.categories?.filter(c => c!==null).map((cat:BookCategory) => (
            <span className="italic mr-2" key={uuid()}>
              {cat.title}
            </span>
          ))}
        </div>
        <div>{bookDetail.words} words</div>
        <div className="font-ibarra">
          <HtmlContent content={bookDetail.hook??''} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <div className=" px-2 mb-2 mr-4 border border-opacity-50 border-secondary rounded-lg">
          <div className="flex justify-between">
            <label className="font-semibold w-[50%]">Status</label>
            <span className="text-secondary">{bookDetail.status}</span>
          </div>
        </div>
          <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-secondary rounded-lg">
            <label className="font-semibold w-[50%]">Completed</label>
            <span className="text-secondary">
              {/* {completedAt?ymd(completedAt):'TBD'} */}
            </span>
          </div>
        <div
          className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-secondary rounded-lg">
          <label className="font-semibold w-[50%]">Prospecting</label>
          <span className="text-secondary">
            {bookDetail.prospect ? "YES" : "NO"}
          </span>
        </div>
        <div
          className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-secondary rounded-lg">
          <label className="font-semibold w-[50%]">Public</label>
          <span className="text-secondary">
            {bookDetail.active ? "PUBLIC" : "HIDDEN"}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <BookInfo label="Likes" icon={HeartIcon} onClick={onLike} info={bookDetail.likes?.length || 0} />
        <BookInfo label="Shares" icon={ShareIcon} onClick={onShare} info={bookDetail.shares?.length || 0} />
        <BookInfo label="Follows" icon={FollowIcon} onClick={onFollow} info={bookDetail.follows?.length || 0} />
        <BookInfo label="Fans" icon={FireIcon} onClick={onFan} info={fans.length || 0} />
        <BookInfo label="Comments" variant={'NI'} />
        <BookInfo label="Reads" variant={'NI'} />
        <BookInfo label="Reviews" variant={'NI'} />
        <BookInfo label="Purchases" variant={'NI'} />
      </div>
    </div>
  )
  : // no book detail
  <> 
    <p>Should throw an error here.</p>
  </>
}

export default BookDetailHeader
