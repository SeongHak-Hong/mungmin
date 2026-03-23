async function getNotionConfig(envKey) {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env[envKey];

  if (!apiKey || !databaseId) {
    if (typeof window === 'undefined') {
      console.warn(`[Notion Config] Missing ${envKey} or API key in server environment`);
    }
    return null;
  }

  return { apiKey, databaseId };
}

async function notionFetch(path, apiKey, options = {}) {
  const response = await fetch(`https://api.notion.com/v1/${path}`, {
    method: options.method || 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
      'User-Agent': 'Mungmin-Web'
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Notion API Error (${path}):`, {
      status: response.status,
      statusText: response.statusText,
      error: errorText
    });
    throw new Error(`Notion API Error: ${response.status}`);
  }

  return response.json();
}

export async function getStores() {
  const config = await getNotionConfig('NOTION_STORES_DATABASE_ID');
  if (!config) return [];

  const { apiKey, databaseId } = config;

  try {
    const response = await notionFetch(`databases/${databaseId}/query`, apiKey, {
      method: 'POST'
    });

    const stores = response.results.map(page => {
      const properties = page.properties;
      
      const name = properties['지점명']?.title?.[0]?.plain_text || '이름 없음';
      const address = properties['주소']?.rich_text?.[0]?.plain_text || '';
      
      let lat = null;
      if (properties['위도']?.rich_text?.[0]?.plain_text) {
        lat = parseFloat(properties['위도'].rich_text[0].plain_text.replace(/[^0-9.]/g, ''));
      } else if (properties['위도']?.number) {
        lat = properties['위도'].number;
      }
      
      let lng = null;
      if (properties['경도']?.number) {
        lng = properties['경도'].number;
      } else if (properties['경도']?.rich_text?.[0]?.plain_text) {
        lng = parseFloat(properties['경도'].rich_text[0].plain_text.replace(/[^0-9.]/g, ''));
      }

      const phone = properties['연락처']?.phone_number || '';
      const date = properties['등록일']?.created_time || page.created_time;

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

    return stores.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  } catch (error) {
    console.error('Error fetching stores:', error);
    return [];
  }
}

export async function getPartners() {
  const config = await getNotionConfig('NOTION_PARTNERS_DATABASE_ID');
  if (!config) return [];

  const { apiKey, databaseId } = config;

  try {
    const response = await notionFetch(`databases/${databaseId}/query`, apiKey, {
      method: 'POST'
    });

    const partners = response.results.map(page => {
      const properties = page.properties;
      
      const name = properties['이름']?.title?.[0]?.plain_text || '관계사';
      const url = properties['URL']?.url || '#';
      const logoFile = properties['로고']?.files?.[0];
      const logoUrl = logoFile?.file?.url || logoFile?.external?.url || '';
      const order = properties['순서']?.number || 0;

      return {
        id: page.id,
        name,
        url,
        logoUrl,
        order
      };
    });

    return partners.sort((a, b) => a.order - b.order);

  } catch (error) {
    console.error('Error fetching partners:', error);
    return [];
  }
}

export async function getNews() {
  const config = await getNotionConfig('NOTION_NEWS_DATABASE_ID');
  if (!config) return [];

  const { apiKey, databaseId } = config;

  try {
    const response = await notionFetch(`databases/${databaseId}/query`, apiKey, {
      method: 'POST',
      body: {
        filter: {
          property: '게시여부',
          select: {
            equals: '게시'
          }
        },
        sorts: [
          {
            property: '게시물번호',
            direction: 'descending'
          }
        ]
      }
    });

    const news = response.results.map(page => {
      const p = page.properties;
      
      const title = p['제목']?.title?.[0]?.plain_text || '제목 없음';
      const category = p['카테고리']?.select?.name || '기타';
      const videoUrl = p['유튜브 링크']?.url || '';
      const order = p['게시물번호']?.number || 0;
      const isNotice = p['공지여부']?.checkbox || false;
      const author = p['작성자']?.rich_text?.[0]?.plain_text || '멍냥의민족';
      const content = p['게시물 내용']?.rich_text?.[0]?.plain_text || '';
      const dateVal = p['날짜']?.date?.start || page.created_time.split('T')[0];
      const date = dateVal.replace(/-/g, '.');

      const thumbFile = p['썸네일']?.files[0];
      let thumbnail = thumbFile?.file?.url || thumbFile?.external?.url || '';

      if (!thumbnail && videoUrl) {
        const videoIdMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
        if (videoIdMatch && videoIdMatch[1]) {
          thumbnail = `https://img.youtube.com/vi/${videoIdMatch[1]}/maxresdefault.jpg`;
        }
      }

      const imageFiles = p['첨부이미지']?.files || [];
      const images = imageFiles.map(file => file?.file?.url || file?.external?.url || '').filter(url => url !== '');

      return {
        id: page.id,
        title,
        category,
        thumbnail,
        content,
        author,
        date,
        videoUrl,
        order,
        isNotice,
        images
      };
    });

    return news;

  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}
