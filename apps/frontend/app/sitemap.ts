import type { MetadataRoute } from 'next';
import { apiClient } from '@/lib/api/client';

const BASE_URL = 'https://unitree-shop-web.vercel.app';

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: BASE_URL, priority: 1, changeFrequency: 'weekly' },
  { url: `${BASE_URL}/accessoires`, priority: 0.9, changeFrequency: 'daily' },
  { url: `${BASE_URL}/robots`, priority: 0.8, changeFrequency: 'monthly' },
  { url: `${BASE_URL}/robots/g1`, priority: 0.8, changeFrequency: 'monthly' },
  { url: `${BASE_URL}/robots/h1`, priority: 0.8, changeFrequency: 'monthly' },
  { url: `${BASE_URL}/devis`, priority: 0.7, changeFrequency: 'monthly' },
  { url: `${BASE_URL}/services`, priority: 0.6, changeFrequency: 'monthly' },
  { url: `${BASE_URL}/about`, priority: 0.5, changeFrequency: 'monthly' },
  { url: `${BASE_URL}/contact`, priority: 0.5, changeFrequency: 'monthly' },
  { url: `${BASE_URL}/mentions-legales`, priority: 0.2, changeFrequency: 'yearly' },
  { url: `${BASE_URL}/cgv`, priority: 0.2, changeFrequency: 'yearly' },
  { url: `${BASE_URL}/privacy`, priority: 0.2, changeFrequency: 'yearly' },
  { url: `${BASE_URL}/cookies`, priority: 0.2, changeFrequency: 'yearly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    const res = await apiClient.get('/products', { params: { limit: 200 } });
    const products: { slug: string; updatedAt: string }[] = res.data?.data?.data ?? [];
    productRoutes = products.map((p) => ({
      url: `${BASE_URL}/products/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      priority: 0.8,
      changeFrequency: 'weekly' as const,
    }));
  } catch {
    // API down at build time — static routes only
  }

  return [...STATIC_ROUTES, ...productRoutes];
}
