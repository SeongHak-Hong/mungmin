export async function getStores() {
  const databaseId = process.env.NOTION_DATABASE_ID;
  const apiKey = process.env.NOTION_API_KEY;

  if (!databaseId || !apiKey) {
    console.error('Missing Notion API Key or Database ID');
    return [];
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      // Cache settings for Next.js 15: disable caching for real-time updates
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('Notion API Error:', await response.text());
      return [];
    }

    const data = await response.json();

    const stores = data.results.map(page => {
      const properties = page.properties;
      
      const name = properties['지점명']?.title[0]?.plain_text || '이름 없음';
      const address = properties['주소']?.rich_text[0]?.plain_text || '';
      
      let lat = null;
      if (properties['위도']?.rich_text[0]?.plain_text) {
        lat = parseFloat(properties['위도'].rich_text[0].plain_text.replace(/[^0-9.]/g, ''));
      } else if (properties['위도']?.number) {
        lat = properties['위도'].number;
      }
      
      let lng = null;
      if (properties['경도']?.number) {
        lng = properties['경도'].number;
      } else if (properties['경도']?.rich_text[0]?.plain_text) {
        lng = parseFloat(properties['경도'].rich_text[0].plain_text.replace(/[^0-9.]/g, ''));
      }

      const phone = properties['연락처']?.phone_number || '';
      const date = properties['등록일']?.created_time || '';

      return {
        id: page.id,
        name,
        address,
        lat,
        lng,
        phone,
        date
      };
    });

    // Basic sorting by date (newest first - '업데이트순' equivalent)
    return stores.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  } catch (error) {
    console.error('Error fetching stores:', error);
    return [];
  }
}
