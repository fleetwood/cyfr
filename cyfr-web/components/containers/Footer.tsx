import React from "react";

const Footer = () => {
  return (
    <footer className="mt-auto">
      <div className="p-5 mx-auto">
        <div className="flex">
          <div className="flex-grow flex flex-col">
            <a href="/#home">Boom</a>
            <a href="#">Boom</a>
            <a href="#">Boom</a>
            <a href="#">Boom</a>
          </div>
          <div className="flex-grow flex flex-col">
            <a href="#">Boom</a>
            <a href="#">Boom</a>
            <a href="#">Boom</a>
            <a href="#">Boom</a>
          </div>
          <div className="flex-grow flex flex-col">
            <a href="#">Boom</a>
            <a href="#">Boom</a>
            <a href="#">Boom</a>
          </div>
        </div>
        <div className="text-right text-xs py-4">
          Some other stuff
        </div>
      </div>
    </footer>
  );
};

export default Footer;
