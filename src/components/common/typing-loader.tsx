import React from 'react';

import { Slash } from 'lucide-react';

import Typography from '../common/typography';

interface TypingLoaderProps {
  text?: string;
}

const TypingLoader: React.FC<TypingLoaderProps> = ({ text = 'Loading...' }) => {
  return (
    <Typography.P className="flex items-center gap-3">
      {text} <Slash className="animate-spin" size={13} strokeWidth={3} />
    </Typography.P>
  );
};

export default TypingLoader;
