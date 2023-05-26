import { useState } from "react"
import Datepicker from 'tailwind-datepicker-react'
import useDebug from "../../hooks/useDebug"

const {debug} = useDebug('components/forms/TailwindDatepicker', 'DEBUG')

type DatePickerProps = {
    value:Date
    onChange?:(date:Date)=>void
}

const TailwindDatepicker = ({value, onChange}:DatePickerProps) => {

    const options = {
        autoHide: true,
        todayBtn: true,
        theme: {
            background: "bg-base-100",
            todayBtn: "text-neutral bg-base-300 hover:bg-primary hover:text-primary-content ",
            clearBtn: "text-neutral bg-base-300 hover:bg-primary hover:text-primary-content ",
            icons: "bg-base-300",
            text: "text-primary",
            disabledText: "opacity-50",
            input: "",
            inputIcon: "",
            selected: "bg-primary text-primary-content",
        },
        icons: {
            // () => ReactElement | JSX.Element
            prev: () => <span className='text-primary'>«</span>,
            next: () => <span className='text-primary'>»</span>,
        },
        datepickerClassNames: "",
        language: "en",
    }

	const [show, setShow] = useState<Boolean>(false)
	const handleClose = (state: boolean) => {
		setShow(state)
	}

	return (
    <div className="relative">
        <Datepicker options={{...options, value}} onChange={onChange??{}} show={show} setShow={handleClose} />
    </div>
)}

export default TailwindDatepicker