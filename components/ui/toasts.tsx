import React from 'react'
import { useToast } from '../context/ToastContextProvider'

const Toasts = () => {
  const {toasts} = useToast()
  return <div className="toast toast-top toast-center w-4/6 mt-12 z-[100002] p-0 ">{toasts.map((toast) => toast.toast)}</div>
}

export default Toasts