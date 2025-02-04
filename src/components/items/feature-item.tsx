import React from 'react';
import Typography from '../common/typography';

interface FeatureItemProps {
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ title, description }) => {
  return (
    <div className="h-full space-y-5 rounded-3xl bg-[#161521] p-8">
      <Typography.H4 className="text-center font-bold text-[#FFB103]">{title}</Typography.H4>
      <Typography.P className="text-center">{description}</Typography.P>
    </div>
  );
};

export default FeatureItem;
