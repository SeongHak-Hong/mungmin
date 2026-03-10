import '@/styles/design-system.css';

export const metadata = {
  title: '멍냥의민족 – 국내 최초 O2O 리워드 반려동물 용품 플랫폼',
  description: '멍냥의민족은 로열티 0원, 전 상품 10% 적립, 셀프 스튜디오까지 갖춘 국내 최초 O2O 반려동물 프랜차이즈입니다.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
