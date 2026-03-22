export const runtime = 'edge';

export default async function TestEnvPage() {
  let envInfo = {};
  
  envInfo.processEnvKeys = Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('KEY'));
  envInfo.hasNotionKeyInProcess = !!process.env.NOTION_API_KEY;

  let fetchTest = 'Not started';
  try {
    const res = await fetch('https://api.notion.com/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_API_KEY || 'missing'}`,
        'Notion-Version': '2022-06-28'
      }
    });
    fetchTest = `Status: ${res.status}`;
  } catch (e) {
    fetchTest = `Error: ${e.message}`;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
      <h1>Cloudflare Environment Test (Simplified)</h1>
      <pre>{JSON.stringify(envInfo, null, 2)}</pre>
      <h2>Fetch Test (Notion /users/me)</h2>
      <p>{fetchTest}</p>
    </div>
  );
}
