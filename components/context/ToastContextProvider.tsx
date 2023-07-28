import { createContext, ReactNode, useContext, useState } from "react"
import { uuid } from "../../utils/helpers"
import Toasty from "../ui/toasty"

type ToastProviderProps = {
  children?: ReactNode
}

export type ToastNotifyType = "info" | "success" | "warning"

type ToastProviderType = {
  notify:         (message:ReactNode|string, type?: ToastNotifyType) => void
  slice:          (key: string) => void
  toasts:         ToastyElement[]
  notifyLoginRequired:  () => void
  notifyNotImplemented: () => void
  notifyError:          () => void
}

type ToastyElement = {
  toastId: string
  toast: ReactNode
}

export const ToastContext = createContext({} as ToastProviderType)
export const useToast = () => useContext(ToastContext)

const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Array<ToastyElement>>([])

  const slice = (toastId: string) => {
    setToasts((current) =>
      current.filter((toast) => toast.toastId !== toastId)
    )
  }

  const notify = (message:ReactNode|string, type?: ToastNotifyType) => {
    const toastId = uuid()
    const toast = {
      toastId,
      toast: (
        <Toasty
          message={message}
          type={type || "info"}
          key={uuid()}
          toastId={toastId}
        />
      ),
    }
    setToasts([...toasts, toast])
  }

  const notifyLoginRequired = () => {
    notify(<div>Please <a href="/login" className="text-primary underline">log in</a> first</div>, 'warning')
  }

  const notifyNotImplemented = () => {
    notify(<div><strong>Not Implemented</strong> Ya this ain't working rn.</div>, 'warning')
  }

  const notifyError = () => {
    notify(<div>Ya that dint work.</div>, 'warning')
  }

  return (
    <ToastContext.Provider value={{ toasts, notify, slice, notifyLoginRequired, notifyNotImplemented, notifyError }}>
      {children}
    </ToastContext.Provider>
  )
}

export default ToastProvider
