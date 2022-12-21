import Link from "next/link";
import React from "react";
import { classnameProps } from "../../types/props";

const Footer = ({ className }: classnameProps) => {
  return (
    <footer className={`static bottom-0 bg-secondary text-opacity-70 mt-32 pb-6 min-w-full border-t border-t-secondary-content pt-6 ${className}`}>
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center px-6 sm:px-12 lg:px-0">
        <div className="flex w-full flex-wrap items-center justify-center gap-4 gap-y-6 text-sm md:justify-between">
         
         <div className="order-first flex items-center gap-3 sm:order-1 font-extrabold">
            <Link href="/about">Cyfr</Link>
         </div>
         
         <div className="order-2 flex flex-wrap justify-center gap-y-2 gap-x-4 sm:order-2">
            <a
              className="transition hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/Tailus-UI"
            >
              GitHub
            </a>
            <a
              className="transition hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
              href="https://dev.to/tailus"
            >
              Articles
            </a>
            <a
              className="transition hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.youtube.com/c/Tailus-ui/"
            >
              YouTube
            </a>
          </div>
          
          <span className="order-last">
            Proudly made in Chicago
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
