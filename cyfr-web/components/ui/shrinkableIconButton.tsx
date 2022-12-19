import React, { MouseEventHandler } from "react";

type ShrinkableIconButtonProps = {
  icon: JSX.Element;
  label?: string;
  className?: string;
  iconClassName?: string;
  labelClassName?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const ShrinkableIconButton = (props: ShrinkableIconButtonProps) => {
  const {
    icon,
    label,
    className,
    iconClassName,
    labelClassName,
    onClick
  } = props;

  return (
    <button
      className={`
      text-opacity-70
      hover:text-opacity-100
      hover:shadow
      transition-colors ease-linear duration-200
      flex space-x-1 ${className || "btn-primary"}
      `}
      onClick={onClick}
    >
      <span className={iconClassName}>{icon}</span>
      {label && (
        <span className={`hidden lg:inline-block ${labelClassName || 'text-primary-content'}`}>
          {label}
        </span>
      )}
    </button>
  );
};

export default ShrinkableIconButton;
