import '@/styles/design-system.css';
import Script from 'next/script';

export const metadata = {
  title: '멍냥의민족 – 국내 최초 O2O 리워드 반려동물 용품 플랫폼',
  description: '멍냥의민족은 로열티 0원, 전 상품 10% 적립, 셀프 스튜디오까지 갖춘 국내 최초 O2O 반려동물 프랜차이즈입니다.',
};

export default function RootLayout({ children }) {
  const naverClientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <Script
          src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${naverClientId}`}
          strategy="afterInteractive"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
