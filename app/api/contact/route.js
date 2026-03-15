import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, location, detailLocation, content } = body;

    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    const databaseId = '32254e91b4de80c6ae07f521440159d7';

    // Get current date in KST (ISO format without time)
    const now = new Date();
    const kstDate = new Date(now.getTime() + (9 * 60 * 60 * 1000)).toISOString().split('T')[0];

    const response = await notion.pages.create({
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
    });

    return NextResponse.json({ message: 'Success', id: response.id }, { status: 200 });
  } catch (error) {
    console.error('Notion storage error detail:', {
      message: error.message,
      code: error.code,
      body: error.body,
    });
    return NextResponse.json({ error: 'Failed to store in Notion' }, { status: 500 });
  }
}
