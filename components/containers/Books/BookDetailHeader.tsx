import { useCyfrUserContext } from "components/context/CyfrUserProvider"
import { ToastNotifyType, useToast } from "components/context/ToastContextProvider"
import { BookDetailProps } from "components/layouts/BookDetailLayout"
import HtmlContent from "components/ui/htmlContent"
import { FireIcon, FollowIcon, HeartIcon, QuestionMarkIcon, ShareIcon } from "components/ui/icons"
import ShrinkableIconLabel from "components/ui/shrinkableIconLabel"
import useDebug from "hooks/useDebug"
import { BookCategory, BookEngageProps, UserFollow } from "prisma/prismaContext"
import { KeyVal } from "types/props"
import { abbrNum, uuid } from "utils/helpers"
import BookEditHeader from "./BookEditHeader"
import BookCover, { BookCoverVariant } from "./BookCover"
import useBookApi from "prisma/hooks/useBookApi"

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
  const {cyfrUser} = useCyfrUserContext()
  const {share, follow, like, save} = useBookApi()
  const bookId = bookDetail.id
  const engageProps:BookEngageProps|undefined = bookDetail && cyfrUser ? {bookId, creatorId: cyfrUser.id} : undefined
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
    const result = await follow({bookId, followerId: cyfrUser.id, isFan: fan===true})
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
    const result = await share(engageProps)
    result 
      ? updated(`You shared ${bookDetail?.title}.`)
      : updated('Ya that dint work', 'warning')
  }

  const onLike = async () => {
    if (!engageProps) {
      loginRequired()
      return null
    }
    const result = await like(engageProps)
    
    result 
      ? updated(`You liked ${bookDetail?.title}.`)
      : updated('Ya that dint work', 'warning')
  }

  return bookDetail ? 
    isAuthor ? (
      <BookEditHeader bookDetail={bookDetail} onUpdate={onUpdate} />
    ) : (
    <div>
      <div>
        <BookCover book={bookDetail} link={false} variant={BookCoverVariant.COVER} />
        <div>{bookDetail?.fiction ? "FICTION" : "NON-FICTION"}</div>
        <div className="flex">
          <span className="font-semibold text-primary-content mr-4">
            {bookDetail.genre?.title}
          </span>
            
          {/* TODO Categories view is broken in db */}
          {/* {bookDetail.categories?.filter(c => c!==null).map((cat:BookCategory) => (
            <span className="italic mr-2" key={uuid()}>
              {cat.title}
            </span>
          ))} */}
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
            {bookDetail.visible ? "PUBLIC" : "HIDDEN"}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <BookInfo label="Likes" icon={HeartIcon} onClick={onLike} info={abbrNum(bookDetail._count.likes)} />
        <BookInfo label="Shares" icon={ShareIcon} onClick={onShare} info={abbrNum(bookDetail._count.shares)} />
        <BookInfo label="Follows" icon={FollowIcon} onClick={onFollow} info={abbrNum(bookDetail._count.follows)} />
        <BookInfo label="Fans" icon={FireIcon} onClick={onFan} info={fans.length || 0} />
        <BookInfo label="Comments" info={abbrNum(bookDetail.commentThread?.comments.length)}  variant={'NI'} />
        <BookInfo label="Reads" info={abbrNum(bookDetail.reads)} variant={'NI'} />
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
