'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { contactFormSchema, type ContactFormValues } from '@/lib/validations/contactForm';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export function ContactForm() {
  const t = useTranslations('contacts.form');
  const [status, setStatus] = useState<FormStatus>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      consent: false,
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setStatus('loading');
    try {
      // В продакшне здесь будет вызов submitContactForm с hCaptcha токеном
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus('success');
      reset();
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle size={48} className="text-success mb-4" strokeWidth={1.5} />
        <p className="text-lg font-medium text-success">{t('success')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {status === 'error' && (
        <div className="flex items-center gap-2 bg-error/10 text-error rounded-button p-3">
          <AlertCircle size={18} strokeWidth={1.5} aria-hidden="true" />
          <span className="text-sm">{t('error')}</span>
        </div>
      )}

      {/* Имя */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-1.5">
          {t('name')} <span className="text-error">*</span>
        </label>
        <input
          id="name"
          type="text"
          placeholder={t('namePlaceholder')}
          {...register('name')}
          className="w-full px-4 py-2.5 rounded-button border border-silver bg-white text-charcoal placeholder:text-cool-gray focus:border-royal focus:ring-2 focus:ring-royal/20 transition-colors"
          aria-invalid={errors.name ? 'true' : undefined}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-error" role="alert">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1.5">
          {t('email')} <span className="text-error">*</span>
        </label>
        <input
          id="email"
          type="email"
          placeholder={t('emailPlaceholder')}
          {...register('email')}
          className="w-full px-4 py-2.5 rounded-button border border-silver bg-white text-charcoal placeholder:text-cool-gray focus:border-royal focus:ring-2 focus:ring-royal/20 transition-colors"
          aria-invalid={errors.email ? 'true' : undefined}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-error" role="alert">{errors.email.message}</p>
        )}
      </div>

      {/* Тема */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-charcoal mb-1.5">
          {t('subject')} <span className="text-error">*</span>
        </label>
        <input
          id="subject"
          type="text"
          placeholder={t('subjectPlaceholder')}
          {...register('subject')}
          className="w-full px-4 py-2.5 rounded-button border border-silver bg-white text-charcoal placeholder:text-cool-gray focus:border-royal focus:ring-2 focus:ring-royal/20 transition-colors"
          aria-invalid={errors.subject ? 'true' : undefined}
          aria-describedby={errors.subject ? 'subject-error' : undefined}
        />
        {errors.subject && (
          <p id="subject-error" className="mt-1 text-sm text-error" role="alert">{errors.subject.message}</p>
        )}
      </div>

      {/* Сообщение */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-charcoal mb-1.5">
          {t('message')} <span className="text-error">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder={t('messagePlaceholder')}
          {...register('message')}
          className="w-full px-4 py-2.5 rounded-button border border-silver bg-white text-charcoal placeholder:text-cool-gray focus:border-royal focus:ring-2 focus:ring-royal/20 transition-colors resize-vertical"
          aria-invalid={errors.message ? 'true' : undefined}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-sm text-error" role="alert">{errors.message.message}</p>
        )}
      </div>

      {/* Согласие */}
      <div className="flex items-start gap-2">
        <input
          id="consent"
          type="checkbox"
          {...register('consent')}
          className="mt-1 rounded border-silver text-royal focus:ring-royal"
          aria-invalid={errors.consent ? 'true' : undefined}
          aria-describedby={errors.consent ? 'consent-error' : undefined}
        />
        <label htmlFor="consent" className="text-sm text-slate">
          {t('consent')} <span className="text-error">*</span>
        </label>
      </div>
      {errors.consent && (
        <p id="consent-error" className="text-sm text-error" role="alert">{errors.consent.message}</p>
      )}

      <Button
        variant="primary"
        size="lg"
        type="submit"
        disabled={status === 'loading'}
        loading={status === 'loading'}
        icon={status === 'loading' ? undefined : <Send size={18} />}
        className="w-full"
      >
        {t('submit')}
      </Button>
    </form>
  );
}
