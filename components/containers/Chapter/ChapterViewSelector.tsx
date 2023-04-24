import React, { Dispatch, SetStateAction } from "react";
import EZButton, { EZButtonVariant } from "../../ui/ezButton";
import { ChapterViews } from "../../../pages/book/[bookId]/chapter/[chapterId]";

type ChapterViewSelectorProps = {
  view: ChapterViews
  setView: Dispatch<SetStateAction<ChapterViews>>
}

const ChapterViewSelector = ({view, setView}:ChapterViewSelectorProps) => {
  const isSelected = (v: ChapterViews):EZButtonVariant =>  v === view ? 'primary' : 'base'
  return (
    <div className="flex">
      <EZButton label="Detail" whenClicked={() => setView(ChapterViews.DETAIL)} variant={isSelected(ChapterViews.DETAIL)} />
      <EZButton label="Read" whenClicked={() => setView(ChapterViews.READ)} variant={isSelected(ChapterViews.READ)} />
      <EZButton label="Review" whenClicked={() => setView(ChapterViews.REVIEW)} variant={isSelected(ChapterViews.REVIEW)} />
    </div>
)}
export default ChapterViewSelector;
