export default async function sitemap() {
  const baseUrl = 'https://mungmin.com';

  // 기본 정적 경로
  const routes = ['', '/main', '/store', '/news', '/contact'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }));

  return [...routes];
}
