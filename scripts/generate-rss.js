const fs = require('fs');
const path = require('path');

// Manually parse .env.local
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envLines = fs.readFileSync(envPath, 'utf8').split('\n');
    envLines.forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      }
    });
  }
}

loadEnv();

async function generateRSS() {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_NEWS_DATABASE_ID;

  if (!apiKey || !databaseId) {
    console.error('Missing Notion API Key or Database ID');
    return;
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filter: {
          property: '게시여부',
          select: { equals: '게시' }
        },
        sorts: [{ property: '게시물번호', direction: 'descending' }]
      })
    });

    if (!response.ok) {
      throw new Error(`Notion API returned ${response.status}`);
    }

    const data = await response.json();
    const newsItems = data.results.map(page => {
      const p = page.properties;
      return {
        id: page.id,
        title: p['제목']?.title?.[0]?.plain_text || '제목 없음',
        date: p['날짜']?.date?.start || page.created_time.split('T')[0],
        author: p['작성자']?.rich_text?.[0]?.plain_text || '멍냥의민족',
        category: p['카테고리']?.select?.name || '기타',
        content: p['게시물 내용']?.rich_text?.[0]?.plain_text || ''
      };
    });

    const baseUrl = 'https://www.mungmin.com';

    // RFC 822 date formatter for Naver compliance
    function tragediesDate(dateString) { // Fixed typo in function call from previous version
        return toRFC822(dateString);
    }

    function toRFC822(dateString) {
      const date = dateString ? new Date(dateString.replace(/\./g, '-')) : new Date();
      if (isNaN(date.getTime())) return new Date().toUTCString();
      
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      const dayName = days[date.getUTCDay()];
      const day = String(date.getUTCDate()).padStart(2, '0');
      const monthName = months[date.getUTCMonth()];
      const year = date.getUTCFullYear();
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      const seconds = String(date.getUTCSeconds()).padStart(2, '0');
      
      return `${dayName}, ${day} ${monthName} ${year} ${hours}:${minutes}:${seconds} +0000`;
    }

    const rssItems = newsItems.map((item) => {
      const itemUrl = `${baseUrl}/news/${item.id}`;
      const pubDate = toRFC822(item.date); // Use the formatter
      
      return `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${itemUrl}</link>
      <guid isPermaLink="true">${itemUrl}</guid>
      <pubDate>${toRFC822(item.date)}</pubDate>
      <author><![CDATA[${item.author}]]></author>
      <category><![CDATA[${item.category}]]></category>
      <description><![CDATA[${item.content || item.title}]]></description>
    </item>`;
    }).join('');

    const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[멍냥의민족 - 소식]]></title>
    <link>${baseUrl}</link>
    <description><![CDATA[국내 최초 O2O 리워드 반려동물 용품 플랫폼, 멍냥의민족의 최신 소식을 전해드립니다.]]></description>
    <language>ko</language>
    <lastBuildDate>${toRFC822(new Date().toISOString())}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

    fs.writeFileSync(path.join(process.cwd(), 'public', 'rss.xml'), rssFeed, 'utf8');
    console.log('Successfully generated public/rss.xml');

  } catch (error) {
    console.error('Error generating RSS:', error);
  }
}

generateRSS();
