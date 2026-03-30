'use client';

import { Container, Section, Typography, Button } from '@/components/ui';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Section background="snow">
      <Container className="text-center py-20">
        <Typography variant="hero" color="accent" className="mb-4">
          500
        </Typography>
        <Typography variant="h2" className="mb-4">
          Произошла ошибка
        </Typography>
        <Typography variant="body" color="secondary" className="mb-8">
          Что-то пошло не так. Попробуйте обновить страницу.
        </Typography>
        <Button variant="primary" onClick={reset}>
          Попробовать снова
        </Button>
      </Container>
    </Section>
  );
}
