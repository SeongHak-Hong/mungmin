import { getNews } from '@/lib/notion';
import NewsListClient from './NewsListClient';

export const runtime = 'edge';
import '@/styles/main.css';
import '@/styles/news.css';

export default async function NewsPage() {
  const news = await getNews();
  
  return (
    <NewsListClient initialNews={news} />
  );
}
