import { twMerge } from 'tailwind-merge';
import { clsx, ClassValue } from 'clsx';

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};
