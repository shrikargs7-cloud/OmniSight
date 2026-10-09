const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Add state
code = code.replace(
  'const [agentMessage, setAgentMessage] = useState<string | null>(null);',
  'const [agentMessage, setAgentMessage] = useState<string | null>(null);\n  const [blueprintTab, setBlueprintTab] = useState("executive");'
);

// 2. Add Tab buttons right before Section 1
const tabButtons = `
                    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-8 mb-12 mt-12 border-b border-slate-200 pb-px">
                      <button 
                        onClick={() => setBlueprintTab('executive')}
                        className={\`px-2 py-4 font-bold text-sm transition-all border-b-2 \${blueprintTab === 'executive' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}\`}
                      >
                        Executive Summary
                      </button>
                      <button 
                        onClick={() => setBlueprintTab('market')}
                        className={\`px-2 py-4 font-bold text-sm transition-all border-b-2 \${blueprintTab === 'market' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}\`}
                      >
                        Market Gap Analysis
                      </button>
                      <button 
                        onClick={() => setBlueprintTab('roadmap')}
                        className={\`px-2 py-4 font-bold text-sm transition-all border-b-2 \${blueprintTab === 'roadmap' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}\`}
                      >
                        Visual Roadmap
                      </button>
                    </div>
`;

code = code.replace(
  '<hr className="my-16 border-slate-200" />\n\n                    {/* Section 1',
  tabButtons + '\n                    {/* Section 1'
);

// 3. Remove all <hr> tags in this block since we are paginating
code = code.replace(/<hr className="my-16 border-slate-200" \/>/g, '');

// 4. Wrap sections in conditional classes
// Section 1 and 2:
code = code.replace('{/* Section 1: The Opportunity */}', '<div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-16 ${blueprintTab === "executive" ? "block" : "hidden"}`}>\n                    {/* Section 1: The Opportunity */}');
code = code.replace('{/* Section 3: How It Works */}', '</div>\n\n                    <div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-16 ${blueprintTab === "roadmap" ? "block" : "hidden"}`}>\n                    {/* Section 3: How It Works */}');
code = code.replace('{/* Section 4: Market & Insights */}', '</div>\n\n                    <div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-16 ${blueprintTab === "market" ? "block" : "hidden"}`}>\n                    {/* Section 4: Market & Insights */}');
code = code.replace('{/* Section 6: Roadmap */}', '</div>\n\n                    <div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-16 ${blueprintTab === "roadmap" ? "block" : "hidden"}`}>\n                    {/* Section 6: Roadmap */}');

// Close the final div for section 6.
// Section 6 ends before:
//                  </div>
//                </div>
//              )}
// So we replace:
//                      </div>
//                    </div>
//
//                  </div>
//                </div>

code = code.replace(
  '                      </div>\n                    </div>\n\n                  </div>\n                </div>',
  '                      </div>\n                    </div>\n                    </div>\n\n                  </div>\n                </div>'
);

fs.writeFileSync('src/app/page.tsx', code);
console.log("Done");
