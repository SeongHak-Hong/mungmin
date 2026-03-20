import { getStores } from '@/lib/notion';
import StoreMapClient from './StoreMapClient';
import Script from 'next/script';

export const runtime = 'edge';

export const metadata = {
  title: '매장안내 - 멍냥의민족',
  description: '우리동네 멍냥의민족 오프라인 매장을 찾아보세요.',
};

export default async function StorePage() {
  const stores = await getStores();
  const naverClientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
  
  return (
    <>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${naverClientId}`}
        strategy="beforeInteractive"
      />
      <StoreMapClient initialStores={stores} />
    </>
  );
}
