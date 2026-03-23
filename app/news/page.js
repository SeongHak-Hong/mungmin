import { getNews } from '@/lib/notion';
import NewsListClient from './NewsListClient';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import '@/styles/main.css';
import '@/styles/news.css';

export default async function NewsPage() {
  const news = await getNews();
  
  return (
    <NewsListClient initialNews={news} />
  );
}
