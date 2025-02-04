import React from 'react';

import { cn } from '@/utils/cn.util';

import Typography from '../common/typography';

interface AboutItemProps {
  title: string;
  description: string;
  className?: string;
}

const AboutItem: React.FC<AboutItemProps> = ({ title, description, className }) => {
  return (
    <div
      className={cn('h-fit w-full max-w-[280px] space-y-5 rounded-3xl bg-[#161521] p-8', className)}
    >
      <Typography.H4 className="font-bold text-[#FFB103]">{title}</Typography.H4>
      <Typography.P>{description}</Typography.P>
    </div>
  );
};

export default AboutItem;
