export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/', // API 경로는 크롤링 제외
    },
    sitemap: 'https://mungmin.com/sitemap.xml',
  };
}
