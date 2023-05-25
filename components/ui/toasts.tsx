import React from 'react'
import { useToast } from '../context/ToastContextProvider'

const Toasts = () => {
  const {toasts} = useToast()
  return (
    <div className="toast toast-top toast-center w-4/6 mt-10 z-10">
        {toasts.map((toast) => toast.toast)}
    </div>
)}

export default Toasts