import { getStores } from '@/lib/notion';
import StoreMapClient from './StoreMapClient';

export const runtime = 'edge';

export default async function StorePage() {
  const stores = await getStores();
  
  return (
    <StoreMapClient initialStores={stores} />
  );
}
