'use client';

import { motion } from 'framer-motion';
import { Section, Container, Typography, Card, Icon, Button } from '@/components/ui';
import type { Service } from '@/types/api';

interface ServicesSectionProps {
  services: (Service & { id?: number })[];
  title: string;
}

export function ServicesSection({ services, title }: ServicesSectionProps) {
  return (
    <Section background="white" id="services">
      <Container>
        <Typography variant="h2" className="text-center mb-12">
          {title}
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
            >
              <Card hoverable className="h-full flex flex-col">
                <div className="mb-4">
                  <Icon name={service.icon_name || 'CreditCard'} size="md" color="accent" />
                </div>
                <Typography variant="h3" className="mb-3">
                  {service.title}
                </Typography>
                <Typography variant="bodySmall" color="secondary" className="mb-4 flex-1">
                  {service.short_description}
                </Typography>
                <Button variant="ghost" size="sm" href={`/services/${service.slug}`}>
                  Подробнее →
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
