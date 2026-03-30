type TypographyVariant =
  | 'hero'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'bodyLarge'
  | 'body'
  | 'bodySmall'
  | 'caption';

const variantStyles: Record<TypographyVariant, string> = {
  hero: 'text-5xl md:text-6xl font-bold leading-tight',
  h1: 'text-4xl md:text-5xl font-bold leading-tight',
  h2: 'text-3xl md:text-4xl font-semibold leading-snug',
  h3: 'text-xl md:text-2xl font-semibold leading-snug',
  bodyLarge: 'text-lg font-normal leading-relaxed',
  body: 'text-base font-normal leading-relaxed',
  bodySmall: 'text-sm font-normal leading-normal',
  caption: 'text-xs font-normal leading-normal',
};

const defaultTags: Record<TypographyVariant, keyof JSX.IntrinsicElements> = {
  hero: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  bodyLarge: 'p',
  body: 'p',
  bodySmall: 'p',
  caption: 'span',
};

const colorStyles = {
  default: 'text-charcoal',
  secondary: 'text-slate',
  accent: 'text-royal',
  white: 'text-white',
} as const;

interface TypographyProps {
  variant: TypographyVariant;
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
  className?: string;
  color?: 'default' | 'secondary' | 'accent' | 'white';
}

export function Typography({
  variant,
  as,
  children,
  className = '',
  color = 'default',
}: TypographyProps) {
  const Tag = (as || defaultTags[variant]) as React.ElementType;

  return (
    <Tag className={`${variantStyles[variant]} ${colorStyles[color]} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
