import { Switch } from "@headlessui/react"
import useDebug from "../../hooks/useDebug"

const {debug, level} = useDebug('components/ui/Toggler')

type TogglerParams = {
  checked:  boolean
  setChecked: (value:boolean) => void
  variant?: 'primary' | 'secondary' | 'accent' | 'neutral'
  labelClassName?: string
  trueLabel?: string
  falseLabel?: string
  debug?: boolean
}

const Toggler = ({trueLabel, falseLabel, checked, setChecked, labelClassName, variant = 'neutral'}:TogglerParams) =>
  <div className="flex place-items-center relative">
    {trueLabel && <span className={`w-1/3 text-${variant} ${labelClassName} ${checked ? '':'text-opacity-50'}`}>{trueLabel}</span>}
    <Switch
      checked={checked}
      onChange={setChecked}
      className={`
        relative inline-flex 
        h-[2.25rem] w-[4rem] shrink-0 
        cursor-pointer rounded-full 
        bg-${variant} bg-opacity-25
        border-2 border-transparent  
        transition-all duration-200 ease-in-out 
        ring-0`}
    >
      <span
        aria-hidden="true"
        className={`
          ${checked ? 'translate-x-0 bg-opacity-100' : 'translate-x-[1.75rem] bg-opacity-50'}
          pointer-events-none 
          inline-block h-[2rem] w-[2rem] 
          border-2 border-${variant}-focus
          transform rounded-full   
          bg-${variant} shadow-lg ring-0 
          transition-all duration-200 ease-in-out`}
        />
    </Switch>
    {falseLabel && <span className={`w-1/3 text-${variant} ${labelClassName} ${!checked ? '':'text-opacity-50'}`}>{falseLabel}</span>}
    {level==='DEBUG' && <span className="mx-2 px-2 text-sm text-info-content bg-info">Checked: {checked.toString()}</span>}
  </div>

export default Toggler