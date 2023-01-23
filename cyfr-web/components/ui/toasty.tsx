import React, { ReactNode, useContext, useEffect, useState } from "react";
import ReactHtmlParser from "react-html-parser"
import { ToastContext } from "../context/ToastContextProvider";
import { log } from "../../utils/log";

type ToastType = {
  message: ReactNode | string
  type?: "info" | "success" | "warning"
  toastId: string
}

export const LoggedIn = () => <div>Please <a href="/login" className="text-primary underline">log in</a> first</div>

const Toasty = ({ message, type, toastId }: ToastType) => {
  const { slice } = useContext(ToastContext)
  const [markedForDeletion, setMarkedForDeletion] = useState(false)

  const markForDelete = async () => {
    log('Deleting toast...')
    setMarkedForDeletion(true)
    setTimeout(() => slice(toastId), 500)
  }

  useEffect(() => {
    const prune = setInterval(markForDelete, 3000)
    return () => clearInterval(prune)
  }, [])

  return (
    <div className={`
      relative w-full
      border border-accent
      flex flex-row 
      transition-all duration-500
      alert alert-${type || "info"}
      ${markedForDeletion ? `opacity-0 scale-0` : `inline`}`
    }>
      <button
        onClick={markForDelete}
        className="btn btn-sm btn-circle absolute right-2 top-2"
      >
        ✕
      </button>
      <div className="">
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toasty;
