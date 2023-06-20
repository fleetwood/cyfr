import { useState } from "react"
import useDebug from "hooks/useDebug"
import ErrorPage from "pages/404"
import { BookCategory, BookStatus, UserFollow } from "prisma/prismaContext"
import { KeyVal } from "types/props"
import { now, uuid } from "utils/helpers"
import ShrinkableIconLabel from "components/ui/shrinkableIconLabel"
import { FireIcon, FollowIcon, HeartIcon, QuestionMarkIcon, ShareIcon } from "components/ui/icons"
import { ToastNotifyType, useToast } from "components/context/ToastContextProvider"
import { useCyfrUserContext } from "components/context/CyfrUserProvider"
import { useBookApi } from "prisma/hooks/useBookApi"
import { BookDetailProps } from "components/layouts/BookDetailLayout"
import { InlineTextarea, TailwindInput, TailwindSelectInput } from "components/forms"
import EZButton from "components/ui/ezButton"
import Toggler from "components/ui/toggler"
import TailwindDatepicker from "components/forms/TailwindDatepicker"
import BookCover, { BookCoverVariant } from "./BookCover"
import BookEditCover from "./BookEditCover"

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

const BookEditHeader = ({bookDetail, onUpdate}:BookDetailProps) => {  
  const { notify, loginRequired } = useToast()
  const [cyfrUser] = useCyfrUserContext()
  const {share, follow, like, save} = useBookApi
  const bookId = bookDetail.id
  const engageProps = bookDetail && cyfrUser ? {bookId, authorId: cyfrUser.id} : undefined
  const followProps = bookDetail && cyfrUser ? {bookId, followerId: cyfrUser.id} : undefined

  const isAuthor = cyfrUser ? (bookDetail?.authors??[]).filter(a => a.id === cyfrUser?.id).length > 0 : false
  if (!isAuthor) return <ErrorPage message="You are not authorized to do that." />

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

  const update = async (props: any, showNotice=true) => {
    try {
      const saved = await save({...bookDetail, ...props})
      if (saved) {
        updated('Saved!','info', showNotice)
      } else {
        updated('That dint work', 'warning', showNotice)
      } 
    } catch (error) {
      notify('Ya that totally broke', 'warning')
    }
  }

  const [title, setTitle] = useState<string|null>(bookDetail?.title)
  const updateTitle = async () => update({title})

  const [hook, setHook] = useState<string|null>(bookDetail?.hook)
  const updateHook = async () => update({hook})

  const [active, setactive] = useState<boolean>(bookDetail?.active)
  const updateActive = (bool:Boolean) => update({active: bool}, false)

  const updateProspect = (bool:Boolean) => update({prospect: bool}, false)
  
  const updateFiction = (bool:Boolean) => update({fiction: bool}, false)

  const updateStatus = (value:string) => update({status: value as BookStatus || 'DRAFT'}, false)
  
  const [completedAt, setCompletedAt] = useState<Date|null>(bookDetail?.completeAt)
  const updateCompletedAt = (value:Date|null) => {
    const d = value ?? ''
    debug('updateCompletedAt', {value, d})
    update({completeAt: d}, true)
  }

  const updateGenre = (value: string) => {
    // bookApi.updateGenre(value)
  }

  return bookDetail ? (
    <div>
      <div>
        <div className="p-2 mb-2 mr-4 border border-opacity-50 border-neutral rounded-lg">
          <label className="font-semibold">Title</label>
          <div className="font-ibarra flex space-x-4">
            <TailwindInput
              type="text"
              value={title}
              setValue={setTitle}
              />
            <EZButton label="SAVE" variant="secondary" onClick={updateTitle} />
          </div>
        </div>
        <BookEditCover book={bookDetail} onUpdate={() => updated('Cover updated!')} />
        <div>
          <label className="font-semibold w-[50%]">Fiction/Nonfiction</label>
          <Toggler
            checked={bookDetail?.fiction??false}
            setChecked={updateFiction}
            trueLabel="FICTION"
            falseLabel="NON-FICTION"
          />
        </div>
        <div className="flex">
          <div>
            <label className="font-semibold w-[50%]">Genre (TODO)</label>
            <TailwindSelectInput
              value={bookDetail?.genre.title}
              setValue={updateGenre}
              options={[]}
            />
          </div>
          {/* TODO Categories view is broken in db */}
          <div>
            <label className="font-semibold w-[50%]">Categories</label>
            <div>
              <p className="text-xs">
                TODO: Create categories upsert. Don't forget to include
                existing categories, and the ability to create new ones.
              </p>
              {bookDetail.categories?.filter(c => c!==null).map((cat:BookCategory) => (
                <span className="italic mr-2" key={uuid()}>
                  {cat.title}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div>{bookDetail.words} words</div>
        <div className="p-2 mb-2 mr-4 border border-opacity-50 border-neutral rounded-lg">
          <label className="font-semibold">Hook</label>
          <div className="font-ibarra flex space-x-4 my-2">
            <InlineTextarea
              content={hook}
              setContent={setHook}
              />
          </div>
          <EZButton label="SAVE" variant="secondary" onClick={updateHook} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <div className="px-2 mb-2 mr-4 border border-opacity-50 border-secondary rounded-lg">  
          <label className="font-semibold w-[50%]">Status</label>
          <div className="py-2">
            <TailwindSelectInput
              options={statusOptions}
              value={bookDetail.status?.toString()}
              setValue={updateStatus}
              className="text-sm"
            />  
          </div>
        </div>

        <div className="px-2 mb-2 mr-4 border border-opacity-50 border-secondary rounded-lg">
          <label className="font-semibold w-[50%]">Completed</label>
          <div className="min-w-full py-2">
            {/* <Datepicker value={completedAt??null} onChange={updateCompletedAt} /> */}
            <TailwindDatepicker value={completedAt??now()} onChange={updateCompletedAt} />
          </div>
        </div>
        <div className='px-2 mb-2 mr-4 border border-opacity-50 border-secondary rounded-lg'>
          <label className="font-semibold w-[50%]">Prospecting</label>
          <div className="py-2">
            <Toggler
              checked={bookDetail.prospect}
              setChecked={updateProspect}
              falseLabel="No Agents"
              trueLabel="Allow Agents"
              labelClassName='text-xs'
            />
          </div>
        </div>
        <div className='px-2 mb-2 mr-4 border border-opacity-50 border-secondary rounded-lg'>
          <label className="font-semibold w-[50%]">Public</label>
          <div className="py-2">
            <Toggler
              checked={bookDetail.active}
              setChecked={updateActive}
              falseLabel="Not Visible"
              trueLabel="Visible"
              labelClassName='text-xs'
            />
          </div>
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
  : <><p>Weird, didn't get no book detail....</p></>
}

export default BookEditHeader