import { icons, type LucideIcon } from 'lucide-react';

const sizeMap = {
  sm: 24,
  md: 32,
  lg: 48,
} as const;

const colorMap = {
  accent: 'text-royal',
  neutral: 'text-slate',
  white: 'text-white',
  success: 'text-success',
  error: 'text-error',
} as const;

interface IconProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'accent' | 'neutral' | 'white' | 'success' | 'error';
  className?: string;
  ariaLabel?: string;
}

export function Icon({
  name,
  size = 'sm',
  color = 'accent',
  className = '',
  ariaLabel,
}: IconProps) {
  const LucideIcon = icons[name as keyof typeof icons] as LucideIcon | undefined;

  if (!LucideIcon) {
    return null;
  }

  const isDecorative = !ariaLabel;

  return (
    <LucideIcon
      size={sizeMap[size]}
      strokeWidth={1.5}
      className={`${colorMap[color]} ${className}`.trim()}
      aria-hidden={isDecorative}
      aria-label={ariaLabel}
      role={isDecorative ? undefined : 'img'}
    />
  );
}
