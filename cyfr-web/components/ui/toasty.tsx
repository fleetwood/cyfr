import { ReactNode, useEffect, useState } from "react";
import { useToast } from "../context/ToastContextProvider";
import useDebug from "../../hooks/useDebug";
const {debug} = useDebug({fileName: 'toasty'})

type ToastType = {
  message: ReactNode | string
  type?: "info" | "success" | "warning" | "error"
  toastId: string
}

export const LoggedIn = () => <div>Please <a href="/login" className="text-primary underline">log in</a> first</div>

const Toasty = ({ message, type, toastId }: ToastType) => {
  const { slice } = useToast()
  const [markedForDeletion, setMarkedForDeletion] = useState(false)

  const markForDelete = async () => {
    setMarkedForDeletion(true)
    setTimeout(() => slice(toastId), 500)
  }

  // useEffect(() => {
  //   const prune = setInterval(markForDelete, 3000)
  //   return () => clearInterval(prune)
  // }, [])

  return (
    <div className={`
      relative w-3/6 flex flex-row mr-3
      transition-all duration-500
      alert alert-${type || "info"}
      ${markedForDeletion ? `opacity-0` : `inline`}`
    }>
      <button onClick={markForDelete} className={`btn btn-sm btn-circle absolute right-2 top-2`} >
        ✕
      </button>
      <p className={`text-${type || 'info'}-content`}>{message}</p>
    </div>
  );
};

export default Toasty;
