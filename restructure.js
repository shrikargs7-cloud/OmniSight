const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

content = content.replace(
  '<hr className="my-16 border-slate-200" />',
  `{/* NEW TAB NAVIGATION */}
                    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-8 mb-12 border-b border-slate-200 pb-px">
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

                    {/* WRAPPING EXECUTIVE SUMMARY */}
                    {blueprintTab === 'executive' && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-16 pb-16">`
);

const s1Start = content.indexOf('{/* Section 1: The Opportunity */}');
const s2Start = content.indexOf('{/* Section 2: Problem -> Solution */}');
const s3Start = content.indexOf('{/* Section 3: How It Works */}');
const s4Start = content.indexOf('{/* Section 4: Market & Customer Insights */}');
const s5Start = content.indexOf('{/* Section 5: AI-Generated Insights */}');
const s6Start = content.indexOf('{/* Section 6: Growth Roadmap */}');

const section1 = content.substring(s1Start, content.indexOf('<hr className="my-16 border-slate-200" />', s1Start));
const section2 = content.substring(s2Start, content.indexOf('<hr className="my-16 border-slate-200" />', s2Start));
const section3 = content.substring(s3Start, content.indexOf('<hr className="my-16 border-slate-200" />', s3Start));
const section4 = content.substring(s4Start, content.indexOf('<hr className="my-16 border-slate-200" />', s4Start));
const section5 = content.substring(s5Start, content.indexOf('<hr className="my-16 border-slate-200" />', s5Start));
const section6 = content.substring(s6Start, content.indexOf('</div>\n                    </div>\n\n                  </div>', s6Start));

const prefix = content.substring(0, content.indexOf('{/* WRAPPING EXECUTIVE SUMMARY */}'));

const newContent = prefix + `{/* WRAPPING EXECUTIVE SUMMARY */}
                    {blueprintTab === 'executive' && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-16 pb-16">
                        ` + section1 + section2 + `
                      </div>
                    )}

                    {/* WRAPPING MARKET INTELLIGENCE */}
                    {blueprintTab === 'market' && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-16 pb-16">
                        ` + section4 + section5 + `
                      </div>
                    )}

                    {/* WRAPPING ROADMAP */}
                    {blueprintTab === 'roadmap' && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-16 pb-16">
                        ` + section3 + section6 + `
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}
        </main>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/app/page.tsx', newContent);
console.log("Successfully refactored Blueprint Tabs!");
