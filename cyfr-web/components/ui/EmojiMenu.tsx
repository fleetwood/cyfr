import { Popover, Transition } from "@headlessui/react";
import { ReactNode, useEffect, useRef, useState } from "react";
import Emoji from "../../utils/emoji";
import TailwindInput from "../forms/TailwindInput";
import {usePopper} from 'react-popper'
import { uniqueArray } from "../../utils/helpers";
import { log } from "../../utils/log";
import { EmojiChar } from "../../prisma/types/emoji.def";

type EmojiMenuProps = {
  cat?: string
  group?: string
  name?: string
  onSelect: Function
}

const allEmoji = Emoji.all
const categories = uniqueArray(allEmoji.map(e => e.category))
const groups = uniqueArray(allEmoji.map(e => e.group))

const EmojiMenu = ({ cat, group, name, onSelect }: EmojiMenuProps) => {
  const [search, setSearch] = useState<string|null>(null)
  const [activeGroup, setActiveGroup] = useState<string|undefined>(group)
  const [emoji, setEmoji] = useState<EmojiChar[]>(allEmoji)
  let [referenceElement, setReferenceElement] = useState(null)
  let [popperElement, setPopperElement] = useState(null)
  let { styles, attributes } = usePopper(referenceElement, popperElement)

  useEffect(() => {
    setEmoji(() => activeGroup ? allEmoji.filter(e => e.group===activeGroup) : allEmoji)
  }, [activeGroup])

  return (
    <Popover>
      {/* @ts-ignore */}
      <Popover.Button ref={setReferenceElement} className="cursor-pointer p-2 rounded-sm bg-secondary bg-opacity-0 text-xl hover:bg-opacity-30 hover:text-secondary-content">☺️</Popover.Button>

        <Popover.Panel
          /* @ts-ignore */
          ref={setPopperElement}
          className="scrollbar-hide bg-base-200 rounded-xl mx-2 p-2 max-h-[250px] overflow-y-auto"
          style={{...styles.popper,
            placeSelf: 'auto',
          }}
          {...attributes.popper}
          >
          <div className="w-full h-full">
            <TailwindInput placeholder="Search" value={search} setValue={setSearch} type="text" 
              cardClassName="w-full flex space-x-2 border-1 border-base-content border-opacity-50 sticky" 
              inputClassName=""
              />
              <div className="w-full flex py-2 space-x-2 justify-around sticky">
                <div className={`text-base-content
                  cursor-pointer hover:text-primary-content hover:bg-primary 
                  rounded-md p-2 font-semibold`
                }
                onClick={() => setActiveGroup('')}>ALL</div>
                {groups.map(g => (
                  <div className={`
                    ${activeGroup===g?'text-primary':'text-base-content'} 
                    cursor-pointer hover:text-primary-content hover:bg-primary 
                    rounded-md p-2 font-semibold`}
                    onClick={() => setActiveGroup(g)} key={`emoji-group-${g}`}>
                    {g}
                  </div>
                ))}
              </div>
              {emoji?.filter(e => e.name.indexOf(search||'')>=0).map((e) => (
                <button className="btn border-none bg-opacity-0 m-1 px-1 hover:bg-opacity-10 transition-all duration-200" key={e.char} onClick={() => onSelect(e)}>
                  {e.char}
                </button>
              ))} 
          </div>
        </Popover.Panel>
    </Popover>
  );
};

export default EmojiMenu;
