import { ReactNode } from "react"

const Semibold = ({className, children}:{className?: string, children:ReactNode}) => <span className={`font-semibold ${className}`}>{children}</span>
export default Semibold