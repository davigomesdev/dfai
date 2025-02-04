import React from 'react';
import Typography from '../common/typography';

interface AdvantageItemProps {
  title: string;
  description: string;
  image: string;
}

const AdvantageItem: React.FC<AdvantageItemProps> = ({ title, description, image }) => {
  return (
    <div className="flex h-full flex-col items-center space-y-5 rounded-3xl bg-[#FFB103] p-8">
      <img alt="icon" src={`/icons/${image}`} />
      <Typography.H4 className="text-center font-bold text-black">{title}</Typography.H4>
      <Typography.P className="text-center text-black">{description}</Typography.P>
    </div>
  );
};

export default AdvantageItem;
