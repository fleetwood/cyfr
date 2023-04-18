import { InputHTMLAttributes, MutableRefObject, SelectHTMLAttributes, useRef, useState } from "react";
import { KeyVal } from "../../types/props";

type TailwindDropdownProps =  InputHTMLAttributes<HTMLInputElement> & {
  options:        KeyVal[] 
  itemClassName?: string
  value?:         string
  setValue?:      (val:string) => void
  placeholder?:   string
}

const TailwindSelectInput = (props:TailwindDropdownProps) => {
  const { options, placeholder, itemClassName, value, setValue } = props;
  const [currentOptions, setCurrentOptions] = useState<KeyVal[]>([])
  const [showList, setShowList] = useState(false)
  const ref:MutableRefObject<HTMLDivElement|null> = useRef(null)

  const getBorder = (index:number, length:number) => {
    const base = `px-8 py-2 border-info bg-base-100 text-info`,
    middleItem = base+ 'border-l border-r ',
    topItem = middleItem +'border-t rounded-t-full ',
    bottomItem = middleItem +'border-b rounded-b-full ',
    onlyItem = base+'border rounded-full ';
    return length===1 ?
        onlyItem :
      index===0 ?
        topItem : 
      index===length-1 ? 
        bottomItem : 
      middleItem
  }

  const optionClick = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault()
    if (setValue) setValue(event.currentTarget.value)
    setShowList(false)
  }

  return (
    <div ref={ref}>
      <select 
        className={`input input-bordered w-full mb-2 bg-base-200 text-base-content ${props.className}`}
        placeholder={placeholder}
        onChange={optionClick}
        >
          {options.map(opt => (
            <option value={opt.value??opt.key} selected={opt.key===value} key={opt.key} >{opt.key}</option>
          ))}
      </select>
    </div>
)};

export default TailwindSelectInput