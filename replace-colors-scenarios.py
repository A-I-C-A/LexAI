import re

file_path = r'C:\Users\DELL\Desktop\mortious\LexAI\src\pages\Scenarios.jsx'

# Read file
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Perform replacements
replacements = [
    ('text-gray-400', 'text-muted-foreground'),
    ('text-gray-300', 'text-foreground'),
    ('text-gray-500', 'text-muted-foreground'),
    ('text-gray-600', 'text-muted-foreground'),
    ('text-dark-foreground', 'text-foreground'),
    ('text-dark-primary', 'text-foreground'),
    ('placeholder-gray-500', 'placeholder:text-muted-foreground'),
    ('hover:text-dark-foreground', 'hover:text-foreground'),
    ('hover:text-dark-primary', 'hover:text-foreground'),
    ('hover:ring-dark-primary/20', 'hover:ring-foreground/20'),
    ('focus:ring-dark-primary/50', 'focus:ring-foreground/50'),
    ('ring-dark-primary/20', 'ring-foreground/20'),
]

for old, new in replacements:
    content = content.replace(old, new)

# Write file
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('✓ All color classes replaced successfully')
