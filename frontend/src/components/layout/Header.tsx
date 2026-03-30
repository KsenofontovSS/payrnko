'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { createTranslator } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui';
import { MobileMenu } from './MobileMenu';
import { AccessibilityPanel } from '@/components/accessibility/AccessibilityPanel';

interface DropdownItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
}

export function Header() {
  const t = createTranslator('ru', 'common');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const navItems: NavItem[] = [
    {
      label: t('nav.about'),
      dropdown: [
        { label: 'Руководство', href: '/about' },
        { label: 'Документы', href: '/about#documents' },
        { label: 'Реквизиты', href: '/about#requisites' },
      ],
    },
    {
      label: t('nav.services'),
      dropdown: [
        { label: 'Расчётные услуги', href: '/services' },
        { label: 'Переводы', href: '/services#transfers' },
        { label: 'Эквайринг', href: '/services#acquiring' },
      ],
    },
    { label: t('nav.tariffs'), href: '/tariffs' },
    {
      label: t('nav.disclosure'),
      dropdown: [
        { label: 'Отчётность', href: '/disclosure' },
        { label: 'Нормативы', href: '/disclosure#standards' },
        { label: 'Аудит', href: '/disclosure#audit' },
        { label: 'Управление рисками', href: '/disclosure#risks' },
      ],
    },
    { label: t('nav.news'), href: '/news' },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDropdownEnter = (label: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(label);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 300);
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-royal focus:text-white focus:px-4 focus:py-2 focus:rounded-button"
      >
        Перейти к содержимому
      </a>

      <header
        className={`sticky top-0 z-50 bg-white transition-all duration-200 ease-standard ${
          isScrolled ? 'shadow-card' : ''
        }`}
        role="banner"
      >
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between transition-all duration-200 ${
              isScrolled ? 'h-14' : 'h-16'
            }`}
          >
            {/* Логотип */}
            <Link href="/" className="flex items-center gap-2 font-bold text-deep-blue text-lg">
              <span className="text-royal">РНКО</span>
              <span className="hidden sm:inline">ППР</span>
            </Link>

            {/* Десктоп навигация */}
            <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Основная навигация">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.dropdown && handleDropdownEnter(item.label)}
                  onMouseLeave={() => item.dropdown && handleDropdownLeave()}
                >
                  {item.dropdown ? (
                    <button
                      type="button"
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-charcoal hover:text-royal transition-colors duration-200 rounded-button focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal"
                      aria-expanded={activeDropdown === item.label}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown size={14} aria-hidden="true" />
                    </button>
                  ) : (
                    <Link
                      href={item.href!}
                      className="px-3 py-2 text-sm font-medium text-charcoal hover:text-royal transition-colors duration-200 rounded-button focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal"
                    >
                      {item.label}
                    </Link>
                  )}

                  {/* Dropdown */}
                  <AnimatePresence>
                    {item.dropdown && activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        className="absolute top-full left-0 mt-1 w-60 bg-white rounded-card border border-silver shadow-card-hover py-2"
                        role="menu"
                      >
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="block px-4 py-2 text-sm text-charcoal hover:bg-ice hover:text-royal transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal"
                            role="menuitem"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Правая часть */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <AccessibilityPanel />
              </div>

              <Button variant="primary" size="sm" href="/contacts" className="hidden sm:inline-flex">
                {t('nav.contacts')}
              </Button>

              {/* Бургер */}
              <button
                type="button"
                className="lg:hidden p-2 text-charcoal hover:text-royal transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Открыть меню"
                aria-expanded={mobileMenuOpen}
              >
                <Menu size={24} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={navItems}
      />
    </>
  );
}
