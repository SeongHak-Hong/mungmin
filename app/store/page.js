import { getStores } from '@/lib/notion';
import StoreMapClient from './StoreMapClient';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StorePage() {
  const stores = await getStores();
  
  return (
    <StoreMapClient initialStores={stores} />
  );
}
