#!/usr/bin/env python3
import re
import os

files = [
    'src/pages/Compliance.jsx',
    'src/pages/Risk.jsx',
    'src/pages/Negotiation.jsx',
    'src/pages/Scenarios.jsx',
    'src/pages/Research.jsx',
    'src/pages/Obligations.jsx',
    'src/pages/VoiceAssistant.jsx',
    'src/pages/Collaboration.jsx',
    'src/pages/Settings.jsx'
]

replacements = [
    # Background colors - most specific first
    (r'bg-\[#000000\]', 'bg-background'),
    (r'bg-\[#000\]', 'bg-background'),
    (r'bg-\[#010101\]', 'bg-background'),
    (r'bg-\[#0E0E0E\]', 'bg-background'),
    (r'bg-\[#0B0B0B\]', 'bg-background'),
    (r'bg-black', 'bg-background'),
    (r'bg-dark-background', 'bg-background'),
    
    (r'bg-\[#1a1a1a\]', 'bg-card'),
    (r'bg-\[#1f1f1f\]', 'bg-card'),
    (r'bg-\[#151515\]', 'bg-card'),
    (r'bg-gray-900', 'bg-card'),
    (r'bg-gray-800', 'bg-card'),
    
    (r'bg-\[#ffffff\]/10', 'bg-muted'),
    (r'bg-white/5', 'bg-muted'),
    (r'bg-white/10', 'bg-muted'),
    
    # Text colors
    (r'text-\[#FFFFFF\]', 'text-foreground'),
    (r'text-\[#FFF\]', 'text-foreground'),
    (r'text-white(?!\S)', 'text-foreground'),
    (r'text-dark-foreground', 'text-foreground'),
    (r'text-\[#f5f5f5\]', 'text-foreground'),
    
    (r'text-dark-muted-foreground', 'text-muted-foreground'),
    (r'text-gray-400', 'text-muted-foreground'),
    (r'text-gray-500', 'text-muted-foreground'),
    (r'text-\[#B3B3B3\]', 'text-muted-foreground'),
    
    (r'text-dark-primary', 'text-emerald-500'),
    (r'text-\[#F3CF1A\]', 'text-emerald-500'),
    
    # Borders
    (r'border-\[#ffffff\]/10', 'border-border'),
    (r'border-white/5', 'border-border'),
    (r'border-white/10', 'border-border'),
    (r'border-white/20', 'border-border'),
    (r'border-gray-700', 'border-border'),
    
    # Buttons & Interactive
    (r'bg-dark-primary', 'bg-emerald-600'),
    
    # Hover states
    (r'hover:bg-white/10', 'hover:bg-accent'),
    
    # Ring/Shadow
    (r'ring-white/5', 'ring-border'),
    (r'ring-white/10', 'ring-border'),
    
    # Special case
    (r'bg-white\s+text-black', 'bg-foreground text-background'),
]

total_replacements = 0

for file_path in files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        file_replacements = 0
        original_content = content
        
        for pattern, replacement in replacements:
            matches = re.findall(pattern, content)
            if matches:
                file_replacements += len(matches)
                content = re.sub(pattern, replacement, content)
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
        
        total_replacements += file_replacements
        print(f"✓ {file_path}: {file_replacements} replacements")
    except Exception as error:
        print(f"✗ {file_path}: {str(error)}")

print(f"\nTotal: {total_replacements} color class replacements across all files")
