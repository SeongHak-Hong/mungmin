import { NextResponse } from 'next/server';
import { getPartners } from '@/lib/notion';

export async function GET() {
  try {
    const partners = await getPartners();
    return NextResponse.json(partners);
  } catch (error) {
    console.error('API Error (partners):', error);
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
  }
}
