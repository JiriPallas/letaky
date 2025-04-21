const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

export default async function handler(event, context) {
  console.log("▶️ Kör Netlify function: export");

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Použijte POST' })
    };
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const repo = "JiriPallas/letaky";
  const path = "data/data.json";
  const branch = "main";
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;
  const data = JSON.parse(event.body);

  const newContent = Buffer.from(JSON.stringify(data)).toString('base64');

  const current = await fetch(apiUrl, {
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
  });

  let sha = null;
  if (current.ok) {
    const currentData = await current.json();
    sha = currentData.sha;
  }

  const response = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "Export via Netlify Function",
      content: newContent,
      branch,
      sha
    })
  });

  if (response.ok) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Export OK" })
    };
  } else {
    const error = await response.text();
    console.error("GitHub API-fel:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error || 'Neznámá chyba' })
    };
  }
}
