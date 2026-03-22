import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, location, detailLocation, content } = body;

    let apiKey = process.env.NOTION_API_KEY;
    let databaseId = process.env.NOTION_CONTACT_DATABASE_ID;

    if (!apiKey || !databaseId) {
      console.error('Missing Notion API configuration (Contact):', {
        hasApiKey: !!apiKey,
        hasDatabaseId: !!databaseId
      });
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Get current date in KST (ISO format without time)
    const now = new Date();
    const kstDate = new Date(now.getTime() + (9 * 60 * 60 * 1000)).toISOString().split('T')[0];

    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
        'User-Agent': 'Mungmin-Web'
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: {
          '문의 제목': {
            title: [
              {
                text: {
                  content: `[창업문의] ${name}`,
                },
              },
            ],
          },
          '성함': {
            rich_text: [
              {
                text: {
                  content: name,
                },
              },
            ],
          },
          '연락처': {
            phone_number: phone,
          },
          '주소': {
            rich_text: [
              {
                text: {
                  content: location,
                },
              },
            ],
          },
          '상세주소': {
            rich_text: [
              {
                text: {
                  content: detailLocation,
                },
              },
            ],
          },
          '내용': {
            rich_text: [
              {
                text: {
                  content: `이메일: ${email}\n\n문의내용:\n${content}`,
                },
              },
            ],
          },
          '접수일': {
            date: {
              start: kstDate,
            },
          },
          '상태': {
            status: {
              name: '접수됨',
            },
          },
        },
      }),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Notion API Error (Contact):', {
        status: response.status,
        error: errorText
      });
      return NextResponse.json({ error: 'Failed to store in Notion' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ message: 'Success', id: data.id }, { status: 200 });
  } catch (error) {
    console.error('Contact processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
