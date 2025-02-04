import React from 'react';

import { cn } from '@/utils/cn.util';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ContainerProps extends HTMLMotionProps<'div'> {
  delay?: number;
  reverse?: boolean;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, delay = 0.2, reverse, ...props }, ref) => (
    <motion.div
      ref={ref}
      {...props}
      className={cn('h-full w-full', className)}
      initial={{ opacity: 0, y: reverse ? -20 : 20 }}
      transition={{ delay: delay, duration: 0.4, ease: 'easeInOut' }}
      viewport={{ once: false }}
      whileInView={{ opacity: 1, y: 0 }}
    />
  ),
);

export default React.memo(Container);
