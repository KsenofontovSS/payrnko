'use client';

import { motion } from 'framer-motion';
import { Section, Container, Typography, Card, Badge, Button } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import type { NewsArticle } from '@/types/api';

interface NewsPreviewSectionProps {
  news: (NewsArticle & { id?: number })[];
  title: string;
  viewAllLabel: string;
  locale: string;
}

export function NewsPreviewSection({ news, title, viewAllLabel, locale }: NewsPreviewSectionProps) {
  return (
    <Section background="snow" id="news">
      <Container>
        <div className="flex items-center justify-between mb-12">
          <Typography variant="h2">{title}</Typography>
          <Button variant="ghost" href="/ru/news" className="hidden sm:inline-flex">
            {viewAllLabel} →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article, index) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card as="a" href={`/ru/news/${article.slug}`} className="h-full flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-cool-gray">
                    {formatDate(article.published_date, locale)}
                  </span>
                  {article.category?.data?.attributes?.name && (
                    <Badge variant="info" size="sm">
                      {article.category.data.attributes.name}
                    </Badge>
                  )}
                </div>
                <Typography variant="h3" className="mb-2 line-clamp-2">
                  {article.title}
                </Typography>
                <Typography variant="bodySmall" color="secondary" className="flex-1 line-clamp-2">
                  {article.excerpt}
                </Typography>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button variant="ghost" href="/ru/news">
            {viewAllLabel} →
          </Button>
        </div>
      </Container>
    </Section>
  );
}
