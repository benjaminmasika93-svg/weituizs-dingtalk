const MCP_GATEWAY = 'https://mcp-gw.dingtalk.com/server/bbe14f15cd8ec54e5ad58daf7729c8c9844786f8e84adada5d50e733e110d7be';
const MCP_KEY = 'c35959c897ed52bf47b656a73d63aaa5';

async function mcpCall(toolName, arguments_) {
  const res = await fetch(`${MCP_GATEWAY}?key=${MCP_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: { name: toolName, arguments: arguments_ }
    })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { title = '', mp = '', time = '', cover = '', copyright = '', desc = '', author = '', link = '' } = req.body || {};

  if (!title || !mp) {
    return res.status(400).json({ error: 'title and mp are required' });
  }

  const baseId = '14lgGw3P8vvEgQARTQokRgZ985daZ90D';
  const tableId = 'wDcqpEX';

  const cells = {
    'MsO9hJU': title,
    'csOFXdL': mp,
    'HtD5oKd': time ? String(time).substring(0, 10) : '',
    'qfKmFJ0': String(copyright) === '1'
      ? { id: 'XaWTvhLDnZ', name: '原创' }
      : { id: 'd6f5TFkmfB', name: '非原创' },
    'hSJBHr0': desc || '',
    'iB60SfK': author || '',
    'E06P9Fn': link ? { text: link, link: link } : '',
    'sLXflGM': cover ? [{ url: cover }] : []
  };

  try {
    const result = await mcpCall('create_records', {
      baseId,
      tableId,
      records: [{ cells }]
    });
    return res.status(200).json({ ok: true, data: result });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
}
