const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

code = code.replace(
  '{blueprintData.executiveSummary?.problem}',
  '{aiBlueprint.problemText}'
);

code = code.replace(
  /\{blueprintData\.executiveSummary\?\.solutions\?\.map\(\(sol: string, i: number\) => \([\s\S]*?<li key=\{i\} className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0" \/> \{sol\}<\/li>\n[\s\S]*?\)\)\}/,
  '{aiBlueprint.solutionText}'
);

fs.writeFileSync('src/app/page.tsx', code);
console.log("Fixed leftover blueprintData!");
