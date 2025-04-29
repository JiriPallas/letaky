const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Použijte POST' }),
    };
  }

  try {
    const uploads = JSON.parse(event.body);

    const repo = "JiriPallas/letaky";  // Justera om du ändrat repo
    const path = "data/data.json";      // Eller "data/www.json" vid www-export
    const branch = "main";
    const githubToken = process.env.GITHUB_TOKEN;

    const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;

    // Hämta befintligt SHA
    const getResponse = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github.v3+json"
      }
    });

    let sha = null;
    if (getResponse.ok) {
      const json = await getResponse.json();
      sha = json.sha;
    }

    // Spara ny version
    const putResponse = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Automatický export dat z adminu",
        content: Buffer.from(JSON.stringify(uploads, null, 2)).toString('base64'),
        branch,
        sha
      })
    });

    if (putResponse.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Data uložena na GitHub! ' }),
      };
    } else {
      const errorText = await putResponse.text();
      return {
        statusCode: 500,
        body: JSON.stringify({ error: errorText }),
      };
    }
  } catch (err) {
    console.error("Server error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Serverová chyba při zpracování dat.' }),
    };
  }
};
