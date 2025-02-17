import React from 'react';

interface DefaultIconProps {
  symbol: string;
  scale?: number;
}

const DefaultIcon: React.FC<DefaultIconProps> = ({ symbol, scale = 30 }) => {
  return (
    <div
      className="flex items-center justify-center rounded-full border border-primary-500/50 bg-primary-500/10"
      style={{ width: scale, height: scale }}
    >
      <span
        className="block font-semibold text-white"
        style={{
          display: 'inline-block',
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontSize: scale / 3 - 1,
        }}
      >
        {symbol}
      </span>
    </div>
  );
};

export default DefaultIcon;
