'use client';

import React from 'react';

import { cn } from '@/utils/cn.util';

import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import Button, { ButtonProps } from './button';

interface PaginationComponent
  extends React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement>> {
  Link: typeof Link;
  Prev: typeof Prev;
  Next: typeof Next;
}

interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {}

interface LinkProps extends ButtonProps {
  page: number;
  isActive?: boolean;
  disabled?: boolean;
}

interface PrevProps {
  currentPage: number;
}

interface NextProps {
  currentPage: number;
  lastPage: number;
}

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex h-full gap-2', className)} {...props} />
  ),
);

const Prev: React.FC<PrevProps> = ({ currentPage }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchParams] = useSearchParams();

  const handleOnClick = (): void => {
    if (currentPage > 1) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', (currentPage - 1).toString());
      navigate(`${location.pathname}?${params.toString()}`);
    }
  };

  return (
    <Button
      disabled={!(currentPage > 1)}
      size="icon"
      type="button"
      variant="outlineSecondary"
      onClick={handleOnClick}
    >
      <ChevronLeft />
    </Button>
  );
};

const Next: React.FC<NextProps> = ({ currentPage, lastPage }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchParams] = useSearchParams();

  const handleOnClick = (): void => {
    if (currentPage < lastPage) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', (currentPage + 1).toString());
      navigate(`${location.pathname}?${params.toString()}`);
    }
  };

  return (
    <Button
      disabled={!(currentPage < lastPage) || currentPage + 1 >= lastPage}
      size="icon"
      type="button"
      variant="outlineSecondary"
      onClick={handleOnClick}
    >
      <ChevronRight />
    </Button>
  );
};

const Link = React.forwardRef<HTMLButtonElement, LinkProps>(
  ({ page, isActive, disabled, ...props }, ref) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [searchParams] = useSearchParams();

    const handleOnClick = (): void => {
      const params = new URLSearchParams(searchParams);
      params.set('page', page.toString());
      navigate(`${location.pathname}?${params.toString()}`);
    };

    return (
      <Button
        ref={ref}
        {...props}
        disabled={disabled}
        size="icon"
        type="button"
        variant={isActive ? 'outline' : 'outlineSecondary'}
        onClick={handleOnClick}
      >
        {page}
      </Button>
    );
  },
);

(Pagination as PaginationComponent).Link = Link;
(Pagination as PaginationComponent).Prev = Prev;
(Pagination as PaginationComponent).Next = Next;

export default Pagination as PaginationComponent;
