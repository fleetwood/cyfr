import useDebug from "../../../hooks/useDebug"
import ErrorPage from "../../../pages/404"
import { BookCategory, BookDetailHook } from "../../../prisma/prismaContext"
import { KeyVal } from "../../../types/props"
import {
  uuid,
  ymd
} from "../../../utils/helpers"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"
import { useToast } from "../../context/ToastContextProvider"
import { InlineTextarea, TailwindSelectInput } from "../../forms"
import HtmlContent from "../../ui/htmlContent"
import {
  FireIcon,
  FollowIcon,
  QuestionMarkIcon,
  ShareIcon
} from "../../ui/icons"
import ShrinkableIconLabel from "../../ui/shrinkableIconLabel"
import Spinner from "../../ui/spinner"
import Toggler from "../../ui/toggler"

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

type BookDetailHeaderProps = {
  bookDetailHook:  BookDetailHook
}

const BookDetailHeader = ({bookDetailHook}:BookDetailHeaderProps) => {
  const { notify, loginRequired } = useToast()
  const [cyfrUser] = useCyfrUserContext()
  const {bookDetail, query, state} = bookDetailHook

  const {isAuthor} = state

  const statusOptions: KeyVal[] = [
    { key: "DRAFT" },
    { key: "MANUSCRIPT" },
    { key: "PRIVATE" },
    { key: "PUBLISHED" },
  ]

  if (query.isLoading) return <Spinner />

  //TODO create an error page
  if (query.error) return <ErrorPage />

  const onFollow = async () => {
    if (!cyfrUser) {
      loginRequired()
      return null
    }
    // const result = await bookApi.follow(cyfrUser.id)
    // if (result) {
    //   notify(`You are now following ${bookDetail?.title}. Nice!`)
    //   invalidate()
    // }
  }

  const onShare = async () => {
    if (!cyfrUser) {
      loginRequired()
      return null
    }
    // const result = await bookApi.share(cyfrUser.id)
    // if (result) {
    //   notify(`You shared ${bookDetail?.title}!`)
    //   invalidate()
    // }
  }

  const onLike = async () => {
    if (!cyfrUser) {
      loginRequired()
      return null
    }
    // const result = await bookApi.like(cyfrUser.id)
    // if (result) {
    //   notify(`You liked ${bookDetail?.title}.`)
    //   invalidate()
    // }
  }

  const updateHook = (content:string) => {
    // bookApi.update({ props: { hook: content.toString() }, autoSave: true})
  }

  const updateActive = (value: boolean) => {
    // bookApi.update({ props: { active: value }, autoSave: true})
  }

  const updateProspect = (value: boolean) => {
    // bookApi.update({props: { prospect: value }, autoSave: true})
  }

  const updateFiction = (value: boolean) => {
    // bookApi.update({props: { fiction: value }, autoSave: true})
  }

  const updateStatus = (value: string) => {
    // bookApi.update({props: { status: value as BookStatus }, autoSave: true})
  }

  const updateGenre = (value: string) => {
    // bookApi.updateGenre(value)
  }

  return bookDetail ? (
    <div>
      <div>
        {isAuthor ? (
          <div>
            <label className="font-semibold w-[50%]">Fiction/Nonfiction</label>
            <Toggler
              checked={bookDetail?.fiction??false}
              setChecked={updateFiction}
              trueLabel="FICTION"
              falseLabel="NON-FICTION"
            />
          </div>
        ) : (
          <div>{bookDetail?.fiction ? "FICTION" : "NON-FICTION"}</div>
        )}
        <div className="flex">
          {isAuthor ? (
            <div>
              <label className="font-semibold w-[50%]">Genre (TODO)</label>
              <TailwindSelectInput
                value={bookDetail?.genre.title}
                setValue={updateGenre}
                options={[]}
              />
            </div>
          ) : (
            <span className="font-semibold text-primary-content mr-4">
              {bookDetail.genre.title}
            </span>
          )}
          {/* TODO Categories view is broken in db */}
          {isAuthor ? (
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
          ) : (
            bookDetail.categories?.filter(c => c!==null).map((cat:BookCategory) => (
              <span className="italic mr-2" key={uuid()}>
                {cat.title}
              </span>
            ))
          )}
        </div>
        <div>{bookDetail.words} words</div>
        <div className="font-ibarra">
          {isAuthor ? (
            <InlineTextarea
              content={bookDetail.hook}
              setContent={updateHook}
              onSave={() => notify('This was changed from bookApi to bookDetail')}
            />
          ) : (
            <HtmlContent content={bookDetail.hook??''} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <div className=" px-2 mb-2 mr-4 border border-opacity-50 border-secondary rounded-lg">
          {isAuthor ? (
            <div>
              <label className="font-semibold w-[50%]">Status</label>
              <TailwindSelectInput
                options={statusOptions}
                value={bookDetail.status?.toString()}
                setValue={updateStatus}
              />
            </div>
          ) : (
            <div className="flex justify-between">
              <label className="font-semibold w-[50%]">Status</label>
              <span className="text-secondary">{bookDetail.status}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-secondary rounded-lg">
          <label className="font-semibold w-[50%]">Completed</label>
          <span className="text-secondary">
            {bookDetail.completeAt ? ymd(new Date(bookDetail.completeAt)) : "TBD"}
          </span>
        </div>
        <div
          className={`${
            isAuthor ? "" : "flex justify-between"
          } px-2 mb-2 mr-4 border border-opacity-50 border-secondary rounded-lg`}
        >
          <label className="font-semibold w-[50%]">Prospecting</label>
          {isAuthor ? (
            <div>
              <Toggler
                checked={bookDetail.prospect}
                setChecked={updateProspect}
                falseLabel="No Agents"
                trueLabel="Allow Agents"
              />
            </div>
          ) : (
            <span className="text-secondary">
              {bookDetail.prospect ? "YES" : "NO"}
            </span>
          )}
        </div>
        <div
          className={`${
            isAuthor ? "" : "flex justify-between"
          } px-2 mb-2 mr-4 border border-opacity-50 border-secondary rounded-lg`}
        >
          <label className="font-semibold w-[50%]">Public</label>
          {isAuthor ? (
            <Toggler
              checked={bookDetail.active}
              setChecked={updateActive}
              falseLabel="Not Visible"
              trueLabel="Visible"
            />
          ) : (
            <span className="text-secondary">
              {bookDetail.active ? "PUBLIC" : "HIDDEN"}
            </span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <BookInfo label="Shares" icon={ShareIcon} onClick={onShare} info={bookDetail.shares?.length || 0} />
        <BookInfo label="Follows" icon={FollowIcon} onClick={onFollow} info={bookDetail.follows?.length || 0} />
        <BookInfo label="Fans" icon={FireIcon} info='NI' />
        <BookInfo label="Comments" variant={'NI'} />
        <BookInfo label="Reads" variant={'NI'} />
        <BookInfo label="Reviews" variant={'NI'} />
        <BookInfo label="Purchases" variant={'NI'} />
      </div>
    </div>
  )
  : <><p>Should throw an error here.</p></>
}

export default BookDetailHeader
