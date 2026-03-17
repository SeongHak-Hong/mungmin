'use client';

import { NavermapsProvider } from 'react-naver-maps';

export default function NaverMapsProvider({ children }) {
  const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

  return (
    <NavermapsProvider ncpClientId={clientId}>
      {children}
    </NavermapsProvider>
  );
}
