import { Dispatch, SetStateAction } from "react";
import { ChapterViews } from "../../../pages/book/[bookSlug]/chapter/[chapterId]";
import useChapterApi from "../../../prisma/hooks/useChapterApi";
import { ChapterDetail, ChapterStub } from "../../../prisma/prismaContext";
import { useCyfrUserContext } from "../../context/CyfrUserProvider";
import { ChapterDetailIcon, FeatherIcon, ReadsIcon, StarIcon } from "../../ui/icons";
import ShrinkableIconButton from "../../ui/shrinkableIconButton";

type ChapterViewSelectorProps = {
  view:     ChapterViews
  setView:  Dispatch<SetStateAction<ChapterViews>>
  chapter:  ChapterStub|ChapterDetail
}

export const currentView = (view?:ChapterViews) => {
  return {
    detailView: view === ChapterViews.DETAIL,
    editView:   view === ChapterViews.EDIT,
    readView:   view === ChapterViews.READ,
    reviewView: view === ChapterViews.REVIEW
  }
}

const ChapterViewSelector = ({chapter, view, setView}:ChapterViewSelectorProps) => {
  const [cyfrUser] = useCyfrUserContext()
  const {isAuthor} = useChapterApi()
  const showEdit = isAuthor({chapter, cyfrUser})
  const {detailView, editView, readView, reviewView} = currentView(view)
  return (
  <div className="flex">
    {!detailView &&
      <ShrinkableIconButton className="hover:bg-secondary hover:text-secondary-content rounded-lg p-2" labelClassName="text-neutral" label="Detail" icon={ChapterDetailIcon} onClick={() => setView(ChapterViews.DETAIL)} />
    }
    {!readView &&
      <ShrinkableIconButton className="hover:bg-secondary hover:text-secondary-content rounded-lg p-2" labelClassName="text-neutral" label="Read" icon={ReadsIcon} onClick={() => setView(ChapterViews.READ)} />
    }
    {!reviewView &&
      <ShrinkableIconButton className="hover:bg-secondary hover:text-secondary-content rounded-lg p-2" labelClassName="text-neutral" label="Review" icon={StarIcon} onClick={() => setView(ChapterViews.REVIEW)} />
    }
    {showEdit && !editView &&
      <ShrinkableIconButton className="hover:bg-secondary hover:text-secondary-content rounded-lg p-2" labelClassName="text-neutral" label="Edit" icon={FeatherIcon} onClick={() => setView(ChapterViews.EDIT)} />
    }
    {/* <span>{viewToString(view)} {showEdit === true ? 'true' : 'false'}</span> */}
  </div>
)}
export default ChapterViewSelector
