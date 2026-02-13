# Semantic Color Variables - Quick Reference Guide

## Available Semantic Colors

```css
/* Background & Surface Colors */
--background      /* Page/screen background */
--card            /* Card/container background */
--muted           /* Secondary surface (semi-transparent) */

/* Text Colors */
--foreground           /* Primary text */
--card-foreground      /* Text on cards */
--muted-foreground     /* Secondary text (gray) */

/* Interactive Colors */
--primary         /* Primary action */
--secondary       /* Secondary action */
--accent          /* Accent/highlight */
--border          /* Border/divider */
```

## Color Usage Patterns

### Page Backgrounds
```jsx
<div className="min-h-screen bg-background">
  {/* content */}
</div>
```

### Card/Container Backgrounds
```jsx
<div className="bg-card rounded-lg border border-border p-6">
  {/* content */}
</div>
```

### Secondary/Muted Backgrounds
```jsx
<div className="bg-muted rounded-lg p-4">
  {/* secondary content */}
</div>
```

### Primary Text
```jsx
<h1 className="text-foreground font-bold">
  Main Heading
</h1>
```

### Secondary Text
```jsx
<p className="text-muted-foreground text-sm">
  Secondary information
</p>
```

### Interactive Elements
```jsx
<button className="bg-foreground text-background hover:bg-foreground/90 transition-colors duration-300">
  Click me
</button>
```

### Borders & Dividers
```jsx
<div className="border-t border-border">
  {/* content */}
</div>
```

### Focus States
```jsx
<input className="focus:ring-2 focus:ring-accent focus:border-transparent transition-colors duration-300" />
```

### Hover States with Color Changes
```jsx
<div className="bg-card hover:bg-card/90 hover:ring-accent/20 transition-colors duration-300">
  {/* content */}
</div>
```

### Transparent Overlays
```jsx
{/* 10% opacity foreground overlay */}
<div className="bg-foreground/10">

{/* 20% opacity overlay */}
<div className="bg-muted/20">

{/* Gradient with semantic colors */}
<div className="bg-gradient-to-r from-card to-muted">
```

### Badge/Status Colors
```jsx
{/* Use muted for neutral status */}
<span className="bg-muted text-muted-foreground px-3 py-1 rounded-full">
  Neutral
</span>

{/* Use semantic accent */}
<span className="bg-accent/20 text-accent px-3 py-1 rounded-full">
  Important
</span>
```

## Color Opacity Modifiers

All semantic colors support opacity modifiers:

```jsx
bg-foreground/5      /* 5% opacity */
bg-foreground/10     /* 10% opacity */
bg-foreground/20     /* 20% opacity */
bg-foreground/30     /* 30% opacity */
text-foreground/50   /* 50% opacity */
text-foreground/75   /* 75% opacity */
```

## Status Colors (Keep as-is, not semantic)

These specific status colors are intentional and don't use variables:

```jsx
{/* Success */}
className="bg-green-500/20 text-green-300"

{/* Error */}
className="bg-red-500/20 text-red-400"

{/* Warning */}
className="bg-yellow-500/20 text-yellow-500"

{/* Info */}
className="bg-blue-500/20 text-blue-400"
```

## Transitions for Color Changes

Always add transitions when colors change on hover/focus:

```jsx
className="... hover:bg-foreground/90 transition-colors duration-300"
className="... hover:ring-accent/20 transition-all duration-300"
className="... focus:ring-accent transition-colors duration-300"
```

## Common Patterns

### Input Fields
```jsx
<input 
  className="bg-card border border-border rounded-lg p-3 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-accent focus:border-transparent transition-colors duration-300"
  placeholder="Enter text..."
/>
```

### Buttons (Primary)
```jsx
<button className="bg-foreground text-background hover:bg-foreground/90 px-4 py-2 rounded-lg font-medium transition-colors duration-300">
  Action
</button>
```

### Buttons (Secondary)
```jsx
<button className="bg-muted text-foreground hover:bg-muted/80 px-4 py-2 rounded-lg font-medium transition-colors duration-300">
  Secondary
</button>
```

### Cards with Hover
```jsx
<div className="bg-card border border-border hover:border-foreground/30 rounded-lg p-6 transition-all duration-300">
  {/* content */}
</div>
```

### Activity/Timeline Items
```jsx
<div className="bg-muted border border-border rounded-lg p-4 hover:bg-card transition-colors duration-300">
  {/* content */}
</div>
```

## DO's and DON'Ts

### ✅ DO

```jsx
// Use semantic variables
className="bg-background text-foreground border border-border"

// Use opacity modifiers
className="bg-foreground/10 hover:bg-foreground/20"

// Add transitions for interactive elements
className="hover:bg-foreground/90 transition-colors duration-300"

// Use appropriate semantic colors for context
className="bg-card"  // For cards
className="bg-muted"  // For secondary content
```

### ❌ DON'T

```jsx
// Hardcoded hex colors
className="bg-[#ffffff] text-[#000000]"

// Hardcoded gray/white without semantic meaning
className="bg-gray-100 text-gray-800"

// Color changes without transitions
className="hover:bg-foreground"  // Missing transition

// Mixing hardcoded and semantic colors
className="bg-[#010101] text-foreground"
```

## Layout Hierarchy Example

```jsx
<div className="min-h-screen bg-background">
  {/* Primary page background */}
  
  <div className="bg-card border border-border rounded-lg">
    {/* Card/container - secondary surface */}
    
    <h2 className="text-foreground font-bold">
      {/* Primary text */}
    </h2>
    
    <p className="text-muted-foreground text-sm">
      {/* Secondary text - muted */}
    </p>
    
    <div className="bg-muted rounded p-3 mt-4">
      {/* Tertiary surface - muted background */}
      
      <span className="text-muted-foreground">
        {/* Text on muted surface */}
      </span>
    </div>
    
    <button className="mt-4 bg-foreground text-background hover:bg-foreground/90 transition-colors duration-300 px-4 py-2 rounded-lg">
      {/* Interactive element */}
      Action
    </button>
  </div>
</div>
```

## Testing Your Changes

When modifying colors:

1. Test in both light and dark modes (when supported)
2. Verify WCAG AA contrast ratios
3. Check hover/focus states are visible
4. Ensure transitions are smooth (300ms)
5. Verify all text is readable on its background

---

**Last Updated**: 2024
**Status**: Active
**Questions?**: See THEME_MIGRATION_COMPLETE.md
