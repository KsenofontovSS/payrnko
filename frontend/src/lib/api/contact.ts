import type { ContactFormData, ContactFormResponse } from '@/types/api';
import { postAPI } from './client';

export async function submitContactForm(
  data: ContactFormData,
): Promise<ContactFormResponse> {
  return postAPI<ContactFormResponse>('/contact-form', { data });
}
