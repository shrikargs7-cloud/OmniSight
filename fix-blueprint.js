const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Remove blueprintData state
code = code.replace(
  '  const [blueprintData, setBlueprintData] = useState<any>(null);\n',
  ''
);

// 2. Remove setBlueprintData(null)
code = code.replace(
  '    setBlueprintData(null);\n',
  ''
);

// 3. Remove setAiBlueprint(agentData.blueprint) from /api/agent
code = code.replace(
  '        setAgentMessage(agentData.chatSummary);\n        setAiBlueprint(agentData.blueprint);\n',
  '        setAgentMessage(agentData.response || agentData.chatSummary);\n'
);

// 4. Change setBlueprintData to setAiBlueprint in /api/blueprint
code = code.replace(
  '         if (!bpData.error) setBlueprintData(bpData);\n',
  '         if (!bpData.error) setAiBlueprint(bpData);\n'
);

fs.writeFileSync('src/app/page.tsx', code);
console.log("Fixed page.tsx states!");
