import React from 'react';

import { TelegramLogo, XLogo } from '@phosphor-icons/react';

import Button from '../common/button';

const Navbar: React.FC = () => {
  return (
    <nav className="sticky flex w-full items-center justify-between gap-2 border-b border-white p-2 md:p-5 md:py-8">
      <div className="w-[100px] sm:w-[150px]">
        <img alt="logo" className="w-full" src="/logo.png" />
      </div>
      <ul className="flex items-center gap-2">
        <li>
          <a className="text-white" href="" target="_blank">
            <XLogo size={32} weight="fill" />
          </a>
        </li>
        <li>
          <a className="text-white" href="" target="_blank">
            <TelegramLogo size={32} weight="fill" />
          </a>
        </li>
        <li>
          <Button>JOIN US</Button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
