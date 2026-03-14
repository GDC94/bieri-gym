---
name: tailwind-4
description: >
  Tailwind CSS 4 patterns and best practices.
  Trigger: When styling with Tailwind (className, variants, cn()), dynamic styling, CSS variables, CVA components, or working with the project's design system colors and spacing.
license: MIT
metadata:
  author: germanderbescatoni
  version: "2.0"
  scope: [root, ui]
  auto_invoke: "Working with Tailwind classes / CVA / Design tokens"
  source: "Context7 + Tailwind CSS Official Docs (January 2026)"
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

# Tailwind CSS 4 - Complete Reference

## Styling Decision Tree

```
Tailwind class exists?       → className="..."
Dynamic runtime value?       → style={{ width: `${x}%` }}
Conditional styles?          → cn("base", condition && "variant")
Component with variants?     → Use CVA (class-variance-authority)
Static only?                 → className="..." (no cn() needed)
Library can't use className? → style prop with CSS variables
```

---

## Critical Rules

### NEVER Use var() in className

```typescript
// ❌ NEVER: var() in className doesn't work
<div className="bg-[var(--color-primary)]" />
<div className="text-[var(--text-color)]" />

// ✅ ALWAYS: Use project's semantic classes
<div className="bg-purple-800" />
<div className="text-text-primary" />
<div className="bg-surface-card" />
```

### NEVER Use Hex Colors in className

```typescript
// ❌ NEVER: Hex colors bypass design system
<p className="text-[#ffffff]" />
<div className="bg-[#1e293b]" />

// ✅ ALWAYS: Use project's color tokens
<p className="text-white-1000" />
<div className="bg-gray-400" />
```

---

## Project Design System

### Color Palette

#### Brand Colors
```typescript
// Primary (Purple)
<div className="bg-purple-800" />     // #903CF6 - Main brand
<div className="bg-purple-600" />     // #A660FB - Hover
<div className="bg-purple-900" />     // #832BEE - Selected
<div className="bg-purple-10p" />     // 10% opacity
<div className="bg-purple-20p" />     // 20% opacity

// Secondary (Yellow)
<div className="bg-yellow-800" />     // #F2C445 - Main
<div className="bg-yellow-500" />     // #FADB43
<div className="bg-yellow-600" />     // #EECB1B - Hover
<div className="bg-yellow-10p" />     // 10% opacity
```

#### Semantic Colors
```typescript
// Success (Green)
<div className="bg-green-400" />      // #20BB51
<div className="text-green-300" />    // #16DC55

// Error (Red)
<div className="bg-red-400" />        // #D23924
<div className="text-red-300" />      // #FB3E23

// Warning (Orange)
<div className="bg-orange-500" />     // #FDA741

// Info (Cyan/Blue)
<div className="text-cyan-500" />     // #83F0FF
<div className="bg-blue-500" />       // #3076FF
```

#### Grayscale
```typescript
// Background hierarchy (dark theme)
<div className="bg-gray-000" />       // #000000 - Deepest
<div className="bg-gray-300" />       // #131313 - Card background
<div className="bg-gray-400" />       // #1A1A1A - Elevated
<div className="bg-gray-420" />       // #212121
<div className="bg-gray-440" />       // #262626
<div className="bg-gray-500" />       // #333333 - Borders
<div className="bg-gray-600" />       // #4D4D4D
<div className="bg-gray-700" />       // #666666
<div className="bg-gray-800" />       // #808080 - Secondary text
<div className="bg-gray-900" />       // #999999
<div className="bg-gray-1000" />      // #B2B2B2
<div className="bg-gray-1100" />      // #D9D9D9
```

#### Text Colors
```typescript
<p className="text-text-primary" />     // #FFFFFF
<p className="text-text-secondary" />   // #808080
<p className="text-text-tertiary" />    // #4D4D4D
<p className="text-text-quaternary" />  // #333333
```

#### Surface Colors
```typescript
<div className="bg-surface-background" />   // #000000
<div className="bg-surface-card" />         // #131313
<div className="border-surface-card-stroke" /> // #1A1A1A
```

#### Button States
```typescript
// Primary Button (Purple)
<button className="bg-button-primary-bg-default hover:bg-button-primary-bg-hover active:bg-button-primary-bg-selected disabled:bg-button-primary-bg-disabled" />

// Secondary Button (Yellow)
<button className="bg-button-secondary-bg-default hover:bg-button-secondary-bg-hover" />

// Ghost Button
<button className="bg-button-ghost-bg-default hover:bg-button-ghost-bg-hover border-button-ghost-stroke" />

// CTA Buttons
<button className="bg-cta-primary-bg-default hover:bg-cta-primary-bg-hover" />
<button className="bg-cta-success-bg-default" />
<button className="bg-cta-error-bg-default" />
```

#### Input States
```typescript
<input className="bg-input-background-enabled text-input-on-bg-enabled focus:text-input-on-bg-focused disabled:text-input-on-bg-disabled border-input-stroke" />
```

### Spacing System

#### Standard Spacing (px-based)
```typescript
// Common values
<div className="p-1" />      // 4px
<div className="p-2" />      // 8px (use for gaps, small padding)
<div className="p-3" />      // 12px
<div className="p-4" />      // 16px (standard padding)
<div className="p-5" />      // 20px
<div className="p-6" />      // 24px (section padding)
<div className="p-8" />      // 32px (large spacing)
<div className="p-10" />     // 40px
```

#### V2 Spacing (rem-based, accessible)
```typescript
// Prefixed with v2- for accessibility compliance
<div className="p-v2-2" />   // 8px (0.5rem)
<div className="p-v2-4" />   // 16px (1rem)
<div className="p-v2-6" />   // 24px (1.5rem)
<div className="p-v2-8" />   // 32px (2rem)
<div className="gap-v2-4" /> // 16px gap
```

### Typography

#### Font Families
```typescript
<p className="font-sans" />       // SF Pro Display (default)
<p className="font-inter" />      // Inter
<p className="font-signifier" />  // Signifier
<p className="font-satoshi" />    // Satoshi
<p className="font-sf-pro" />     // SF Pro Display/Text
```

#### Font Sizes (with line-height)
```typescript
<p className="text-3" />      // 12px, lh: 16px
<p className="text-3.25" />   // 13px, lh: 18px
<p className="text-3.5" />    // 14px, lh: 19.6px
<p className="text-3.75" />   // 15px, lh: 22px
<p className="text-4" />      // 16px, lh: 24px (base)
<p className="text-4.5" />    // 18px, lh: 24px
<p className="text-5" />      // 20px, lh: 24px
<p className="text-5.5" />    // 22px, lh: 28px
<p className="text-6" />      // 24px, lh: 28px
<p className="text-7" />      // 28px, lh: 36px
<p className="text-8" />      // 32px, lh: 38px
<p className="text-10" />     // 40px, lh: 48px
```

### Border Radius

#### Standard
```typescript
<div className="rounded-xs" />    // 7px
<div className="rounded-sm" />    // calc(var(--radius) - 4px)
<div className="rounded-md" />    // calc(var(--radius) - 2px)
<div className="rounded-lg" />    // var(--radius)
<div className="rounded-card" />  // 10px
```

#### V2 Border Radius
```typescript
<div className="rounded-v2-sm" />     // 2px
<div className="rounded-v2-DEFAULT" /> // 4px
<div className="rounded-v2-md" />     // 6px
<div className="rounded-v2-lg" />     // 8px
<div className="rounded-v2-xl" />     // 12px
<div className="rounded-v2-2xl" />    // 16px
<div className="rounded-v2-3xl" />    // 24px
<div className="rounded-v2-full" />   // 9999px
```

### Custom CTA Gradients

```typescript
// Use custom utility classes for gradient CTAs
<button className="border-gradient-cta-primary">Primary CTA</button>
<button className="border-gradient-cta-success">Success CTA</button>
<button className="border-gradient-cta-error">Error CTA</button>
<button className="border-gradient-cta-purple">Purple CTA</button>
<button className="border-gradient-cta-disabled">Disabled CTA</button>
```

### Shadows

```typescript
<div className="shadow-modal" />              // Large modal shadow
<div className="shadow-cta-shadow-primary" /> // Yellow glow
<div className="shadow-cta-shadow-success" /> // Green glow
<div className="shadow-cta-shadow-error" />   // Red glow
```

---

## The cn() Utility

```typescript
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### When to Use cn()

```typescript
// ✅ Conditional classes
<div className={cn("bg-gray-400", isActive && "bg-purple-800")} />

// ✅ Merging with potential conflicts (component accepts className)
<button className={cn("px-4 py-2 bg-purple-800", className)} />

// ✅ Multiple conditions
<div className={cn(
  "rounded-lg border border-gray-500",
  variant === "primary" && "bg-purple-800 text-white-1000",
  variant === "secondary" && "bg-yellow-800 text-gray-000",
  disabled && "opacity-50 cursor-not-allowed"
)} />
```

### When NOT to Use cn()

```typescript
// ❌ Static classes - unnecessary wrapper
<div className={cn("flex items-center gap-2")} />

// ✅ Just use className directly
<div className="flex items-center gap-2" />
```

---

## CVA (class-variance-authority)

Use CVA for components with multiple variants:

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  // Base classes
  'inline-flex items-center justify-center rounded-v2-lg font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-button-primary-bg-default hover:bg-button-primary-bg-hover text-white-1000',
        secondary: 'bg-button-secondary-bg-default hover:bg-button-secondary-bg-hover text-gray-000',
        ghost: 'bg-button-ghost-bg-default hover:bg-button-ghost-bg-hover border border-button-ghost-stroke',
        destructive: 'bg-cta-error-bg-default hover:bg-cta-error-bg-hover text-white-1000',
      },
      size: {
        sm: 'h-8 px-3 text-3.5',
        md: 'h-10 px-4 text-4',
        lg: 'h-12 px-6 text-4.5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
```

---

## Dynamic Values

```typescript
// ✅ style prop for truly dynamic values
<div style={{ width: `${percentage}%` }} />
<div style={{ transform: `translateX(${offset}px)` }} />

// ✅ CSS custom properties for dynamic theming
<div
  style={{ '--progress': `${value}%` } as React.CSSProperties}
  className="w-[var(--progress)]"
/>
```

---

## Style Constants for Charts/Libraries

When libraries don't accept className (e.g., Recharts):

```typescript
// ✅ Constants with CSS variables - ONLY for library props
const CHART_COLORS = {
  primary: 'var(--color-purple-800)',
  secondary: 'var(--color-yellow-800)',
  success: 'var(--color-green-400)',
  error: 'var(--color-red-400)',
  text: 'var(--color-text-secondary)',
  gridLine: 'var(--color-gray-500)',
} as const;

// Usage with Recharts (can't use className)
<XAxis tick={{ fill: CHART_COLORS.text }} />
<CartesianGrid stroke={CHART_COLORS.gridLine} />
<Line stroke={CHART_COLORS.primary} />
```

---

## Tailwind v4 Changes (Migration Notes)

### Renamed Utilities

| v3 | v4 |
|----|-----|
| `shadow-sm` | `shadow-xs` |
| `shadow` | `shadow-sm` |
| `blur-sm` | `blur-xs` |
| `blur` | `blur-sm` |
| `rounded-sm` | `rounded-xs` |
| `rounded` | `rounded-sm` |
| `outline-none` | `outline-hidden` |
| `ring` | `ring-3` |

### Removed Utilities (Use Opacity Modifier)

```typescript
// ❌ Old (removed)
<div className="bg-opacity-50" />

// ✅ New (use modifier)
<div className="bg-purple-800/50" />
<div className="text-white-1000/75" />
<div className="border-gray-500/25" />
```

### Border Color Change

```typescript
// v4: border now uses currentColor by default
// Always specify border color explicitly
<div className="border border-gray-500" />
<div className="border border-stroke-card" />
```

### Space/Divide → Gap

```typescript
// ❌ Old pattern (performance issues)
<div className="space-y-4">

// ✅ New pattern (use gap)
<div className="flex flex-col gap-4">
<div className="grid gap-4">
```

### Arbitrary Values Syntax

```typescript
// ❌ Old syntax (deprecated)
<div className="bg-[--brand-color]">

// ✅ New syntax (use parentheses)
<div className="bg-(--brand-color)">

// Grid with spaces: use underscores
<div className="grid-cols-[max-content_auto_1fr]">
```

### Variant Stacking Order (Left to Right)

```typescript
// ❌ Old (right to left)
<ul className="first:*:pt-0">

// ✅ New (left to right)
<ul className="*:first:pt-0">
```

---

## Common Patterns

### Layout

```typescript
// Flex containers
<div className="flex items-center justify-between gap-4" />
<div className="flex flex-col gap-2" />
<div className="inline-flex items-center gap-1" />

// Grid
<div className="grid grid-cols-3 gap-4" />
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" />

// Center content
<div className="flex items-center justify-center" />
<div className="mx-auto max-w-content-container" />
```

### Cards

```typescript
<div className="bg-surface-card border border-surface-card-stroke rounded-card p-4">
  <h3 className="text-text-primary text-4.5 font-medium">Title</h3>
  <p className="text-text-secondary text-3.5">Description</p>
</div>
```

### Responsive Design

```typescript
<div className="w-full md:w-1/2 lg:w-1/3" />
<div className="hidden md:block" />
<div className="text-3.5 md:text-4 lg:text-4.5" />
<div className="p-4 md:p-6 lg:p-8" />

// Custom breakpoints
<div className="2.15xl:grid-cols-4" />  // 1600px
<div className="2.5xl:w-1/5" />         // 1700px
```

### States

```typescript
<button className="
  bg-button-primary-bg-default
  hover:bg-button-primary-bg-hover
  active:bg-button-primary-bg-selected
  disabled:bg-button-primary-bg-disabled
  disabled:cursor-not-allowed
  focus:ring-2
  focus:ring-purple-600
  transition-colors
" />

<input className="
  bg-input-background-enabled
  text-input-on-bg-enabled
  border border-input-stroke
  focus:border-purple-800
  focus:text-input-on-bg-focused
  focus:outline-hidden
  placeholder:text-input-on-bg-disabled
" />
```

### Animations

```typescript
// Project animations
<div className="animate-accordion-down" />
<div className="animate-accordion-up" />
<div className="animate-progress-bar-stripes" />

// Transitions
<div className="transition-colors duration-200" />
<div className="transition-opacity duration-300" />
<div className="transition-transform duration-150 ease-out" />
```

---

## Quick Reference

### Do's ✅
- Use semantic color classes from the design system
- Use `cn()` only for conditional/merged classes
- Use CVA for components with variants
- Use `gap` instead of `space-*`
- Specify border colors explicitly
- Use opacity modifiers (`bg-purple-800/50`)
- Use V2 spacing for accessibility-critical UI

### Don'ts ❌
- Never use `var()` in className
- Never use hex colors in className
- Never use `cn()` for static classes
- Never use deprecated opacity utilities
- Never use `space-*` for new code (use gap)
- Never assume border color (specify it)

### File Conventions
| Token Type | Location |
|------------|----------|
| Colors | `tailwind.config.ts` → `theme.extend.colors` |
| Spacing | `tailwind.config.ts` → `theme.extend.spacing` |
| Typography | `tailwind.config.ts` → `theme.extend.fontSize` |
| Custom utilities | `tailwind.config.ts` → `plugins` |
| CSS variables | `app/globals.css` |
