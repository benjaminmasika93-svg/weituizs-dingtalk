export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const {
    title = '',
    mp = '',
    time = '',
    cover = '',
    copyright = '',
    desc = '',
    author = '',
    link = ''
  } = req.body || {};

  if (!title || !mp) {
    return res.status(400).json({ error: 'title and mp are required' });
  }

  const appKey = process.env.DINGTALK_APP_KEY;
  const appSecret = process.env.DINGTALK_APP_SECRET;
  const baseId = process.env.DINGTALK_BASE_ID;
  const tableId = process.env.DINGTALK_TABLE_ID;
  const operatorId = process.env.DINGTALK_OPERATOR_ID;

  // Get access token
  let accessToken;
  try {
    const tokenRes = await fetch('https://api.dingtalk.com/v1.0/oauth2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appKey, appSecret })
    });
    const tokenData = await tokenRes.json();
    accessToken = tokenData.accessToken;
    if (!accessToken) throw new Error('No access token');
  } catch (e) {
    return res.status(500).json({ error: 'Failed to get access token' });
  }

  const copyrightMap = { '1': '原创', '0': '非原创' };
  const copyrightText = copyrightMap[String(copyright)] || (copyright === 1 ? '原创' : '非原创');

  // Write row to DingTalk AI table
  try {
    const rowRes = await fetch(`https://api.dingtalk.com/v1.0/notable/bases/${baseId}/sheets/${tableId}/rows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-acs-dingtalk-access-token': accessToken
      },
      body: JSON.stringify({
        operatorId,
        rows: [{
          cells: {
            '文章标题': { text: title },
            '公众号': { text: mp },
            '发布时间': { date: time },
            '封面图片': { text: cover },
            '是否原创': { text: copyrightText },
            '摘要': { text: desc || '' },
            '作者': { text: author || '' },
            '原文链接': { text: link || '' }
          }
        }]
      })
    });
    const rowData = await rowRes.json();
    return res.status(200).json({ ok: true, data: rowData });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
