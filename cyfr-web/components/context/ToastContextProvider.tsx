import React, { createContext, ReactNode, useEffect, useState } from "react"
import { uuid } from "../../utils/helpers"
import Toasty from "../ui/toasty"

type ToastProviderProps = {
  children?: ReactNode
}

type ToastProviderType = {
  notify: (props: ToastyNotif) => void
  slice: (key: string) => void
  toasts: ToastyElement[]
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

  return (
    <ToastContext.Provider value={{ toasts, notify, slice }}>
      {children}
    </ToastContext.Provider>
  )
}

export default ToastProvider
