const apiKey = process.env.GEMINI_API_KEY;
const prompt = "Reply with just JSON: {\"test\": true}";
fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
})
.then(res => res.json())
.then(data => console.log(JSON.stringify(data, null, 2)));
