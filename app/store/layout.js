export const metadata = {
  title: '매장안내',
  description: '가까운 멍냥의민족 오프라인 매장을 확인하고 다양한 혜택과 전문 셀프 스튜디오를 직접 경험해보세요.',
  alternates: {
    canonical: 'https://mungmin.com/store',
  },
  openGraph: {
    title: '매장안내 | 멍냥의민족',
    description: '전국 멍냥의민족 매장 위치와 정보를 확인하세요.',
    url: 'https://mungmin.com/store',
  },
};

export default function StoreLayout({ children }) {
  return <>{children}</>;
}
