export const metadata = {
  title: '브랜드 스토리',
  description: '반려동물과 반려인, 브랜드가 함께 행복한 세상을 꿈꾸는 멍냥의민족의 가치와 비전을 소개합니다.',
  alternates: {
    canonical: 'https://mungmin.com/main',
  },
  openGraph: {
    title: '브랜드 스토리 | 멍냥의민족',
    description: '멍냥의민족의 가치와 비전을 확인해보세요.',
    url: 'https://mungmin.com/main',
  },
};

export default function MainLayout({ children }) {
  return <>{children}</>;
}
