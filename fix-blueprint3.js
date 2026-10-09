const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

code = code.replace(
  '                            {aiBlueprint.solutionText}',
  '                            <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0" /> {aiBlueprint.solutionText}</li>'
);

fs.writeFileSync('src/app/page.tsx', code);
