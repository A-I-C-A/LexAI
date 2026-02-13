const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'Scenarios.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  { from: 'bg-[#0E0E0E]', to: 'bg-card', count: 0 },
  { from: 'border-white/10', to: 'border-border', count: 0 },
  { from: 'border-[#ffffff]/20', to: 'border-foreground/20', count: 0 },
  { from: 'border-[#ffffff]/40', to: 'border-foreground/40', count: 0 },
  { from: 'border-[#ffffff]/50', to: 'border-foreground/50', count: 0 },
  { from: 'bg-[#ffffff]/10', to: 'bg-muted', count: 0 },
  { from: 'hover:bg-[#ffffff]/10', to: 'hover:bg-muted', count: 0 },
  { from: 'hover:shadow-[#ffffff]/10', to: 'hover:shadow-foreground/10', count: 0 },
  { from: 'shadow-[#ffffff]/20', to: 'shadow-foreground/20', count: 0 },
  { from: 'ring-white/10', to: 'ring-border', count: 0 }
];

for (let replacement of replacements) {
  const regex = new RegExp(replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  const matches = content.match(regex);
  replacement.count = matches ? matches.length : 0;
  content = content.replace(regex, replacement.to);
}

fs.writeFileSync(filePath, content, 'utf8');

console.log('\nReplacement Report:');
console.log('===================');
for (let replacement of replacements) {
  console.log(`${replacement.count} × ${replacement.from} → ${replacement.to}`);
}
console.log('\nTotal replacements:', replacements.reduce((sum, r) => sum + r.count, 0));
