const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/Compliance.jsx',
  'src/pages/Risk.jsx',
  'src/pages/Negotiation.jsx',
  'src/pages/Scenarios.jsx',
  'src/pages/Research.jsx',
  'src/pages/Obligations.jsx',
  'src/pages/VoiceAssistant.jsx',
  'src/pages/Collaboration.jsx',
  'src/pages/Settings.jsx'
];

const replacements = [
  // Background colors - most specific first
  { from: /bg-\[#000000\]/g, to: 'bg-background' },
  { from: /bg-\[#000\]/g, to: 'bg-background' },
  { from: /bg-\[#010101\]/g, to: 'bg-background' },
  { from: /bg-\[#0E0E0E\]/g, to: 'bg-background' },
  { from: /bg-\[#0B0B0B\]/g, to: 'bg-background' },
  { from: /bg-black/g, to: 'bg-background' },
  { from: /bg-dark-background/g, to: 'bg-background' },
  
  { from: /bg-\[#1a1a1a\]/g, to: 'bg-card' },
  { from: /bg-\[#1f1f1f\]/g, to: 'bg-card' },
  { from: /bg-\[#151515\]/g, to: 'bg-card' },
  { from: /bg-gray-900/g, to: 'bg-card' },
  { from: /bg-gray-800/g, to: 'bg-card' },
  
  { from: /bg-\[#ffffff\]\/10/g, to: 'bg-muted' },
  { from: /bg-white\/5/g, to: 'bg-muted' },
  { from: /bg-white\/10/g, to: 'bg-muted' },
  
  // Text colors
  { from: /text-\[#FFFFFF\]/g, to: 'text-foreground' },
  { from: /text-\[#FFF\]/g, to: 'text-foreground' },
  { from: /text-white/g, to: 'text-foreground' },
  { from: /text-dark-foreground/g, to: 'text-foreground' },
  { from: /text-\[#f5f5f5\]/g, to: 'text-foreground' },
  
  { from: /text-dark-muted-foreground/g, to: 'text-muted-foreground' },
  { from: /text-gray-400/g, to: 'text-muted-foreground' },
  { from: /text-gray-500/g, to: 'text-muted-foreground' },
  { from: /text-\[#B3B3B3\]/g, to: 'text-muted-foreground' },
  
  { from: /text-dark-primary/g, to: 'text-emerald-500' },
  { from: /text-\[#F3CF1A\]/g, to: 'text-emerald-500' },
  
  // Borders
  { from: /border-\[#ffffff\]\/10/g, to: 'border-border' },
  { from: /border-white\/5/g, to: 'border-border' },
  { from: /border-white\/10/g, to: 'border-border' },
  { from: /border-white\/20/g, to: 'border-border' },
  { from: /border-gray-700/g, to: 'border-border' },
  
  // Buttons & Interactive
  { from: /bg-dark-primary/g, to: 'bg-emerald-600' },
  
  // Hover states
  { from: /hover:bg-white\/10/g, to: 'hover:bg-accent' },
  
  // Ring/Shadow
  { from: /ring-white\/5/g, to: 'ring-border' },
  { from: /ring-white\/10/g, to: 'ring-border' }
];

let totalReplacements = 0;

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    let fileReplacements = 0;
    
    replacements.forEach(({ from, to }) => {
      const matches = content.match(from);
      if (matches) {
        fileReplacements += matches.length;
        content = content.replace(from, to);
      }
    });
    
    // Special case: bg-white text-black → bg-foreground text-background
    const whiteBlackPattern = /bg-white\s+text-black/g;
    const whiteBlackMatches = content.match(whiteBlackPattern);
    if (whiteBlackMatches) {
      fileReplacements += whiteBlackMatches.length;
      content = content.replace(whiteBlackPattern, 'bg-foreground text-background');
    }
    
    fs.writeFileSync(file, content, 'utf8');
    totalReplacements += fileReplacements;
    console.log(`✓ ${file}: ${fileReplacements} replacements`);
  } catch (error) {
    console.error(`✗ ${file}: ${error.message}`);
  }
});

console.log(`\nTotal: ${totalReplacements} color class replacements across all files`);
