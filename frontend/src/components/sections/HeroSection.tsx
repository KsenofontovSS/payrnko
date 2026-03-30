'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaServices: string;
  ctaContacts: string;
}

export function HeroSection({ title, subtitle, ctaServices, ctaContacts }: HeroSectionProps) {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-gradient-to-br from-navy-primary via-deep-blue to-royal">
      {/* Геометрический паттерн */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1.5" fill="white" />
              <line x1="0" y1="30" x2="60" y2="30" stroke="white" strokeWidth="0.3" opacity="0.5" />
              <line x1="30" y1="0" x2="30" y2="60" stroke="white" strokeWidth="0.3" opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-pattern)" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-container px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          {title}
        </motion.h1>

        <motion.p
          className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          {subtitle}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <Button variant="cta" size="lg" href="/ru/services">
            {ctaServices}
          </Button>
          <Button variant="secondary" size="lg" href="/ru/contacts" className="border-white text-white hover:bg-white/10">
            {ctaContacts}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
