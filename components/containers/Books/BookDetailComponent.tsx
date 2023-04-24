import { useState } from "react"
import ReactHtmlParser from "react-html-parser"
import useBookApi from "../../../hooks/useBookApi"
import useDebug from "../../../hooks/useDebug"
import { BookDetail, BookStatus, Chapter, ChapterDetail, UserStub } from "../../../prisma/prismaContext"
import {
  isBookAuthor,
  onlyFans,
  uniqueKey,
  uuid,
  valToLabel,
  ymd,
} from "../../../utils/helpers"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"
import { useToast } from "../../context/ToastContextProvider"
import { InlineTextarea, TailwindSelectInput } from "../../forms"
import Avatar from "../../ui/avatar"
import EZButton from "../../ui/ezButton"
import {
  FeatherIcon,
  FireIcon,
  FollowIcon,
  HeartIcon,
  ReplyIcon,
  ShareIcon,
} from "../../ui/icons"
import ShrinkableIconLabel from "../../ui/shrinkableIconLabel"
import Toggler from "../../ui/toggler"
import GalleryPhotoswipe from "../Gallery/GalleryPhotoswipe"
import BookCover, { BookCoverVariant } from "./BookCover"
import { KeyVal } from "../../../types/props"
import CreateChapterModal, { OpenChapterModalButton } from "../Chapter/CreateChapterModal"
import Spinner from "../../ui/spinner"
import ChapterList from "../Chapter/ChapterList"
import { BookApi } from "../../../types/bookApi.def"
import ChapterEdit from "../Chapter/ChapterEdit"

const { jsonBlock, debug } = useDebug(
  "components/Books/BookDetailComponent",
  "DEBUG"
)

const ErrorPage = () => (
  <div>
    <h3>404 or smth</h3>
    <p>Weird. That Didn't Work.</p>
  </div>
)

type BookDetailComponentProps = {
  bookApi: BookApi
}

const BookDetailComponent = ({bookApi}:BookDetailComponentProps) => {
  const { notify, loginRequired } = useToast()
  const [cyfrUser] = useCyfrUserContext()
  const {bookDetail, isLoading, error, invalidate, isAuthor} = bookApi
  const [saveReady, setSaveReady] = useState(false)
  const [editChapter, setEditChapter] = useState<Chapter|null>()

  const statusOptions: KeyVal[] = [
    { key: "DRAFT" },
    { key: "MANUSCRIPT" },
    { key: "PRIVATE" },
    { key: "PUBLISHED" },
  ]

  if (isLoading) return <Spinner />

  //TODO create an error page
  if (error) return <ErrorPage />

  const onFollow = async () => {
    if (!cyfrUser) {
      loginRequired()
      return null
    }
    const result = await bookApi.follow(cyfrUser.id)
    if (result) {
      notify(`You are now following ${bookDetail?.title}. Nice!`)
    }
  }

  const onShare = async () => {
    if (!cyfrUser) {
      loginRequired()
      return null
    }
    const result = await bookApi.share(cyfrUser.id)
    if (result) {
      notify(`You shared ${bookDetail?.title}!`)
    }
  }

  const onLike = async () => {
    if (!cyfrUser) {
      loginRequired()
      return null
    }
    const result = await bookApi.like(cyfrUser.id)
    if (result) {
      notify(`You liked ${bookDetail?.title}.`)
    }
  }

  const updatePanel = (html?: string | null) => {
    bookApi.update({ back: html?.toString() })
    setSaveReady(true)
  }

  const updateSynopsis = (html?: string | null) => {
    bookApi.update({ synopsis: html?.toString() })
    setSaveReady(true)
  }

  const updateHook = (content:string) => {
    bookApi.update({ hook: content.toString() })
    setSaveReady(true)
  }

  const updateActive = (value: boolean) => {
    bookApi.update({ active: value })
    setSaveReady(true)
  }

  const updateProspect = (value: boolean) => {
    bookApi.update({ prospect: value })
    setSaveReady(true)
  }

  const updateFiction = (value: boolean) => {
    bookApi.update({ fiction: value })
    setSaveReady(true)
  }

  const updateStatus = (value: string) => {
    bookApi.update({ status: value as BookStatus })
    setSaveReady(true)
  }

  const updateGenre = (value: string) => {
    bookApi.update({ genreId: value })
    setSaveReady(true)
  }

  const onSave = () => {
    bookApi.save()
    setSaveReady(false)
  }

  return bookDetail ? (

    <div>
      {isAuthor && (
        <div className="fixed top-10 right-[232px] z-20 space-x-4 transition-all duration-200 ease-out">
          <EZButton label="Refresh" whenClicked={invalidate} variant="info" />
          {saveReady &&
            <EZButton label="SAVE" whenClicked={onSave} variant="warning" className="shadow-black shadow-md" />
          }
        </div>
      )}
      {bookDetail.authors && bookDetail.authors.length > 1 && (
        <div>
          <h3>Authors</h3>
          {bookDetail.authors.map((author:UserStub) => (
            <Avatar user={author} sz="lg" key={uniqueKey(bookDetail, author)} />
          ))}
        </div>
      )}

      {bookDetail.cover && (
        <BookCover
          book={bookDetail}
          variant={BookCoverVariant.COVER}
          link={false}
          authorAvatars={false}
        />
      )}
      {isAuthor && 
        <div>
          <label className="font-semibold w-[50%]">Cover</label>
          <div>
            <p className="text-xs">
              TODO: Create cover upsert. This should be a modal to select a new cover from
              a list of user-created covers, (eventually maybe?) or the default covers, or
              upload one of their own.
            </p>
          </div>
        </div>
      }

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
              <label className="font-semibold w-[50%]">Genre</label>
              <TailwindSelectInput
                value={bookDetail?.genre.title}
                setValue={updateGenre}
                options={bookApi.genresToOptions}
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
                {bookApi.categories.map((cat) => (
                    <span className="italic mr-2" key={uuid()}>
                      {cat.title}
                    </span>
                ))}
              </div>
            </div>
          ) : (
            bookApi.categories.map((cat) => (
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
              onSave={bookApi.save}
            />
          ) : (
            ReactHtmlParser(bookDetail.hook!)
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
        <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
          <ShrinkableIconLabel
            iconClassName="text-primary-content"
            labelClassName="text-primary-content font-semibold"
            label="Likes"
            icon={HeartIcon}
            onClick={onLike}
          />
          <span className="text-primary">
            {valToLabel(bookDetail.likes?.length ?? 0)}
          </span>
        </div>
        <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
          <ShrinkableIconLabel
            iconClassName="text-primary-content"
            labelClassName="text-primary-content font-semibold"
            label="Shares"
            icon={ShareIcon}
            onClick={onShare}
          />
          <span className="text-primary">
            {valToLabel(bookDetail.shares?.length ?? 0)}
          </span>
        </div>
        <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
          <ShrinkableIconLabel
            iconClassName="text-primary-content"
            labelClassName="text-primary-content font-semibold"
            label="Follows"
            icon={FollowIcon}
            onClick={onFollow}
          />
          <span className="text-primary">
            {valToLabel(bookDetail.follows?.length ?? 0)}
          </span>
        </div>
        <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
          <ShrinkableIconLabel
            iconClassName="text-primary-content"
            labelClassName="text-primary-content font-semibold"
            label="Fans"
            icon={FireIcon}
            onClick={() => {}}
          />
          <span className="text-primary">
            {valToLabel(onlyFans(bookDetail.follows ?? []).length)}
          </span>
        </div>
        <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
          <ShrinkableIconLabel
            iconClassName="text-primary-content"
            labelClassName="text-primary-content font-semibold"
            label="Comments"
            icon={ReplyIcon}
            onClick={() => {}}
          />
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
        <h3>Back Panel</h3>
        <div className="font-ibarra">
          {isAuthor ? (
            <InlineTextarea
              content={bookDetail.back}
              setContent={updatePanel}
              onSave={bookApi.save}
            />
          ) : (
            ReactHtmlParser(bookDetail.back!)
          )}
        </div>
      </div>

      <div className="my-4">
        <h3>Synopsis</h3>
        <div className="font-ibarra">
          {isAuthor ? (
            <InlineTextarea
              content={bookDetail.synopsis}
              setContent={updateSynopsis}
              onSave={bookApi.save}
            />
          ) : (
            ReactHtmlParser(bookDetail.synopsis!)
          )}
        </div>
      </div>

      <div className="my-4">
        <h3>Chapters {isAuthor && <OpenChapterModalButton variant="plus" />}</h3>
          {isAuthor && <CreateChapterModal forBook={bookApi} />}
        <div className="flex space-x-4">
          <ChapterList forBook={bookApi} onSelect={setEditChapter} />
        </div>
        {editChapter && 
          //TODO change this to allow for a chapter stub.
          <ChapterEdit chapterDetail={editChapter as ChapterDetail} cyfrUser={cyfrUser} />
        }
      </div>

      <div className="my-4">
        <h3>Characters</h3>
        <div>
          <p className="text-xs">
            <strong>TODO: Create Characters upsert.</strong>
            This should be a modal to create a new character, or edit/delete
            an existing character. When complete, update{" "}
            <code>bookHas(bookDetail.characters) || isAuthor</code> so characters
            display for all users, but forms only show for authors.
          </p>
        </div>
      </div>

      {(bookDetail.gallery || isAuthor) && (
        <div className="my-4">
          <h3>Gallery</h3>
          <div>
            <p className="text-xs">
              <strong>TODO: Create chapters upsert.</strong>
              This should be a modal to create a new gallery, or edit/delete an
              existing gallery. When complete, update{" "}
              <code>bookDetail.gallery || isAuthor</code> so gallery displays for all
              users, but forms only show for authors.
            </p>
          </div>
          <GalleryPhotoswipe gallery={bookDetail.gallery} />
        </div>
      )}

      {isAuthor && jsonBlock(bookDetail)}
    </div>
  )
  : <ErrorPage />
}

export default BookDetailComponent
