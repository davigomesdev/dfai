import React from 'react';

import { NAV_MENUS } from '@/constants/nav-menus';

import { cn } from '@/utils/cn.util';
import { truncateAddress } from '@/utils/format.util';

import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers/react';

import { Link, useLocation } from 'react-router-dom';

import Button from '../common/button';
import Separator from '../common/separator';
import Typography from '../common/typography';

const Navbar: React.FC = () => {
  const { open } = useWeb3Modal();
  const { address } = useWeb3ModalAccount();

  const handleOnClickConnectWallet = (): void => {
    open();
  };

  return (
    <nav className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-secondary-800 bg-black px-4 py-3">
      <div className="flex items-center gap-7">
        <img alt="logo" className="w-[100px] sm:w-[120px]" src="/logo.png" />
        <ul className="flex items-center gap-2">
          {NAV_MENUS.map((menu, index) => (
            <NavMenu key={index} {...menu} />
          ))}
        </ul>
      </div>
      <div>
        {!address ? (
          <Button size="sm" variant="outline" onClick={handleOnClickConnectWallet}>
            Connect Wallet
          </Button>
        ) : (
          <button className="flex h-[30px] items-center gap-2 rounded-lg border border-primary-500 px-4 pl-2">
            <Typography.P className="flex text-xs font-semibold text-primary-400">
              0 DFAI
            </Typography.P>
            <Separator orientation="vertical" />
            <Typography.P className="flex text-sm font-semibold">
              {truncateAddress(address)}
            </Typography.P>
          </button>
        )}
      </div>
    </nav>
  );
};

interface NavMenuProps {
  title: string;
  path: string;
  target?: React.HTMLAttributeAnchorTarget;
}

const NavMenu: React.FC<NavMenuProps> = ({ title, path, target }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <li>
      <Link
        className={cn(
          'rounded-lg px-2 py-1 text-sm text-white',
          isActive ? 'border border-primary-500 bg-primary-500/20' : 'hover:bg-secondary-700/50',
        )}
        target={target}
        to={path}
      >
        {title}
      </Link>
    </li>
  );
};

export default Navbar;
