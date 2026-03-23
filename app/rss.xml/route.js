import { getNews } from '@/lib/notion';

export const runtime = 'edge';
export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const newsItems = await getNews();
    const baseUrl = 'https://mungmin.com';

    const rssItems = newsItems.map((item) => {
      const itemUrl = `${baseUrl}/news/${item.id}`;
      // Format date for RSS (RFC 822)
      const pubDate = new Date(item.date.replace(/\./g, '-')).toUTCString();
      
      return `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${itemUrl}</link>
      <guid isPermaLink="false">${item.id}</guid>
      <pubDate>${pubDate}</pubDate>
      <author><![CDATA[${item.author}]]></author>
      <category><![CDATA[${item.category}]]></category>
      <description><![CDATA[${item.content?.substring(0, 200)}...]]></description>
    </item>`;
    }).join('');

    const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>멍냥의민족 - 소식</title>
    <link>${baseUrl}</link>
    <description>국내 최초 O2O 리워드 반려동물 용품 플랫폼, 멍냥의민족의 최신 소식을 전해드립니다.</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

    return new Response(rssFeed, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
      },
    });
  } catch (error) {
    console.error('RSS Generation Error:', error);
    return new Response('Error generating RSS feed', { status: 500 });
  }
}
