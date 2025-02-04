import React from 'react';

import { cn } from '@/utils/cn.util';
import { buttonVariants } from '../common/button';

import { XLogo, GithubLogo, TelegramLogo } from '@phosphor-icons/react';

import Wrapper from '../common/wrapper';
import Typography from '../common/typography';

const Footer: React.FC = () => {
  return (
    <footer className="flex w-full flex-col items-center justify-center gap-5 bg-[url(/background-footer.png)] bg-cover p-10">
      <img alt="logo" className="w-[80%] max-w-[700px]" src="logo.png" />
      <Wrapper>
        <div className="mt-10 flex w-full flex-col items-center justify-between gap-10 md:flex-row md:items-end">
          <Typography.P className="w-full max-w-[300px] text-center md:text-left">
            Join the DFAI ecosystem and stay updated on everything happening in our project. Follow
            us on Telegram for real-time updates, join the conversation on Twitter, and explore our
            Whitepaper to understand the full potential of our platform.
          </Typography.P>
          <ul className="flex gap-4">
            <li>
              <a className={cn(buttonVariants({ size: 'icon' }))} href="" target="_blank">
                <XLogo size={32} weight="fill" />
              </a>
            </li>
            <li>
              <a className={cn(buttonVariants({ size: 'icon' }))} href="" target="_blank">
                <GithubLogo size={32} weight="fill" />
              </a>
            </li>
            <li>
              <a className={cn(buttonVariants({ size: 'icon' }))} href="" target="_blank">
                <TelegramLogo weight="fill" />
              </a>
            </li>
          </ul>
        </div>
      </Wrapper>
    </footer>
  );
};

export default Footer;
