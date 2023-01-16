import React, { createContext, ReactNode, useEffect, useState } from "react"
import { uuid } from "../../utils/helpers"
import { log, logError } from "../../utils/log"
import Toasty from "../ui/toasty"

type ToastProviderProps = {
  children?: ReactNode
}

type ToastProviderType = {
  notify: (props: ToastyNotif) => void
  slice: (key: string) => void
}

type ToastyElement = {
  toastId: string
  toast: ReactNode
}

export type ToastyNotif = {
  message: string
  type?: "info" | "success" | "warning"
}

export const ToastContext = createContext({} as ToastProviderType)

const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Array<ToastyElement>>([])

  const toastCrumb = () => {
    setToasts((current) => current.length>0 ? [...current.splice(1,current.length-1)] : [])
  }

  const slice = (toastId: string) => {
    setToasts((current) =>
      current.filter((toast) => toast.toastId !== toastId)
    )
  }

  const notify = ({ message, type }: ToastyNotif) => {
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

  useEffect(() => {
    const sliceToast = setInterval(toastCrumb, 3000)
    return () => clearInterval(sliceToast)
  }, [])

  return (
    <ToastContext.Provider value={{ notify, slice }}>
      <div className="toast toast-top toast-end w-[25%] z-50">
        {toasts.map((toast) => toast.toast)}
      </div>
      {children}
    </ToastContext.Provider>
  )
}

export default ToastProvider
