import { Section, Container, Typography, Button } from '@/components/ui';

interface CTASectionProps {
  title: string;
  buttonLabel: string;
}

export function CTASection({ title, buttonLabel }: CTASectionProps) {
  return (
    <Section className="bg-gradient-to-r from-royal to-sky-accent py-20">
      <Container className="text-center">
        <Typography variant="h2" color="white" className="mb-8">
          {title}
        </Typography>
        <Button variant="cta" size="lg" href="/contacts">
          {buttonLabel}
        </Button>
      </Container>
    </Section>
  );
}
