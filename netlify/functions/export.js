const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Použijte POST' })
    };
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const repo = "JiriPallas/letaky";

  const body = JSON.parse(event.body);
  const uploads = body.uploads || [];
  let path = "data/data.json";

  if (body.type === "www") {
    path = "data/www.json";
  }

  const branch = "main";
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;
  const newContent = Buffer.from(JSON.stringify(uploads)).toString('base64');

  try {
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
        message: "Automatická aktualizace přes Netlify",
        content: newContent,
        branch,
        sha
      })
    });

    if (response.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Export byl úspěšný!" })
      };
    } else {
      const error = await response.text();
      console.error("GitHub API chyba:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error || 'Neznámá chyba' })
      };
    }
  } catch (error) {
    console.error("Chyba funkce:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Neznámá chyba' })
    };
  }
}
