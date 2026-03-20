import '@/styles/design-system.css';
import Script from 'next/script';

export const metadata = {
  metadataBase: new URL('https://mungmin.com'),
  title: {
    default: '멍냥의민족 – 국내 최초 O2O 리워드 반려동물 용품 플랫폼',
    template: '%s | 멍냥의민족'
  },
  description: '멍냥의민족은 로열티 0원, 전 상품 10% 적립, 셀프 스튜디오까지 갖춘 국내 최초 O2O 반려동물 프랜차이즈입니다.',
  keywords: ['멍냥의민족', '반려동물 용품', '애견용품 창업', '무인 애견용품점', 'O2O 플랫폼', '반려동물 리워드'],
  authors: [{ name: '멍냥의민족' }],
  creator: '멍냥의민족',
  publisher: '멍냥의민족',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.ico',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: '멍냥의민족',
    description: '반려동물과 반려인이 함께 행복한 세상, 리워드형 반려동물 용품 플랫폼',
    url: 'https://mungmin.com',
    siteName: '멍냥의민족',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/assets/images/common/mungnyang-official-brand-logo.svg', // 로고 이미지를 기본 OG 이미지로 설정
        width: 800,
        height: 600,
        alt: '멍냥의민족 로고',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '멍냥의민족',
    description: '반려동물과 반려인이 함께 행복한 세상, 리워드형 반려동물 용품 플랫폼',
    images: ['/assets/images/common/mungnyang-official-brand-logo.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  const naverClientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

  return (
    <html lang="ko">
      <head>
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://oapi.map.naver.com"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body>
        {children}
        <Script
          src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${naverClientId}`}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
