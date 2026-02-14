const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/pages/Scenarios.jsx');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  const replacements = [
    { from: 'text-gray-400', to: 'text-muted-foreground' },
    { from: 'text-gray-300', to: 'text-foreground' },
    { from: 'text-gray-500', to: 'text-muted-foreground' },
    { from: 'text-gray-600', to: 'text-muted-foreground' },
    { from: 'text-dark-foreground', to: 'text-foreground' },
    { from: 'text-dark-primary', to: 'text-foreground' },
    { from: 'placeholder-gray-500', to: 'placeholder:text-muted-foreground' },
    { from: 'hover:text-dark-foreground', to: 'hover:text-foreground' },
    { from: 'hover:text-dark-primary', to: 'hover:text-foreground' },
    { from: 'hover:ring-dark-primary/20', to: 'hover:ring-foreground/20' },
    { from: 'focus:ring-dark-primary/50', to: 'focus:ring-foreground/50' },
    { from: 'ring-dark-primary/20', to: 'ring-foreground/20' }
  ];

  let totalReplacements = 0;
  
  for (const { from, to } of replacements) {
    const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = (content.match(regex) || []).length;
    content = content.replace(regex, to);
    totalReplacements += matches;
    console.log(`✓ Replaced "${from}" → "${to}" (${matches} occurrences)`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`\n✓ All ${totalReplacements} color classes replaced successfully in ${filePath}`);
  
} catch (error) {
  console.error('✗ Error:', error.message);
  process.exit(1);
}
