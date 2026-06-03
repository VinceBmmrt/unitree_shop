import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/compte/', '/checkout/', '/auth/'],
      },
    ],
    sitemap: 'https://unitree-shop-web.vercel.app/sitemap.xml',
  };
}
