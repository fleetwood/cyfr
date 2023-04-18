import React, { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { uuid } from "../../utils/helpers"
import Toasty from "../ui/toasty"

type ToastProviderProps = {
  children?: ReactNode
}

type ToastProviderType = {
  notify:         (message:ReactNode|string, type?: "info" | "success" | "warning") => void
  slice:          (key: string) => void
  toasts:         ToastyElement[]
  loginRequired:  () => void
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

  const notify = (message:ReactNode|string, type?: "info" | "success" | "warning") => {
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

  const loginRequired = () => {
    notify(<div>Please <a href="/login" className="text-primary underline">log in</a> first</div>)
  }

  return (
    <ToastContext.Provider value={{ toasts, notify, slice, loginRequired }}>
      {children}
    </ToastContext.Provider>
  )
}

export default ToastProvider
