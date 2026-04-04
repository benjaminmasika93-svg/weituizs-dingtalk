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

  // Field IDs for 微推文章 table
  const cells = {
    'MsO9hJU': title,                          // 文章标题 (text)
    'csOFXdL': mp,                              // 公众号 (text)
    'HtD5oKd': time ? String(time).substring(0, 10) : '', // 发布时间 (date, YYYY-MM-DD)
    'sLXflGM': cover ? [{ url: cover }] : [],  // 封面图片 (attachment)
    'qfKmFJ0': String(copyright) === '1'        // 是否原创 (singleSelect)
      ? { id: 'XaWTvhLDnZ', name: '原创' }
      : { id: 'd6f5TFkmfB', name: '非原创' },
    'hSJBHr0': desc || '',                      // 摘要 (text)
    'iB60SfK': author || '',                     // 作者 (text)
    'E06P9Fn': link || ''                        // 原文链接 (url)
  };

  // Write record to DingTalk AI table
  try {
    const rowRes = await fetch(`https://api.dingtalk.com/v1.0/notable/bases/${baseId}/sheets/${tableId}/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-acs-dingtalk-access-token': accessToken
      },
      body: JSON.stringify({
        operatorId,
        records: [{ cells }]
      })
    });
    const rowData = await rowRes.json();
    return res.status(200).json({ ok: true, data: rowData });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
