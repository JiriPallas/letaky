const { Buffer } = require('buffer');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Použijte POST' }) };
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const repo = "JiriPallas/letaky";
  const branch = "main";
  const body = JSON.parse(event.body);
  const content = Buffer.from(JSON.stringify(body.uploads)).toString('base64');

  let path;
  if (body.type === 'data') {
    path = "data/data.json";    // Sparar riktiga datan
  } else {
    return { statusCode: 400, body: JSON.stringify({ error: 'Neplatný typ souboru' }) };
  }

  const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;

  try {
    const getFile = await fetch(apiUrl, { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } });
    const fileData = getFile.ok ? await getFile.json() : null;
    const sha = fileData ? fileData.sha : undefined;

    const res = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Uprava dat (data.json)",
        content,
        branch,
        sha
      })
    });

    if (!res.ok) {
      const error = await res.json();
      console.error('GitHub API Error:', error);
      return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }

    return { statusCode: 200, body: JSON.stringify({ message: "Data byla uložena!" }) };
  } catch (err) {
    console.error('General Error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
