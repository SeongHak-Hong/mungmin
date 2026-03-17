'use client';

import { NavermapsProvider } from 'react-naver-maps';

export default function NaverMapsProvider({ children }) {
  const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

  if (!clientId) {
    // API 키가 없으면 지도를 로드하지 않고 자식 요소만 렌더링하거나 빈 화면 반환
    return <>{children}</>;
  }

  return (
    <NavermapsProvider ncpClientId={clientId}>
      {children}
    </NavermapsProvider>
  );
}
