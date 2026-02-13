# Color Replacement Cheatsheet

## Quick Copy-Paste Replacements

### Most Common Replacements

| Find | Replace |
|------|---------|
| `bg-[#000000]` | `bg-background` |
| `bg-[#010101]` | `bg-background` |
| `bg-[#ffffff]` | `bg-foreground` |
| `text-white` | `text-foreground` |
| `text-[#ffffff]` | `text-foreground` |
| `text-[#1a1a1a]` | `text-background` |
| `bg-white/10` | `bg-muted` |
| `bg-white/5` | `bg-muted` |
| `border-white/10` | `border-border` |
| `border-white/5` | `border-border` |
| `text-gray-400` | `text-muted-foreground` |
| `text-gray-300` | `text-muted-foreground` |
| `text-gray-500` | `text-muted-foreground` |

---

## By Component Type

### Buttons

**Primary Button (Before)**
```jsx
className="bg-[#ffffff] text-[#000000] hover:bg-[#ffffff]/90"
```

**Primary Button (After)**
```jsx
className="bg-foreground text-background hover:bg-foreground/90 transition-colors duration-300"
```

### Input Fields

**Input (Before)**
```jsx
className="bg-[#ffffff]/10 text-white border-white/10"
```

**Input (After)**
```jsx
className="bg-muted text-foreground border-border focus:ring-accent transition-colors duration-300"
```

### Cards

**Card (Before)**
```jsx
className="bg-[#1f1f1f] border-white/5"
```

**Card (After)**
```jsx
className="bg-card border-border transition-all duration-300"
```

### Headers

**Header (Before)**
```jsx
className="text-[#ffffff] bg-[#000000]"
```

**Header (After)**
```jsx
className="text-foreground bg-background"
```

### Secondary Text

**Secondary Text (Before)**
```jsx
className="text-gray-400"
```

**Secondary Text (After)**
```jsx
className="text-muted-foreground"
```

---

## Opacity Variants

When you see these, replace similarly:

```jsx
// 5% opacity
bg-white/5           → bg-muted  (or bg-foreground/5 for lighter)

// 10% opacity
bg-white/10          → bg-muted  (or bg-foreground/10)

// 15% opacity
bg-white/15          → bg-foreground/15
hover:bg-white/15    → hover:bg-foreground/15

// 20% opacity
bg-white/20          → bg-foreground/20
border-white/20      → border-foreground/20
hover:ring-white/20  → hover:ring-foreground/20

// 30% opacity
border-white/30      → border-foreground/30

// 50% opacity
bg-white/50          → bg-foreground/50
text-white/50        → text-foreground/50

// 90% opacity (hover effect)
hover:bg-white/90    → hover:bg-foreground/90
```

---

## Gradient Backgrounds

**Before**
```jsx
className="bg-gradient-to-r from-[#1f1f1f] to-[#151515]"
className="bg-gradient-to-b from-[#ffffff]/10 to-transparent"
```

**After**
```jsx
className="bg-gradient-to-r from-card to-background"
className="bg-gradient-to-b from-foreground/10 to-transparent"
```

---

## Focus/Hover States

### Focus Ring (Before)
```jsx
focus:ring-[#ffffff]
focus:ring-[#A9CEF4]
```

### Focus Ring (After)
```jsx
focus:ring-accent
focus:ring-accent
```

---

## Status & State Colors (Keep These!)

These intentional colors should NOT change:

```jsx
// Success
className="bg-green-500/20 text-green-300"

// Error/Danger
className="bg-red-500/20 text-red-400"

// Warning
className="bg-yellow-500/20 text-yellow-500"

// Info
className="bg-blue-500/20 text-blue-400"
```

---

## Transitions Always Add

Whenever you update colors, add transitions:

```jsx
// For single color properties
transition-colors duration-300

// For multiple properties (scale, color, shadow)
transition-all duration-300

// Examples
className="hover:bg-foreground/90 transition-colors duration-300"
className="hover:ring-accent/20 hover:scale-105 transition-all duration-300"
```

---

## Complete Examples

### Form Group
```jsx
<div className="space-y-4">
  <label className="block text-foreground text-sm font-medium">
    Email Address
  </label>
  <input
    type="email"
    className="w-full bg-muted border border-border rounded-lg p-3 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-accent focus:border-transparent transition-colors duration-300"
    placeholder="you@example.com"
  />
</div>
```

### Card List Item
```jsx
<div className="bg-card border border-border rounded-lg p-5 hover:border-foreground/30 hover:shadow-lg transition-all duration-300">
  <h3 className="text-foreground font-bold mb-2">Item Title</h3>
  <p className="text-muted-foreground text-sm">Item description</p>
</div>
```

### Button Group
```jsx
<div className="flex gap-3">
  <button className="bg-foreground text-background px-4 py-2 rounded-lg hover:bg-foreground/90 transition-colors duration-300 font-medium">
    Primary
  </button>
  <button className="bg-muted text-foreground px-4 py-2 rounded-lg hover:bg-muted/80 transition-colors duration-300 font-medium">
    Secondary
  </button>
</div>
```

### Modal/Overlay
```jsx
<div className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
  <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
    <h2 className="text-foreground font-bold mb-4">Dialog Title</h2>
    <p className="text-muted-foreground mb-6">Dialog content</p>
  </div>
</div>
```

---

## Search & Replace Commands

### Using VS Code Find & Replace

**Replace all white backgrounds**
- Find: `bg-\[#ffffff\]`
- Replace: `bg-foreground`

**Replace all black backgrounds**
- Find: `bg-\[#0[01][01][01]\]`
- Replace: `bg-background`

**Replace white text**
- Find: `text-white`
- Replace: `text-foreground`

**Replace gray text**
- Find: `text-gray-[34][0-9][0-9]`
- Replace: `text-muted-foreground`

---

## Testing Your Changes

After replacing colors, verify:

```jsx
// ✅ Good - has transition
className="hover:bg-foreground/90 transition-colors duration-300"

// ✅ Good - uses semantic variable
className="bg-card border-border p-6"

// ✅ Good - preserves opacity
className="bg-foreground/10 hover:bg-foreground/20"

// ❌ Bad - no transition
className="hover:bg-foreground"

// ❌ Bad - hardcoded color
className="bg-[#ffffff]"

// ❌ Bad - inconsistent
className="bg-[#1f1f1f] text-foreground"
```

---

## Common Mistakes to Avoid

1. **Forgetting Transitions**
   - ❌ `hover:bg-foreground`
   - ✅ `hover:bg-foreground transition-colors duration-300`

2. **Using Wrong Semantic Variable**
   - ❌ `bg-foreground` for secondary content (too bright)
   - ✅ `bg-muted` for secondary content

3. **Mixing Hardcoded & Semantic**
   - ❌ `bg-[#010101] text-foreground`
   - ✅ `bg-background text-foreground`

4. **Forgetting Opacity**
   - ❌ `border-foreground` (too bold for subtle border)
   - ✅ `border-foreground/30` (appropriate opacity)

5. **Status Colors**
   - ❌ Changing `bg-green-500` to semantic
   - ✅ Keep status colors as-is

---

## Reference

**Semantic Variables Available:**
- `background` - Page/screen background
- `foreground` - Primary text & buttons
- `card` - Card/container background  
- `muted` - Secondary background
- `muted-foreground` - Secondary text
- `border` - Border/divider color
- `accent` - Accent/highlight color

**Always Include:**
- `transition-colors duration-300` for hover/focus
- `transition-all duration-300` for multiple properties
- Opacity modifiers (`/10`, `/20`, `/30`, etc.)

---

*Last Updated: 2024*
*Status: Active*
