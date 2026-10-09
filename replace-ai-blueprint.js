const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Add state
code = code.replace(
  'const [agentMessage, setAgentMessage] = useState<string | null>(null);',
  'const [agentMessage, setAgentMessage] = useState<string | null>(null);\n  const [aiBlueprint, setAiBlueprint] = useState<any>(null);'
);

// 2. Clear state in handleAnalyze
code = code.replace(
  'setAgentMessage(null);',
  'setAgentMessage(null);\n    setAiBlueprint(null);'
);

// 3. Update the LLM Agent fetch
code = code.replace(
  '.then(agentData => setAgentMessage(agentData.response))',
  '.then(agentData => {\n        setAgentMessage(agentData.chatSummary);\n        setAiBlueprint(agentData.blueprint);\n      })'
);

// 4. Inject aiBlueprint conditionally into the sections
// I will wrap the content of each tab in `{!aiBlueprint ? <Loading/> : <> ... </>}`
const loadingSpinner = `
                      {!aiBlueprint ? (
                        <div className="text-center py-24 text-slate-500 font-mono animate-pulse flex flex-col items-center">
                          <Bot className="h-10 w-10 mb-4 opacity-50" />
                          OMNISIGHT AI is analyzing live SerpApi Data...
                        </div>
                      ) : (
                        <>`;

// Executive Tab
code = code.replace(
  '{blueprintTab === \'executive\' && (\n                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-16 pb-16">\n                    {/* Section 1:',
  '{blueprintTab === \'executive\' && (\n                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-16 pb-16">\n' + loadingSpinner + '\n                    {/* Section 1:'
);

code = code.replace(
  'What is this opportunity?\n                      </h2>',
  '{aiBlueprint.opportunityTitle}\n                      </h2>'
);

code = code.replace(
  'Reduces risk by exploiting the pricing gap between',
  '{aiBlueprint.opportunityText}</p><p className="hidden">'
);

code = code.replace(
  'We monitor negative press globally to ensure the <strong>{query}</strong> trend isn\\\'t a short-lived fad.',
  '{aiBlueprint.problemText}'
);

code = code.replace(
  'Heavy volume doesn\\\'t always mean high competition.',
  '{aiBlueprint.solutionText}</p><p className="hidden">'
);

// Close Executive tab wrap
code = code.replace(
  '                          </ul>\n                        </div>\n                      </div>\n                    </div>\n                      </div>\n                    )}',
  '                          </ul>\n                        </div>\n                      </div>\n                    </div>\n                        </>\n                      )}\n                      </div>\n                    )}'
);

// Market Tab
code = code.replace(
  '{blueprintTab === \'market\' && (\n                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-16 pb-16">\n                    {/* Section 4:',
  '{blueprintTab === \'market\' && (\n                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-16 pb-16">\n' + loadingSpinner + '\n                    {/* Section 4:'
);

code = code.replace(
  '<li>• <strong>{query.toUpperCase()}</strong> shows search trend stability.</li>\n                             <li>• Wide retail price variance (${minPrice.toFixed(2)} to ${maxPrice.toFixed(2)}) allows markup flexibility.</li>',
  '{aiBlueprint.goingWell.map((txt: string, i: number) => <li key={i}>• {txt}</li>)}'
);

code = code.replace(
  '<li>• Heavy saturation on generic <strong>{query}</strong> keywords.</li>\n                             <li>• {results.seoData?.searches?.length || 5} related search clusters dominate the ad space.</li>',
  '{aiBlueprint.needsAttention.map((txt: string, i: number) => <li key={i}>• {txt}</li>)}'
);

code = code.replace(
  '<li>• Consumers are actively asking <em>"{results.seoData?.questions?.[0]?.question || query}"</em>.</li>\n                             <li>• Legacy brands are ignoring these long-tail intent queries.</li>',
  '{aiBlueprint.theWhy.map((txt: string, i: number) => <li key={i}>• {txt}</li>)}'
);

code = code.replace(
  'Target the exact question: <em>"{results.seoData?.questions?.[0]?.question || \'How to buy?\'}"</em> in your ad copy to reduce Customer Acquisition Cost (CAC) by 40%.',
  '{aiBlueprint.recommendation}'
);

// Close Market tab wrap
code = code.replace(
  'View detailed analysis →</button>\n                      </div>\n                    </div>\n                      </div>\n                    )}',
  'View detailed analysis →</button>\n                      </div>\n                    </div>\n                        </>\n                      )}\n                      </div>\n                    )}'
);

// Roadmap Tab
code = code.replace(
  '{blueprintTab === \'roadmap\' && (\n                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-16 pb-16">\n                    {/* Section 3:',
  '{blueprintTab === \'roadmap\' && (\n                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-16 pb-16">\n' + loadingSpinner + '\n                    {/* Section 3:'
);

code = code.replace(
  '<li>• Setup B2B Supplier agreements for <strong>{query}</strong>.</li>\n                              <li>• Launch MVP landing page.</li>',
  '{aiBlueprint.phase1.map((txt: string, i: number) => <li key={i}>• {txt}</li>)}'
);

code = code.replace(
  '<li>• Execute targeted SEO strategy.</li>\n                              <li>• Ship 10 units to creators reviewing <strong>{query}</strong>.</li>',
  '{aiBlueprint.phase2.map((txt: string, i: number) => <li key={i}>• {txt}</li>)}'
);

code = code.replace(
  '<li>• Scale <strong>{query}</strong> to 300 units/mo.</li>\n                              <li>• Hit ${((minPrice - estWholesalePrice) * 300).toLocaleString()} profit target.</li>',
  '{aiBlueprint.phase3.map((txt: string, i: number) => <li key={i}>• {txt}</li>)}'
);

// Close Roadmap tab wrap
code = code.replace(
  '                          </div>\n                        </div>\n\n                      </div>\n                    </div>\n                    </div>\n\n                  </div>',
  '                          </div>\n                        </div>\n\n                      </div>\n                    </div>\n                        </>\n                      )}\n                    </div>\n\n                  </div>'
);

fs.writeFileSync('src/app/page.tsx', code);
console.log("AI integration complete");
