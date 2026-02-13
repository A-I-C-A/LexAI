const fs = require('fs');

const filePath = 'src\\pages\\Scenarios.jsx';

console.log('Reading file...');
let content = fs.readFileSync(filePath, 'utf8');

// Order matters: do specific patterns before general ones to avoid double replacements
const replacements = [
  { from: 'hover:bg-[#ffffff]/10', to: 'hover:bg-muted', count: 0 },
  { from: 'hover:shadow-[#ffffff]/10', to: 'hover:shadow-foreground/10', count: 0 },
  { from: 'shadow-[#ffffff]/20', to: 'shadow-foreground/20', count: 0 },
  { from: 'bg-[#0E0E0E]', to: 'bg-card', count: 0 },
  { from: 'border-[#ffffff]/50', to: 'border-foreground/50', count: 0 },
  { from: 'border-[#ffffff]/40', to: 'border-foreground/40', count: 0 },
  { from: 'border-[#ffffff]/20', to: 'border-foreground/20', count: 0 },
  { from: 'border-white/10', to: 'border-border', count: 0 },
  { from: 'bg-[#ffffff]/10', to: 'bg-muted', count: 0 },
  { from: 'ring-white/10', to: 'ring-border', count: 0 }
];

console.log('\nPerforming replacements...\n');
console.log('Replacement Report:');
console.log('===================');

let total = 0;
for (let replacement of replacements) {
  const escaped = replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escaped, 'g');
  const matches = content.match(regex);
  replacement.count = matches ? matches.length : 0;
  content = content.replace(regex, replacement.to);
  console.log(`${replacement.count} × ${replacement.from} → ${replacement.to}`);
  total += replacement.count;
}

console.log(`\nTotal replacements: ${total}`);

console.log('\nWriting updated file...');
fs.writeFileSync(filePath, content, 'utf8');
console.log('File updated successfully!');
