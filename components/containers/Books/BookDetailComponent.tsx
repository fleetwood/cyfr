import { useState } from "react";
import ReactHtmlParser from "react-html-parser";
import useBookApi from "../../../hooks/useBookApi";
import useDebug from "../../../hooks/useDebug";
import { BookDetail, BookStatus } from "../../../prisma/prismaContext";
import {
  isBookAuthor,
  onlyFans,
  uniqueKey,
  uuid,
  valToLabel,
  ymd,
} from "../../../utils/helpers";
import { useCyfrUserContext } from "../../context/CyfrUserProvider";
import { useToast } from "../../context/ToastContextProvider";
import { InlineTextarea, TailwindSelectInput } from "../../forms";
import Avatar from "../../ui/avatar";
import EZButton from "../../ui/ezButton";
import {
  FeatherIcon,
  FireIcon,
  FollowIcon,
  HeartIcon,
  ReplyIcon,
  ShareIcon,
} from "../../ui/icons";
import ShrinkableIconLabel from "../../ui/shrinkableIconLabel";
import Toggler from "../../ui/toggler";
import GalleryPhotoswipe from "../Gallery/GalleryPhotoswipe";
import BookCover, { BookCoverVariant } from "./BookCover";
import { KeyVal } from "../../../types/props";
import CreateChapterModal, { OpenChapterModalButton } from "../Chapter/CreateChapterModal";

const { jsonBlock, debug } = useDebug(
  "components/Books/BookDetailComponent",
  "DEBUG"
);

type BookComponentProps = {
  bookDetail: BookDetail;
  onUpdate?: () => void;
};

const BookDetailComponent = ({ bookDetail, onUpdate }: BookComponentProps) => {
  const { notify, loginRequired } = useToast();
  const [cyfrUser] = useCyfrUserContext();
  const {
    like,
    follow,
    share,
    invalidate,
    book,
    update,
    save,
    genresToOptions,
  } = useBookApi(bookDetail);
  const isAuthor = isBookAuthor(bookDetail, cyfrUser);
  const [saveReady, setSaveReady] = useState(false);
  const statusOptions: KeyVal[] = [
    { key: "DRAFT" },
    { key: "MANUSCRIPT" },
    { key: "PRIVATE" },
    { key: "PUBLISHED" },
  ];

  const bookHas = (arr: Array<any> | undefined | null) =>
    arr !== undefined && arr !== null && arr.length > 0;

  const onFollow = async () => {
    if (!cyfrUser) {
      loginRequired();
      return null;
    }
    const result = await follow(cyfrUser.id);
    if (result) {
      notify(`You are now following ${book.title}. Nice!`);
    }
  };

  const onShare = async () => {
    if (!cyfrUser) {
      loginRequired();
      return null;
    }
    const result = await share(cyfrUser.id);
    if (result) {
      notify(`You shared ${book.title}!`);
    }
  };

  const onLike = async () => {
    if (!cyfrUser) {
      loginRequired();
      return null;
    }
    const result = await like(cyfrUser.id);
    if (result) {
      notify(`You liked ${book.title}.`);
    }
  };

  const updatePanel = (html?: string | null) => {
    update({ back: html?.toString() });
    setSaveReady(true);
  };

  const updateSynopsis = (html?: string | null) => {
    update({ synopsis: html?.toString() });
    setSaveReady(true);
  };

  const updateHook = (html?: string | null) => {
    update({ hook: html?.toString() });
    setSaveReady(true);
  };

  const updateActive = (value: boolean) => {
    update({ active: value });
    setSaveReady(true);
  };

  const updateProspect = (value: boolean) => {
    update({ prospect: value });
    setSaveReady(true);
  };

  const updateFiction = (value: boolean) => {
    update({ fiction: value });
    setSaveReady(true);
  };

  const updateStatus = (value: string) => {
    update({ status: value as BookStatus });
    setSaveReady(true);
  };

  const updateGenre = (value: string) => {
    update({ genreId: value });
    setSaveReady(true);
  };

  const onSave = () => {
    save();
    setSaveReady(false);
  };

  return (
    <div>
      {isAuthor && (
        <div className="fixed top-10 right-[232px] z-20 space-x-4 transition-all duration-200 ease-out">
          <EZButton label="Refresh" whenClicked={invalidate} variant="info" />
          {saveReady &&
            <EZButton label="SAVE" whenClicked={onSave} variant="warning" className="shadow-black shadow-md" />
          }
        </div>
      )}
      {book.authors && book.authors.length > 1 && (
        <div>
          <h3>Authors</h3>
          {book.authors.map((author) => (
            <Avatar user={author} sz="lg" key={uniqueKey(book, author)} />
          ))}
        </div>
      )}

      {book.cover && (
        <BookCover
          book={book}
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
              checked={book.fiction}
              setChecked={updateFiction}
              trueLabel="FICTION"
              falseLabel="NON-FICTION"
            />
          </div>
        ) : (
          <div>{book.fiction ? "FICTION" : "NON-FICTION"}</div>
        )}
        <div className="flex">
          {isAuthor ? (
            <div>
              <label className="font-semibold w-[50%]">Genre</label>
              <TailwindSelectInput
                value={book.genre.title}
                setValue={updateGenre}
                options={genresToOptions()}
              />
            </div>
          ) : (
            <span className="font-semibold text-primary-content mr-4">
              {book.genre.title}
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
                {book.categories
                  .filter((c) => c !== null)
                  .map((cat) => (
                    <span className="italic mr-2" key={uuid()}>
                      {cat.title}
                    </span>
                  ))}
              </div>
            </div>
          ) : (
            book.categories
              .filter((c) => c !== null)
              .map((cat) => (
                <span className="italic mr-2" key={uuid()}>
                  {cat.title}
                </span>
              ))
          )}
        </div>
        <div>{book.words} words</div>
        <div className="font-ibarra">
          {isAuthor ? (
            <InlineTextarea
              content={book.hook}
              setContent={updateHook}
              onSave={save}
            />
          ) : (
            ReactHtmlParser(book.hook!)
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
                value={book.status?.toString()}
                setValue={updateStatus}
              />
            </div>
          ) : (
            <div className="flex justify-between">
              <label className="font-semibold w-[50%]">Status</label>
              <span className="text-secondary">{book.status}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-secondary rounded-lg">
          <label className="font-semibold w-[50%]">Completed</label>
          <span className="text-secondary">
            {book.completeAt ? ymd(new Date(book.completeAt)) : "TBD"}
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
                checked={book.prospect}
                setChecked={updateProspect}
                falseLabel="No Agents"
                trueLabel="Allow Agents"
              />
            </div>
          ) : (
            <span className="text-secondary">
              {book.prospect ? "YES" : "NO"}
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
              checked={book.active}
              setChecked={updateActive}
              falseLabel="Not Visible"
              trueLabel="Visible"
            />
          ) : (
            <span className="text-secondary">
              {book.active ? "PUBLIC" : "HIDDEN"}
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
            {valToLabel(book.likes?.length ?? 0)}
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
            {valToLabel(book.shares?.length ?? 0)}
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
            {valToLabel(book.follows?.length ?? 0)}
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
            {valToLabel(onlyFans(book.follows ?? []).length)}
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
              content={book.back}
              setContent={updatePanel}
              onSave={save}
            />
          ) : (
            ReactHtmlParser(book.back!)
          )}
        </div>
      </div>

      <div className="my-4">
        <h3>Synopsis</h3>
        <div className="font-ibarra">
          {isAuthor ? (
            <InlineTextarea
              content={book.synopsis}
              setContent={updateSynopsis}
              onSave={save}
            />
          ) : (
            ReactHtmlParser(book.synopsis!)
          )}
        </div>
      </div>

      {bookHas(book.chapters) ||
        (isAuthor && (
          <div className="my-4">
            <h3>Chapters</h3>
            <div>
              <CreateChapterModal />
              <OpenChapterModalButton />
              <p className="text-xs">
                <strong>TODO: Create Chapters upsert.</strong>
                This should be a modal to create a new chapter, or edit/delete
                an existing chapter. When complete, update{" "}
                <pre>bookHas(book.chapters) || isAuthor</pre> so chapters
                display for all users, but forms only show for authors.
              </p>
            </div>
          </div>
        ))}

      {bookHas(book.characters) ||
        (isAuthor && (
          <div className="my-4">
            <h3>Characters</h3>
            <div>
              <p className="text-xs">
                <strong>TODO: Create Characters upsert.</strong>
                This should be a modal to create a new character, or edit/delete
                an existing character. When complete, update{" "}
                <pre>bookHas(book.characters) || isAuthor</pre> so characters
                display for all users, but forms only show for authors.
              </p>
            </div>
          </div>
        ))}

      {(book.gallery || isAuthor) && (
        <div className="my-4">
          <h3>Gallery</h3>
          <div>
            <p className="text-xs">
              <strong>TODO: Create chapters upsert.</strong>
              This should be a modal to create a new gallery, or edit/delete an
              existing gallery. When complete, update{" "}
              <pre>book.gallery || isAuthor</pre> so gallery displays for all
              users, but forms only show for authors.
            </p>
          </div>
          <GalleryPhotoswipe gallery={book.gallery} />
        </div>
      )}

      {isAuthor && jsonBlock(book)}
    </div>
  );
};

export default BookDetailComponent;
