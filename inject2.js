const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Add state and fetch logic
code = code.replace(
  'const [blueprintTab, setBlueprintTab] = useState("executive");',
  'const [blueprintTab, setBlueprintTab] = useState("executive");\n  const [blueprintData, setBlueprintData] = useState<any>(null);\n  const [blueprintLoading, setBlueprintLoading] = useState(false);'
);

code = code.replace(
  'setAgentMessage(null);\n    setSelectedSeoNode(null);',
  'setAgentMessage(null);\n    setSelectedSeoNode(null);\n    setBlueprintData(null);'
);

code = code.replace(
  '.catch(err => console.error("Agent Engine Offline"));',
  `.catch(err => console.error("Agent Engine Offline"));\n\n      // Full Blueprint Generator
      setBlueprintLoading(true);
      fetch("/api/blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, serpData: data }),
      })
      .then(res => res.json())
      .then(bpData => {
         if (!bpData.error) setBlueprintData(bpData);
      })
      .catch(err => console.error("Blueprint Error"))
      .finally(() => setBlueprintLoading(false));`
);

// 2. Wrap content with blueprintData check
const heroEnd = `                      </div>
                    </div>`;
const navStart = `                    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-8 mb-12 mt-12 border-b border-white/10 pb-px">`;

code = code.replace(
  heroEnd + '\n\n' + navStart,
  heroEnd + `\n\n                    {blueprintLoading ? (
                      <div className="flex flex-col items-center justify-center py-32 space-y-6">
                        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                        <p className="text-blue-400 font-mono text-sm animate-pulse">🧠 OMNISIGHT AI is synthesizing your custom market blueprint...</p>
                      </div>
                    ) : blueprintData ? (
                      <>\n` + navStart
);

// Close the wrapper
code = code.replace(
  '                      </div>\n                    </div>\n\n                  </div>\n                </div>',
  '                      </div>\n                    </div>\n                    </>\n                    ) : null}\n\n                  </div>\n                </div>'
);

// 3. Remove badges & view detailed analysis button
code = code.replace(
  /<div className="flex justify-center gap-4 mt-8">[\s\S]*?<\/div>/,
  ''
);

code = code.replace(
  /<button onClick=\{\(\) => setActiveModal\('analysis'\)\} className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors whitespace-nowrap">View detailed analysis →<\/button>/,
  ''
);

// 4. Inject actual JSON data references
code = code.replace(
  'A 65% wholesale arbitrage margin allows for rapid scaling and low CAC.',
  '{blueprintData.executiveSummary?.opportunity || "Market gap found."}'
);
code = code.replace(
  /<li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2"><\/div> Manual competitor pricing research for <strong>{query}<\/strong> takes days.<\/li>/,
  '<li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2"></div> {blueprintData.executiveSummary?.problem}</li>'
);
code = code.replace(
  /<li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2"><\/div> High advertising rejection rates due to saturated generic keywords.<\/li>/,
  ''
);
code = code.replace(
  /<li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2"><\/div> You don't know the actual wholesale floor beneath the \${minPrice.toFixed\(2\)} retail minimum.<\/li>/,
  ''
);
code = code.replace(
  /<li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0" \/> AI maps exactly to the right B2B Suppliers for <strong>{query}<\/strong> instantly.<\/li>[\s\S]*?<\/ul>/,
  `{blueprintData.executiveSummary?.solutions?.map((sol: string, i: number) => (
                              <li key={i} className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0" /> {sol}</li>
                            ))}
                          </ul>`
);

code = code.replace(
  /<li>• <strong>{query.toUpperCase\(\)}<\/strong> shows search trend stability.<\/li>[\s\S]*?<\/ul>/,
  `{blueprintData.marketAnalysis?.goingWell?.map((p: string, i: number) => (
                             <li key={i}>• {p}</li>
                           ))}
                           </ul>`
);
code = code.replace(
  /<li>• Heavy saturation on generic <strong>{query}<\/strong> keywords.<\/li>[\s\S]*?<\/ul>/,
  `{blueprintData.marketAnalysis?.needsAttention?.map((p: string, i: number) => (
                             <li key={i}>• {p}</li>
                           ))}
                           </ul>`
);
code = code.replace(
  /<li>• Consumers are actively asking <em>"\{results.seoData\?\.questions\?\.\[0\]\?\.question \|\| query\}"<\/em>.<\/li>[\s\S]*?<\/ul>/,
  `{blueprintData.marketAnalysis?.theWhy?.map((p: string, i: number) => (
                             <li key={i}>• {p}</li>
                           ))}
                           </ul>`
);
code = code.replace(
  /<p className="text-blue-100 text-sm">Target the exact question: <em>"\{results.seoData\?\.questions\?\.\[0\]\?\.question \|\| 'How to buy\?'\}"<\/em> in your ad copy to reduce Customer Acquisition Cost \(CAC\) by 40%.<\/p>/,
  `<p className="text-blue-100 text-sm">{blueprintData.marketAnalysis?.aiRecommendation}</p>`
);

code = code.replace(
  /<li>• Setup B2B Supplier agreements for <strong>{query}<\/strong>.<\/li>[\s\S]*?<\/ul>/,
  `{blueprintData.roadmap?.now?.map((p: string, i: number) => (
                              <li key={i}>• {p}</li>
                            ))}
                            </ul>`
);
code = code.replace(
  /<li>• Execute targeted SEO strategy.<\/li>[\s\S]*?<\/ul>/,
  `{blueprintData.roadmap?.next?.map((p: string, i: number) => (
                              <li key={i}>• {p}</li>
                            ))}
                            </ul>`
);
code = code.replace(
  /<li>• Scale <strong>{query}<\/strong> to 300 units\/mo.<\/li>[\s\S]*?<\/ul>/,
  `{blueprintData.roadmap?.later?.map((p: string, i: number) => (
                              <li key={i}>• {p}</li>
                            ))}
                            </ul>`
);

fs.writeFileSync('src/app/page.tsx', code);
console.log("Successfully injected AI blueprint integration!");
