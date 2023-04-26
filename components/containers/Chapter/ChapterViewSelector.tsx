import { Dispatch, SetStateAction } from "react";
import { ChapterViews } from "../../../pages/book/[bookId]/chapter/[chapterId]";
import { ChapterDetailIcon, FeatherIcon, ReadsIcon, StarIcon } from "../../ui/icons";
import ShrinkableIconButton from "../../ui/shrinkableIconButton";

type ChapterViewSelectorProps = {
  view:       ChapterViews
  setView:    Dispatch<SetStateAction<ChapterViews>>
  showEdit?:  boolean
}

const ChapterViewSelector = ({view, setView, showEdit=false}:ChapterViewSelectorProps) => 
  <div className="flex space-x-2">
    {view!==ChapterViews.DETAIL &&
      <ShrinkableIconButton className="rounded-lg p-2" label="Detail" icon={ChapterDetailIcon} onClick={() => setView(ChapterViews.DETAIL)} />
    }
    {view!==ChapterViews.READ  && view !== ChapterViews.EDIT &&
      <ShrinkableIconButton className="rounded-lg p-2" label="Read" icon={ReadsIcon} onClick={() => setView(ChapterViews.READ)} />
    }
    {view !== ChapterViews.REVIEW  && view !== ChapterViews.EDIT &&
      <ShrinkableIconButton className="rounded-lg p-2" label="Review" icon={StarIcon} onClick={() => setView(ChapterViews.REVIEW)} />
    }
    {showEdit && view !== ChapterViews.EDIT &&
      <ShrinkableIconButton className="rounded-lg p-2" label="Edit" icon={FeatherIcon} onClick={() => setView(ChapterViews.EDIT)} />
    }
  </div>
export default ChapterViewSelector
