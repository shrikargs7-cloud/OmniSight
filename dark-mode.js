const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

const blueprintStart = code.indexOf('{activeTab === "blueprint" && (');
const blueprintEnd = code.indexOf('</main>', blueprintStart);

if (blueprintStart === -1 || blueprintEnd === -1) {
    console.error("Could not find blueprint section");
    process.exit(1);
}

let prefix = code.substring(0, blueprintStart);
let suffix = code.substring(blueprintEnd);
let blueprint = code.substring(blueprintStart, blueprintEnd);

// Conversions
blueprint = blueprint.replace(/bg-slate-50 text-slate-900/g, 'bg-[#0a0a0a] text-slate-200');
blueprint = blueprint.replace(/text-slate-900/g, 'text-white');
blueprint = blueprint.replace(/border-slate-200/g, 'border-white/10');
blueprint = blueprint.replace(/bg-white/g, 'bg-[#121212]');
blueprint = blueprint.replace(/bg-\[\#121212\]\/5/g, 'bg-white/5'); // fix accidental replacements
blueprint = blueprint.replace(/text-slate-700/g, 'text-slate-300');
blueprint = blueprint.replace(/text-slate-600/g, 'text-slate-400');
blueprint = blueprint.replace(/text-slate-500/g, 'text-slate-400');
blueprint = blueprint.replace(/hover:text-slate-800/g, 'hover:text-slate-200');

// Tabs
blueprint = blueprint.replace(/border-blue-600 text-blue-600/g, 'border-blue-500 text-blue-400');

// Cards & Badges
blueprint = blueprint.replace(/bg-blue-50/g, 'bg-blue-500/20');
blueprint = blueprint.replace(/text-blue-600/g, 'text-blue-400');
blueprint = blueprint.replace(/bg-[#121212] text-blue-400/g, 'bg-[#121212] text-blue-400'); 

// AI Insights Cards
blueprint = blueprint.replace(/bg-emerald-50\/50/g, 'bg-emerald-500/10');
blueprint = blueprint.replace(/border-emerald-100/g, 'border-emerald-500/20');
blueprint = blueprint.replace(/bg-emerald-100/g, 'bg-emerald-500/20');
blueprint = blueprint.replace(/text-emerald-800/g, 'text-emerald-400');
blueprint = blueprint.replace(/text-emerald-700\/80/g, 'text-emerald-300/80');

blueprint = blueprint.replace(/bg-amber-50\/50/g, 'bg-amber-500/10');
blueprint = blueprint.replace(/border-amber-100/g, 'border-amber-500/20');
blueprint = blueprint.replace(/bg-amber-100/g, 'bg-amber-500/20');
blueprint = blueprint.replace(/text-amber-800/g, 'text-amber-400');
blueprint = blueprint.replace(/text-amber-700\/80/g, 'text-amber-300/80');

blueprint = blueprint.replace(/bg-purple-50\/50/g, 'bg-purple-500/10');
blueprint = blueprint.replace(/border-purple-100/g, 'border-purple-500/20');
blueprint = blueprint.replace(/bg-purple-100/g, 'bg-purple-500/20');
blueprint = blueprint.replace(/text-purple-800/g, 'text-purple-400');
blueprint = blueprint.replace(/text-purple-700\/80/g, 'text-purple-300/80');

// Section numbers
blueprint = blueprint.replace(/bg-slate-800/g, 'bg-purple-600');

fs.writeFileSync('src/app/page.tsx', prefix + blueprint + suffix);
console.log("Dark mode applied!");
