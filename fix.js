const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Remove the broken closing tags
code = code.replace(
  '                    </div>\n                    </>\n                    ) : null}',
  '                    </div>'
);

// 2. Put the condition right after the Hero section closing div
const heroEnd = '                      </div>\n\n                    \n                    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-8 mb-12 mt-12 border-b border-white/10 pb-px">';

code = code.replace(
  heroEnd,
  `                      </div>
                    
                    {blueprintLoading ? (
                      <div className="flex flex-col items-center justify-center py-32 space-y-6">
                        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                        <p className="text-blue-400 font-mono text-sm animate-pulse">🧠 OMNISIGHT AI is synthesizing your custom market blueprint...</p>
                      </div>
                    ) : blueprintData ? (
                      <>
                    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-8 mb-12 mt-12 border-b border-white/10 pb-px">`
);

// Now re-add the closing tags at the very end.
code = code.replace(
  '                      </div>\n                    </div>\n\n                  </div>\n                </div>',
  '                      </div>\n                    </div>\n                    </>\n                    ) : null}\n\n                  </div>\n                </div>'
);

fs.writeFileSync('src/app/page.tsx', code);
console.log("Fixed!");
