import Link from 'next/link';
import { Container, Section, Typography, Button } from '@/components/ui';

export default function NotFound() {
  return (
    <Section background="snow">
      <Container className="text-center py-20">
        <Typography variant="hero" color="accent" className="mb-4">
          404
        </Typography>
        <Typography variant="h2" className="mb-4">
          Страница не найдена
        </Typography>
        <Typography variant="body" color="secondary" className="mb-8">
          Запрашиваемая страница не существует или была удалена.
        </Typography>
        <Button variant="primary" href="/">
          Вернуться на главную
        </Button>
      </Container>
    </Section>
  );
}
