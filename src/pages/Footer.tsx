"use client"
import { Github, HomeIcon, Twitter } from 'lucide-react';
import React from 'react';
import Image from 'next/image';
import pearlLogoSmall from "../../public/pearl-logo-small.png";
import pearlLogo from "../../public/pearl-logo.png";

const Footer = () => {
  return (
    <footer id="footer" className="footer bg-neutral text-monad-berry 
            flex flex-col sm:flex-row justify-between items-center 
            px-4 sm:px-20 py-4 border-t border-gray-500 
            rounded-t-lg bg-monad-offwhite gap-4 sm:gap-0"
    >
      <aside className="flex items-center gap-2 text-xs sm:text-md text-center sm:text-left">
        {/* Small logo for mobile */}
        <div className="block sm:hidden">
          <Image
            src={pearlLogoSmall}
            alt="PEARL Logo"
            width={24}
            height={24}
            className="w-6 h-6"
            style={{ backgroundColor: 'transparent' }}
          />
        </div>

        {/* Full logo with text for larger screens */}
        <div className="hidden sm:block">
          <Image
            src={pearlLogo}
            alt="PEARL Logo"
            width={100}
            height={28}
            className="h-8 w-auto"
            style={{ backgroundColor: 'transparent' }}
          />
        </div>

        {/* Show text on mobile only, since larger screens show logo with text */}
        <p className="sm:hidden">P. E. A. R. L. labs Copyright © {new Date().getFullYear()}</p>
        <p className="hidden sm:block">Copyright © {new Date().getFullYear()} - All rights reserved</p>
      </aside>

      <nav className="flex gap-4 items-center">
        <a href='https://github.com/Atharva-3000/pearl-monad' target='_blank' className='cursor-pointer'>
          <Github className="w-5 h-5 sm:w-6 sm:h-6" color='black' />
        </a>
        <a className='cursor-pointer'>
          <Twitter className="w-5 h-5 sm:w-6 sm:h-6" color='blue' />
        </a>
        <a
          className='cursor-pointer'
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }}
        >
          <HomeIcon className="w-5 h-5 sm:w-6 sm:h-6" color='purple' />
        </a>
      </nav>
    </footer>
  );
};

export default Footer;