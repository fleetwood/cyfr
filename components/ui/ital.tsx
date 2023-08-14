import { ReactNode } from "react"

const Ital = ({className, children}:{className?: string, children:ReactNode}) => <span className={`italic ${className}`}>{children}</span>
export default Ital