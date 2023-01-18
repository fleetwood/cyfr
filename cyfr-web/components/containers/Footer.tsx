import React from "react";

const Footer = () => {
  return (
    <footer className="mt-auto sticky bottom-0 min-w-full bg-neutral">
      <div className="p-5 mx-auto relative text-neutral-content">
        <div className="flex">
          <div className="flex-grow flex flex-col">
            <a href="/#home">Boom</a>
            <a href="/#home">Boom</a>
          </div>
          <div className="flex-grow flex flex-col">
            <a href="/#home">Boom</a>
            <a href="/#home">Boom</a>
          </div>
          <div className="flex-grow flex flex-col">
            <a href="/#home">Boom</a>
            <a href="/#home">Boom</a>
          </div>
        </div>
        <div className="flex justify-items-center text-xs space-x-4">
          <div className="w-[50%] text-right">Copyright ©Fleetwood 2023</div>
          <div className="w-[50%]">Made with pride in Chi-town</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
