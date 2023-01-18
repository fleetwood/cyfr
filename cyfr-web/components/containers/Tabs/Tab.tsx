import React, { ReactNode } from "react";

type TabProps = {
  active?: boolean;
  forSection: string;
  children?: ReactNode;
  onClick?: Function;
};

const Tab = ({ active, forSection, onClick, children }: TabProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick(forSection);
    }
  };
  return (
    <button
      className={`btn `+(active ? "btn-secondary" : "btn-neutral")}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default Tab;
