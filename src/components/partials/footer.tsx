import React from 'react';
import Typography from '../common/typography';
import { Link } from 'react-router-dom';
import { FOOTER_MENUS } from '@/constants/footer-menus';

const Footer: React.FC = () => {
  return (
    <footer className="flex h-[50px] w-full items-center justify-between border-t border-secondary-800 p-5">
      <Typography.P className="text-xs text-secondary-200">© DFAI 2025</Typography.P>
      <ul className="flex gap-4">
        {FOOTER_MENUS.map((menu, index) => (
          <FooterMenu key={index} {...menu} />
        ))}
      </ul>
    </footer>
  );
};

interface FooterMenuProps {
  title: string;
  path: string;
}

const FooterMenu: React.FC<FooterMenuProps> = ({ title, path }) => {
  return (
    <li>
      <Link className="text-xs text-secondary-200" target="_blank" to={path}>
        {title}
      </Link>
    </li>
  );
};

export default Footer;
