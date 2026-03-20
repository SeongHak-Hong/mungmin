import { getStores } from '@/lib/notion';
import StoreMapClient from './StoreMapClient';

export const runtime = 'edge';

export const metadata = {
  title: '매장안내 - 멍냥의민족',
  description: '우리동네 멍냥의민족 오프라인 매장을 찾아보세요.',
};

export default async function StorePage() {
  const stores = await getStores();
  
  return (
    <StoreMapClient initialStores={stores} />
  );
}
