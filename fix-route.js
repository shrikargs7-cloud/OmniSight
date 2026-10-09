const fs = require('fs');
let code = fs.readFileSync('src/app/api/blueprint/route.ts', 'utf8');

code = code.replace(
  'const parsedJson = JSON.parse(text);',
  `if (!text) throw new Error("Gemini returned empty response. API Key might be invalid: " + JSON.stringify(geminiData));
    const parsedJson = JSON.parse(text);`
);

fs.writeFileSync('src/app/api/blueprint/route.ts', code);
