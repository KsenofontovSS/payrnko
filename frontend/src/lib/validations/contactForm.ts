import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(100, 'Имя должно содержать максимум 100 символов'),
  email: z
    .string()
    .email('Введите корректный email'),
  subject: z
    .string()
    .min(5, 'Тема должна содержать минимум 5 символов')
    .max(200, 'Тема должна содержать максимум 200 символов'),
  message: z
    .string()
    .min(10, 'Сообщение должно содержать минимум 10 символов')
    .max(5000, 'Сообщение должно содержать максимум 5000 символов'),
  consent: z
    .boolean()
    .refine((val) => val === true, 'Необходимо согласие на обработку данных'),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
