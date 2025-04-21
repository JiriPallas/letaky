async function exportDataToGitHub() {
  console.log("🚀 exportDataToGitHub() körs");

  const data = JSON.parse(localStorage.getItem('adminUploads') || '[]');
  console.log("📦 Data som skickas:", data);

  try {
    const res = await fetch('/.netlify/functions/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const resultText = await res.text();
    console.log("📬 Svar från export-funktion:", resultText);

    let result;
    try {
      result = JSON.parse(resultText);
    } catch (e) {
      console.warn("Kunde inte tolka svaret som JSON:", resultText);
      alert("Chyba při exportu (format): " + resultText);
      return;
    }

    if (res.ok) {
      alert("✅ Data úspěšně exportována do GitHubu přes Netlify!");
    } else {
      alert("❌ Chyba při exportu : " + (result.error || "Neznámá chyba"));
    }
  } catch (error) {
    console.error("❗ Fetch-fel:", error);
    alert("❗ Došlo k chybě při komunikaci se serverem");
  }
}
