'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, X, Type, Contrast, ZoomIn } from 'lucide-react';

interface A11ySettings {
  fontSize: 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  grayscale: boolean;
}

const defaultSettings: A11ySettings = {
  fontSize: 'normal',
  highContrast: false,
  grayscale: false,
};

export function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<A11ySettings>(defaultSettings);

  useEffect(() => {
    const saved = localStorage.getItem('a11y-settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch {
        // Игнорируем невалидные данные
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('a11y-settings', JSON.stringify(settings));

    const html = document.documentElement;

    // Размер шрифта
    html.classList.remove('text-base', 'text-lg', 'text-xl');
    if (settings.fontSize === 'large') html.classList.add('text-lg');
    else if (settings.fontSize === 'xlarge') html.classList.add('text-xl');

    // Контраст
    html.classList.toggle('high-contrast', settings.highContrast);

    // Ч/Б
    html.classList.toggle('grayscale', settings.grayscale);
  }, [settings]);

  const toggleFontSize = () => {
    setSettings((prev) => ({
      ...prev,
      fontSize: prev.fontSize === 'normal' ? 'large' : prev.fontSize === 'large' ? 'xlarge' : 'normal',
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate hover:text-royal transition-colors duration-200 rounded-button focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal"
        aria-label="Версия для слабовидящих"
        aria-expanded={isOpen}
      >
        <Eye size={20} strokeWidth={1.5} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-72 bg-white rounded-card border border-silver shadow-card-hover p-4 z-50"
            role="dialog"
            aria-label="Настройки доступности"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-charcoal text-sm">Настройки доступности</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-cool-gray hover:text-charcoal"
                aria-label="Закрыть"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={toggleFontSize}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left rounded-button hover:bg-ice transition-colors"
              >
                <ZoomIn size={18} className="text-royal" aria-hidden="true" />
                <span>Размер шрифта: {settings.fontSize === 'normal' ? 'Обычный' : settings.fontSize === 'large' ? 'Крупный' : 'Очень крупный'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSettings((prev) => ({ ...prev, highContrast: !prev.highContrast }))}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left rounded-button transition-colors ${
                  settings.highContrast ? 'bg-royal text-white' : 'hover:bg-ice'
                }`}
              >
                <Contrast size={18} className={settings.highContrast ? 'text-white' : 'text-royal'} aria-hidden="true" />
                <span>Высокий контраст</span>
              </button>

              <button
                type="button"
                onClick={() => setSettings((prev) => ({ ...prev, grayscale: !prev.grayscale }))}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left rounded-button transition-colors ${
                  settings.grayscale ? 'bg-royal text-white' : 'hover:bg-ice'
                }`}
              >
                <Type size={18} className={settings.grayscale ? 'text-white' : 'text-royal'} aria-hidden="true" />
                <span>Чёрно-белый режим</span>
              </button>

              <hr className="border-silver" />

              <button
                type="button"
                onClick={resetSettings}
                className="w-full text-sm text-cool-gray hover:text-charcoal text-center py-1"
              >
                Сбросить настройки
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
