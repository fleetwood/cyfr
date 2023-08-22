import { ReactNode } from "react"

const Label = ({className, children}:{className?: string, children:ReactNode}) => <div className={`text-primary font-bold ${className}`}>{children}</div>
export default Label