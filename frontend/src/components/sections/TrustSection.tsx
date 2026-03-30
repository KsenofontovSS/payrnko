'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Shield, TrendingUp, Lock } from 'lucide-react';
import { Section, Container } from '@/components/ui';

function CountUp({ target, suffix = '' }: { target: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (!ref.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          const numericTarget = parseInt(target.replace(/\D/g, ''), 10) || 0;
          animate(count, numericTarget, { duration: 2, ease: 'easeOut' });
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [count, target, hasAnimated]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

const trustItems = [
  {
    icon: Shield,
    value: '3566',
    label: 'Лицензия ЦБ РФ',
    sublabel: 'Банк России',
    suffix: '',
    prefix: '№ ',
  },
  {
    icon: TrendingUp,
    value: '120',
    label: 'Уставный капитал',
    sublabel: 'млн руб.',
    suffix: ' млн руб.',
    prefix: '',
  },
  {
    icon: Lock,
    value: 'TLS 1.3',
    label: 'Шифрование данных',
    sublabel: 'Защита информации',
    suffix: '',
    prefix: '',
    isStatic: true,
  },
];

export function TrustSection() {
  return (
    <Section background="ice">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {trustItems.map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <item.icon
                size={48}
                className="text-royal mb-4"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <p className="text-3xl md:text-4xl font-bold text-deep-blue mb-1">
                {item.isStatic ? (
                  item.value
                ) : (
                  <>
                    {item.prefix}
                    <CountUp target={item.value} suffix="" />
                    {item.suffix && <span className="text-xl"> {item.sublabel}</span>}
                  </>
                )}
              </p>
              <p className="text-base text-slate">{item.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
