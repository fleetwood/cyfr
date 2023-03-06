import { Switch } from "@headlessui/react"
import { uuid } from "../../utils/helpers"

type TogglerParams = {
    label?: string
    checked:  boolean
    setChecked: (value:boolean) => void
    rightLabel?: string
    variant?: 'primary' | 'secondary' | 'accent'
}

export default function Toggler({label, checked, setChecked, rightLabel, variant}:TogglerParams) {
    return (
      <div className="flex place-items-center">
        {label && <span className={`text-${variant}${checked ? '-content':''}`}>{label}</span>}
        <Switch
          checked={checked}
          onChange={setChecked}
          className="relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          <span
            aria-hidden="true"
            className={`
              ${checked ? 'translate-x-9' : 'translate-x-0'}
              pointer-events-none 
              inline-block h-[34px] w-[34px] 
              transform rounded-full 
              bg-${variant} shadow-lg ring-0 
              transition duration-200 ease-in-out`}
            />
        </Switch>
        {rightLabel && <span className={`text-${variant}${!checked ? '-content':''}`}>{rightLabel}</span>}
      </div>
    )
  }