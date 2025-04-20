// netlify/functions/export.js
export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Použijte POST' });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const repo = "JiriPallas/letaky";
  const path = "data/data.json";
  const branch = "main";
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;
  const data = req.body;

  const newContent = Buffer.from(JSON.stringify(data)).toString('base64');

  const current = await fetch(apiUrl, {
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
  });

  let sha = null;
  if (current.ok) {
    const json = await current.json();
    sha = json.sha;
  }

  const upload = await fetch(apiUrl, {
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

  if (upload.ok) {
    return res.status(200).json({ message: "Export OK" });
  } else {
    const error = await upload.json();
    return res.status(500).json({ error: error.message });
  }
};
