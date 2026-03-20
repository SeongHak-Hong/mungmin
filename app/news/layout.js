export const metadata = {
  title: '소식',
  description: '멍냥의민족의 새로운 소식과 이벤트, 반려동물 트렌드를 가장 빠르게 확인해보세요.',
  alternates: {
    canonical: 'https://mungmin.com/news',
  },
  openGraph: {
    title: '소식 | 멍냥의민족',
    description: '멍냥의민족의 최신 공지사항과 이벤트 소식.',
    url: 'https://mungmin.com/news',
  },
};

export default function NewsLayout({ children }) {
  return <>{children}</>;
}
