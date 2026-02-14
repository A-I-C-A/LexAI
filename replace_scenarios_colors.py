import re

# File path
file_path = r'C:\Users\DELL\Desktop\mortious\LexAI\src\pages\Scenarios.jsx'

# Read the file
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Store original content for comparison
original_content = content

# Define replacements in order
replacements = [
    ('text-dark-primary', 'text-foreground'),
    ('text-dark-foreground', 'text-foreground'),
    ('placeholder-gray-500', 'placeholder:text-muted-foreground'),
    ('hover:ring-dark-primary/20', 'hover:ring-foreground/20'),
    ('focus:ring-dark-primary/50', 'focus:ring-foreground/50'),
    ('ring-dark-primary/20', 'ring-foreground/20'),
    ('text-gray-300', 'text-foreground'),
    ('text-gray-400', 'text-muted-foreground'),
    ('text-gray-500', 'text-muted-foreground'),
    ('text-gray-600', 'text-muted-foreground'),
]

# Track replacements
replacement_counts = {}

# Perform replacements
for old_class, new_class in replacements:
    count = content.count(old_class)
    if count > 0:
        content = content.replace(old_class, new_class)
        replacement_counts[old_class] = count
        print(f"Replaced '{old_class}' with '{new_class}': {count} occurrences")

# Write the file back
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

# Summary
print("\n" + "="*60)
print("REPLACEMENT SUMMARY")
print("="*60)
total_replacements = sum(replacement_counts.values())
print(f"Total replacements made: {total_replacements}")
print(f"Classes modified: {len(replacement_counts)}")
print("\nDetails:")
for old_class, count in replacement_counts.items():
    print(f"  - {old_class}: {count} occurrences")

if total_replacements > 0:
    print("\n✓ File successfully updated!")
else:
    print("\n⚠ No replacements were needed - all classes already up to date.")
