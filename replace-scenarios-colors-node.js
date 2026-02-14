const fs = require('fs');
const path = require('path');

// File path
const filePath = path.join(__dirname, 'src', 'pages', 'Scenarios.jsx');

// Read the file
let content = fs.readFileSync(filePath, 'utf-8');
const originalContent = content;

// Define replacements in order
const replacements = [
    ['text-dark-primary', 'text-foreground'],
    ['text-dark-foreground', 'text-foreground'],
    ['placeholder-gray-500', 'placeholder:text-muted-foreground'],
    ['hover:ring-dark-primary/20', 'hover:ring-foreground/20'],
    ['focus:ring-dark-primary/50', 'focus:ring-foreground/50'],
    ['ring-dark-primary/20', 'ring-foreground/20'],
    ['text-gray-300', 'text-foreground'],
    ['text-gray-400', 'text-muted-foreground'],
    ['text-gray-500', 'text-muted-foreground'],
    ['text-gray-600', 'text-muted-foreground'],
];

// Track replacements
const replacementCounts = {};
let totalReplacements = 0;

// Perform replacements
replacements.forEach(([oldClass, newClass]) => {
    const regex = new RegExp(oldClass.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = content.match(regex);
    const count = matches ? matches.length : 0;
    
    if (count > 0) {
        content = content.replace(regex, newClass);
        replacementCounts[oldClass] = count;
        totalReplacements += count;
        console.log(`Replaced '${oldClass}' with '${newClass}': ${count} occurrences`);
    }
});

// Write the file back
fs.writeFileSync(filePath, content, 'utf-8');

// Summary
console.log('\n' + '='.repeat(60));
console.log('REPLACEMENT SUMMARY');
console.log('='.repeat(60));
console.log(`Total replacements made: ${totalReplacements}`);
console.log(`Classes modified: ${Object.keys(replacementCounts).length}`);
console.log('\nDetails:');
Object.entries(replacementCounts).forEach(([oldClass, count]) => {
    console.log(`  - ${oldClass}: ${count} occurrences`);
});

if (totalReplacements > 0) {
    console.log('\n✓ File successfully updated!');
} else {
    console.log('\n⚠ No replacements were needed - all classes already up to date.');
}
