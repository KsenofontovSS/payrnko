'use client';

import Link from 'next/link';

interface CardProps {
  children: React.ReactNode;
  hoverable?: boolean;
  className?: string;
  onClick?: () => void;
  as?: 'div' | 'article' | 'a';
  href?: string;
}

export function Card({
  children,
  hoverable = true,
  className = '',
  onClick,
  as = 'div',
  href,
}: CardProps) {
  const baseStyles =
    'bg-white rounded-card border border-silver p-6 transition-all duration-300 ease-standard';

  const hoverStyles = hoverable
    ? 'hover:shadow-card-hover hover:-translate-y-0.5'
    : '';

  const classes = `${baseStyles} ${hoverStyles} ${className}`.trim();

  if (as === 'a' && href) {
    return (
      <Link href={href} className={`${classes} block`} onClick={onClick}>
        {children}
      </Link>
    );
  }

  const Tag = as;

  return (
    <Tag className={classes} onClick={onClick}>
      {children}
    </Tag>
  );
}
