'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';

interface DropdownItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

export function MobileMenu({ isOpen, onClose, navItems }: MobileMenuProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleSection = (label: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  // Блокировка скролла и закрытие по Escape
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  // Фокус-ловушка
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const focusableElements = menuRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-charcoal z-[55]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Menu panel */}
          <motion.div
            ref={menuRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-white z-[60] flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Мобильное меню"
          >
            {/* Кнопка закрытия */}
            <div className="flex items-center justify-between p-4 border-b border-silver">
              <span className="font-bold text-deep-blue">Меню</span>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-charcoal hover:text-royal transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal"
                aria-label="Закрыть меню"
              >
                <X size={24} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>

            {/* Навигация */}
            <nav className="flex-1 overflow-y-auto py-4" role="navigation" aria-label="Мобильная навигация">
              {navItems.map((item) => (
                <div key={item.label} className="border-b border-silver/50">
                  {item.dropdown ? (
                    <>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between px-6 py-3 text-base font-medium text-charcoal hover:text-royal transition-colors duration-200"
                        onClick={() => toggleSection(item.label)}
                        aria-expanded={openSections.has(item.label)}
                      >
                        {item.label}
                        <motion.span
                          animate={{ rotate: openSections.has(item.label) ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown size={18} aria-hidden="true" />
                        </motion.span>
                      </button>
                      <AnimatePresence initial={false}>
                        {openSections.has(item.label) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden bg-snow"
                          >
                            {item.dropdown.map((sub) => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                className="block px-10 py-2.5 text-sm text-slate hover:text-royal transition-colors duration-200"
                                onClick={onClose}
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={item.href!}
                      className="block px-6 py-3 text-base font-medium text-charcoal hover:text-royal transition-colors duration-200"
                      onClick={onClose}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Контакты в меню */}
            <div className="p-4 border-t border-silver">
              <Link
                href="/contacts"
                className="block w-full text-center bg-royal text-white py-3 rounded-button font-medium hover:bg-royal/90 transition-colors duration-200"
                onClick={onClose}
              >
                Контакты
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
