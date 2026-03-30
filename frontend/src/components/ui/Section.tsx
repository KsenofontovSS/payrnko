const backgroundStyles = {
  white: 'bg-white',
  ice: 'bg-ice',
  snow: 'bg-snow',
  gradient: 'bg-gradient-to-b from-deep-blue to-navy-primary text-white',
} as const;

interface SectionProps {
  children: React.ReactNode;
  background?: 'white' | 'ice' | 'snow' | 'gradient';
  className?: string;
  id?: string;
}

export function Section({
  children,
  background = 'white',
  className = '',
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`py-16 md:py-24 ${backgroundStyles[background]} ${className}`.trim()}
    >
      {children}
    </section>
  );
}
