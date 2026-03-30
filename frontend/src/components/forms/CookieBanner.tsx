'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createTranslator } from '@/lib/i18n';
import Link from 'next/link';
import { Button } from '@/components/ui';

export function CookieBanner() {
  const t = createTranslator('ru', 'cookie');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-silver shadow-card-hover p-4 sm:p-6"
          role="dialog"
          aria-label="Cookie consent"
        >
          <div className="mx-auto max-w-container flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="text-sm text-slate flex-1">
              {t('message')}{' '}
              <Link href="/privacy" className="text-royal hover:underline">
                Подробнее
              </Link>
            </p>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Button variant="ghost" size="sm" onClick={decline}>
                {t('decline')}
              </Button>
              <Button variant="primary" size="sm" onClick={accept}>
                {t('accept')}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
