'use client';

import Link from 'next/link';

const variantStyles = {
  primary:
    'bg-royal text-white hover:bg-royal/90 active:bg-royal/80',
  secondary:
    'bg-transparent text-royal border border-royal hover:bg-ice active:bg-ice/80',
  ghost:
    'bg-transparent text-royal hover:underline active:text-royal/80',
  cta:
    'bg-white text-deep-blue hover:bg-ice hover:shadow-card-hover active:bg-ice/80',
} as const;

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-7 py-3 text-base',
  lg: 'px-9 py-4 text-lg',
} as const;

interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'cta';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit';
  ariaLabel?: string;
}

export function Button({
  variant,
  size = 'md',
  children,
  href,
  onClick,
  disabled = false,
  loading = false,
  icon,
  className = '',
  type = 'button',
  ariaLabel,
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 rounded-button font-medium transition-all duration-200 ease-standard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal';

  const disabledStyles = disabled || loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`.trim();

  const content = (
    <>
      {loading ? (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span aria-hidden="true">{icon}</span>
      ) : null}
      {children}
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
    >
      {content}
    </button>
  );
}
