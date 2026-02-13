import re
import sys

file_path = r'src\pages\Scenarios.jsx'

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
except Exception as e:
    print(f'Error reading file: {e}')
    sys.exit(1)

# Order matters: do hover: and shadow: first to avoid double replacements
replacements = [
    ('hover:bg-[#ffffff]/10', 'hover:bg-muted'),
    ('hover:shadow-[#ffffff]/10', 'hover:shadow-foreground/10'),
    ('shadow-[#ffffff]/20', 'shadow-foreground/20'),
    ('bg-[#0E0E0E]', 'bg-card'),
    ('border-[#ffffff]/50', 'border-foreground/50'),
    ('border-[#ffffff]/40', 'border-foreground/40'),
    ('border-[#ffffff]/20', 'border-foreground/20'),
    ('border-white/10', 'border-border'),
    ('bg-[#ffffff]/10', 'bg-muted'),
    ('ring-white/10', 'ring-border')
]

print('\nReplacement Report:')
print('===================')

total = 0
for old, new in replacements:
    escaped = re.escape(old)
    count = len(re.findall(escaped, content))
    content = re.sub(escaped, new, content)
    print(f'{count} × {old} → {new}')
    total += count

try:
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'\nTotal replacements: {total}')
    print('\nFile updated successfully!')
except Exception as e:
    print(f'\nError writing file: {e}')
    sys.exit(1)
