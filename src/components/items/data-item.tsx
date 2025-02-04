import React from 'react';
import Typography from '../common/typography';

interface DataItemProps {
  title: string;
  percent: number;
}

const DataItem: React.FC<DataItemProps> = ({ title, percent }) => {
  return (
    <div className="h-full space-y-5 rounded-3xl bg-[#161521] p-6">
      <Typography.H4 className="font-bold uppercase">
        {title}
        <span className="ml-5 text-[#FFB103]">{percent}%</span>
      </Typography.H4>
      <div className="flex h-[20px] w-full overflow-hidden rounded-3xl bg-black">
        <span className="h-full rounded-3xl bg-[#FFB103]" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

export default DataItem;
