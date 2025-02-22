import { Github, HomeIcon, ScanHeart, Twitter } from 'lucide-react';
import React from 'react';

const Footer = () => {
    return (
        <footer className="footer bg-neutral text-monad-berry items-center px-20 pb-4 border-t border-gray-500 pt-3 rounded-t-lg bg-monad-offwhite">
  <aside className="grid-flow-col items-center text-md">
    <ScanHeart height={32} width={32}/>
    <p>P. E. A. R. L.  Copyright © {new Date().getFullYear()} - All right reserved</p>
  </aside>
  <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
    <a href='https://github.com' target='_blank' className='cursor-pointer'>
      <Github color='black'/>
    </a>
    <a>
     <Twitter color='blue'/>
    </a>
    <a>
      <HomeIcon color='purple'/>
    </a>
  </nav>
</footer>
    );
};

export default Footer;