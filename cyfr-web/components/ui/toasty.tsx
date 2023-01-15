import React, { useContext } from "react";
import { ToastContext } from "../context/ToastContextProvider";

type ToastType = {
  message: string
  type?: "info" | "success" | "warning"
  toastId: string
};

const Toasty = ({ message, type, toastId }: ToastType) => {
  const { slice } = useContext(ToastContext);
  return (
    <div className={`relative flex flex-row alert alert-${type || "info"}`}>
      <button
        onClick={() => slice(toastId)}
        className="btn btn-sm btn-circle absolute right-2 top-2"
      >
        ✕
      </button>
      <div>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toasty;
