const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Použijte POST' })
    };
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const repo = 'JiriPallas/letaky';
  const path = 'data/data.json';
  const branch = 'main';
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;

  try {
    const body = JSON.parse(event.body);

    const newContent = Buffer.from(JSON.stringify({ uploads: body.uploads }, null, 2)).toString('base64');

    const current = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
    });

    let sha = null;
    if (current.ok) {
      const currentData = await current.json();
      sha = currentData.sha;
    }

    const res = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: "Aktualizace dat z adminu",
        content: newContent,
        branch,
        sha
      })
    });

    if (res.ok) {
      return { statusCode: 200, body: JSON.stringify({ message: "Export úspěšný" }) };
    } else {
      const error = await res.text();
      return { statusCode: 500, body: JSON.stringify({ error }) };
    }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
