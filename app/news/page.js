import { getNews } from '@/lib/notion';
import NewsListClient from './NewsListClient';
import '@/styles/main.css';
import '@/styles/news.css';

export const metadata = {
  title: '소식 - 멍냥의민족',
  description: '멍냥의민족의 새로운 소식을 확인해보세요.',
};

export default async function NewsPage() {
  const news = await getNews();
  
  return (
    <NewsListClient initialNews={news} />
  );
}
