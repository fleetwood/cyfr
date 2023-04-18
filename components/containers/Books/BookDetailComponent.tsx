
import { useState } from "react"
import ReactHtmlParser from "react-html-parser"
import useBookApi from "../../../hooks/useBookApi"
import useDebug from "../../../hooks/useDebug"
import { BookDetail, BookStatus } from "../../../prisma/prismaContext"
import { isBookAuthor, onlyFans, uniqueKey, uuid, valToLabel, ymd } from "../../../utils/helpers"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"
import { useToast } from "../../context/ToastContextProvider"
import {InlineTextarea, TailwindSelectInput} from "../../forms"
import Avatar from "../../ui/avatar"
import EZButton from "../../ui/ezButton"
import { FeatherIcon, FireIcon, FollowIcon, HeartIcon, ReplyIcon, ShareIcon } from "../../ui/icons"
import ShrinkableIconLabel from "../../ui/shrinkableIconLabel"
import Toggler from "../../ui/toggler"
import GalleryPhotoswipe from "../Gallery/GalleryPhotoswipe"
import BookCover, { BookCoverVariant } from "./BookCover"
import { KeyVal } from "../../../types/props"

const {jsonBlock, debug} = useDebug('components/Books/BookDetailComponent', 'DEBUG')

type BookComponentProps = {
  bookDetail: BookDetail
  onUpdate?:  () => void
}

const BookDetailComponent = ({bookDetail, onUpdate}: BookComponentProps) => {
  const {notify, loginRequired} = useToast()
  const [cyfrUser] = useCyfrUserContext()
  const {like,follow,share, book, update, save} = useBookApi(bookDetail)
  const isAuthor = isBookAuthor(bookDetail, cyfrUser)
  const [saveReady, setSaveReady] = useState(false)
  const statusOptions:KeyVal[] = [
    {key: 'DRAFT'},
    {key: 'MANUSCRIPT'},
    {key: 'PRIVATE'},
    {key: 'PUBLISHED'}
  ]

  const onFollow = async () => {
    if (!cyfrUser) {
      loginRequired()
      return null
    }
    const result = await follow(cyfrUser.id)
    if (result) {
      notify(`You are now following ${book.title}. Nice!`)
    }
  }

  const onShare = async () => {
    if (!cyfrUser) {
      loginRequired()
      return null
    }
    const result = await share(cyfrUser.id)
    if (result) {
      notify(`You shared ${book.title}!`)
    }
  }

  const onLike = async () => {
    if (!cyfrUser) {
      loginRequired()
      return null
    }
    const result = await like(cyfrUser.id)
    if (result) {
      notify(`You liked ${book.title}.`)
    }
  }

  const updatePanel = (html?:string|null) => {
    update({back: html?.toString()})
    setSaveReady(true)
  }

  const updateSynopsis = (html?:string|null) => {
    update({synopsis: html?.toString()})
    setSaveReady(true)
  }

  const updateHook = (html?:string|null) => {
    update({hook: html?.toString()})
    setSaveReady(true)
  }

  const updateActive = (value:boolean) => {
    update({active: value})
    setSaveReady(true)
  }

  const updateProspect = (value:boolean) => {
    update({prospect: value})
    setSaveReady(true)
  }

  const updateFiction = (value:boolean) => {
    update({fiction: value})
    setSaveReady(true)
  }

  const updateStatus = (value:string) => {
    update({status: value as BookStatus})
    setSaveReady(true)
  }

  const onSave = () => {
    save()
    setSaveReady(false)
  }

  return (
    <div>
      {isAuthor && saveReady &&
        <EZButton label="SAVE" whenClicked={onSave} />
      }
      {book.authors && book.authors.length > 1 &&
        <div>
          <h3>Authors</h3>
          {book.authors.map((author) => 
            <Avatar user={author} sz="lg" key={uniqueKey(book, author)} />
          )}
        </div>
      }

      {book.cover &&
        <BookCover book={book} variant={BookCoverVariant.COVER} link={false} authorAvatars={false} />
      }
      
      <div>
        {isAuthor 
          ? <div><Toggler checked={book.fiction} setChecked={updateFiction} trueLabel="FICTION" falseLabel="NON-FICTION" /></div>
          : <div>{book.fiction ? 'FICTION' : 'NON-FICTION'}</div>
        }
        <div className="flex">
          <span className="font-semibold text-primary-content mr-4">{book.genre.title}</span>
          {/* TODO Categories view is broken in db */}
          {book.categories.filter(c => c!==null).map(cat => (<span className="italic mr-2" key={uuid()}>{cat.title}</span>))}
        </div>
        <div>{book.words} words</div>
        <div className="font-ibarra">{isAuthor 
          ? <InlineTextarea content={book.hook} setContent={updateHook} onSave={save} />
          : ReactHtmlParser(book.hook!)
        }</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        
          {isAuthor 
            ? <div>
                <TailwindSelectInput options={statusOptions} value={book.status?.toString()} setValue={updateStatus} />
              </div>
            : <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-secondary rounded-lg">
                <label className="font-semibold w-[50%]">Status</label><span className="text-secondary">{book.status}</span>
              </div>
          }
        <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-secondary rounded-lg">
          <label className="font-semibold w-[50%]">Completed</label>
          <span className="text-secondary">{book.completeAt ? ymd(new Date(book.completeAt)) : 'TBD'}</span>
        </div>
        <div className={`${isAuthor ? '' : 'flex justify-between'} px-2 mb-2 mr-4 border border-opacity-50 border-secondary rounded-lg`}>
          <label className="font-semibold w-[50%]">Prospecting</label>
          {isAuthor 
            ? <div><Toggler checked={book.prospect} setChecked={updateProspect} falseLabel="No Agents" trueLabel="Allow Agents" /></div>
            : <span className="text-secondary">{book.prospect ? 'YES' : 'NO'}</span>
          }
        </div>
        <div className={`${isAuthor ? '' : 'flex justify-between'} px-2 mb-2 mr-4 border border-opacity-50 border-secondary rounded-lg`}>
          <label className="font-semibold w-[50%]">Public</label>
          {isAuthor 
            ? <Toggler checked={book.active} setChecked={updateActive} falseLabel="Not Visible" trueLabel="Visible" />
            : <span className="text-secondary">{book.active ? 'PUBLIC' : 'HIDDEN'}</span>
          }
        </div>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
            <ShrinkableIconLabel iconClassName="text-primary-content" labelClassName="text-primary-content font-semibold" label="Likes" icon={HeartIcon} onClick={onLike} />
            <span className="text-primary">{valToLabel(book.likes?.length??0)}</span>
          </div>
          <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
            <ShrinkableIconLabel iconClassName="text-primary-content" labelClassName="text-primary-content font-semibold" label="Shares" icon={ShareIcon} onClick={onShare} />
            <span className="text-primary">{valToLabel(book.shares?.length??0)}</span>
          </div>
          <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
            <ShrinkableIconLabel iconClassName="text-primary-content" labelClassName="text-primary-content font-semibold" label="Follows" icon={FollowIcon} onClick={onFollow} />
            <span className="text-primary">{valToLabel(book.follows?.length??0)}</span>
          </div>
          <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
            <ShrinkableIconLabel iconClassName="text-primary-content" labelClassName="text-primary-content font-semibold" label="Fans" icon={FireIcon} onClick={() => {}} />
            <span className="text-primary">{valToLabel(onlyFans(book.follows??[]).length)}</span>
          </div>
          <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
            <ShrinkableIconLabel iconClassName="text-primary-content" labelClassName="text-primary-content font-semibold" label="Comments" icon={ReplyIcon} onClick={() => {}} />
            <span className="text-primary">(NI)</span>
          </div>
          <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
            <label className="font-semibold w-[50%]">Reads</label>
            <span className="text-primary">(NI)</span>
          </div>
          <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
            <label className="font-semibold w-[50%]">Reviews</label>
            <span className="text-primary">(NI)</span>
          </div>
          <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
            <label className="font-semibold w-[50%]">Purchases</label>
            <span className="text-primary">(NI)</span>
          </div>
        </div>

      <div className="my-4">
        <div className="flex">
          <h3>Back Panel</h3>
          {isAuthor && FeatherIcon}
        </div>
        <div className="font-ibarra">{isAuthor 
          ? <InlineTextarea content={book.back} setContent={updatePanel} onSave={save} />
          : ReactHtmlParser(book.back!)
        }</div>
      </div>

      <div className="my-4">
        <div className="flex">
          <h3>Synopsis</h3>
          {isAuthor && FeatherIcon}
        </div>
        <div className="font-ibarra">{isAuthor 
          ? <InlineTextarea content={book.synopsis} setContent={updateSynopsis} onSave={save} />
          : ReactHtmlParser(book.synopsis!)
        }</div>
      </div>
      
      {((book.characters !== undefined && book.characters.length > 0) || isAuthor &&
      <div className="my-4">
        <div className="flex">
          <h3>Characters</h3>
          {isAuthor && FeatherIcon}
        </div>
      </div>
      )}

      {(book.gallery || isAuthor) && 
      <div className="my-4">
        <div className="flex">
          <h3>Gallery</h3>
          {isAuthor && FeatherIcon}
        </div>
        <GalleryPhotoswipe gallery={book.gallery} />
      </div>
      }

      {isAuthor && saveReady &&
        <EZButton label="SAVE" whenClicked={onSave} />
      }
      {isAuthor && jsonBlock(book)}
      
    </div>
  )
}

export default BookDetailComponent
