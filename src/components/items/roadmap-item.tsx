import React from 'react';

import { cn } from '@/utils/cn.util';

import Typography from '../common/typography';

interface RoadmapItemProps {
  index: number;
  title: string;
  subTitle: string;
  description: string;
  items: string[];
}

interface RoadmapSubItemProps {
  description: string;
  items: string[];
}

const RoadmapItem: React.FC<RoadmapItemProps> = ({
  index,
  title,
  subTitle,
  description,
  items,
}) => {
  return (
    <div className="flex w-full flex-col items-center gap-5 p-1">
      <Typography.H4 className="text-center font-bold uppercase text-[#FFB103]">
        {title}
      </Typography.H4>
      <Typography.P className="w-full max-w-[200px] text-center text-sm">{subTitle}</Typography.P>
      <div className="relative flex h-[120px] w-[120px] items-center justify-center bg-black">
        <span
          className={cn(
            'absolute h-full w-full rounded-full border-4',
            index <= 1 &&
              'border-b-transparent border-l-[#FFB103] border-r-transparent border-t-[#FFB103]',
            index == 2 &&
              'border-b-[#FFB103] border-l-[#FFB103] border-r-transparent border-t-[#FFB103]',
            index == 3 && 'border-[#FFB103]',
          )}
        />
        <Typography.P className="text-center text-xl">Phase {index}</Typography.P>
      </div>
      <div className="visible space-y-4 md:hidden">
        <Typography.P className="text-center font-bold uppercase">{description}</Typography.P>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index}>
              <Typography.P className="text-center">{item}</Typography.P>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const RoadmapSubItem: React.FC<RoadmapSubItemProps> = ({ description, items }) => {
  return (
    <div className="hidden space-y-4 md:block">
      <Typography.P className="text-center font-bold uppercase">{description}</Typography.P>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index}>
            <Typography.P className="text-center">{item}</Typography.P>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoadmapItem;
