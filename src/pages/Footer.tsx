"use client"
import { Github, HomeIcon, ScanHeart, Twitter } from 'lucide-react';
import React from 'react';

const Footer = () => {
  return (
    <footer id="footer" className="footer bg-neutral text-monad-berry 
            flex flex-col sm:flex-row justify-between items-center 
            px-4 sm:px-20 py-4 border-t border-gray-500 
            rounded-t-lg bg-monad-offwhite gap-4 sm:gap-0"
    >
      <aside className="flex items-center gap-2 text-xs sm:text-md text-center sm:text-left">
        <ScanHeart className="w-6 h-6 sm:w-8 sm:h-8" />
        <p>P. E. A. R. L. Copyright © {new Date().getFullYear()} - All right reserved</p>
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