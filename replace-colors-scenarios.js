const fs = require('fs');

const filePath = 'C:\\Users\\DELL\\Desktop\\mortious\\LexAI\\src\\pages\\Scenarios.jsx';

// Read file
let content = fs.readFileSync(filePath, 'utf8');

// Perform replacements
content = content.replace(/text-gray-400/g, 'text-muted-foreground');
content = content.replace(/text-gray-300/g, 'text-foreground');
content = content.replace(/text-gray-500/g, 'text-muted-foreground');
content = content.replace(/text-gray-600/g, 'text-muted-foreground');
content = content.replace(/text-dark-foreground/g, 'text-foreground');
content = content.replace(/text-dark-primary/g, 'text-foreground');
content = content.replace(/placeholder-gray-500/g, 'placeholder:text-muted-foreground');
content = content.replace(/hover:text-dark-foreground/g, 'hover:text-foreground');
content = content.replace(/hover:text-dark-primary/g, 'hover:text-foreground');
content = content.replace(/hover:ring-dark-primary\/20/g, 'hover:ring-foreground/20');
content = content.replace(/focus:ring-dark-primary\/50/g, 'focus:ring-foreground/50');
content = content.replace(/ring-dark-primary\/20/g, 'ring-foreground/20');

// Write file
fs.writeFileSync(filePath, content, 'utf8');

console.log('✓ All color classes replaced successfully');
