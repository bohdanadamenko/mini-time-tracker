# Design System - Mini Time Tracker

## Overview
Modern, intuitive design focused on productivity and ease of use. The interface features a blue gradient color scheme with comprehensive light/dark mode support.

## Color Palette

### Light Mode
- **Background**: `#fafafa` - Soft gray background
- **Primary**: `#2563eb` - Vibrant blue for CTAs and highlights
- **Card**: `#ffffff` - Clean white cards
- **Border**: `#e2e8f0` - Subtle borders
- **Muted**: `#f8fafc` - Light accents
- **Success**: `#10b981` - Green for positive actions
- **Destructive**: `#ef4444` - Red for delete actions

### Dark Mode
- **Background**: `#0f172a` - Deep slate background
- **Primary**: `#3b82f6` - Bright blue for visibility
- **Card**: `#1e293b` - Elevated dark cards
- **Border**: `#334155` - Subtle dark borders
- **Muted**: `#1e293b` - Dark accents

## Typography
- **Font Family**: Geist Sans (Primary), Geist Mono (Code)
- **Headings**: Bold, clear hierarchy
- **Body**: Clean, readable 14-16px
- **Labels**: Semi-bold, 12-14px with icons

## Components

### Header
- **Sticky positioned** for always-visible navigation
- **Backdrop blur** for modern glass effect
- **Logo + Title** with gradient accent
- **Stats display** showing total entries

### Time Entry Form
- **Card-based** with shadow on hover
- **Icon labels** for visual clarity
- **Rounded inputs** (11px height) with hover effects
- **Gradient button** with scale animation
- **Loading states** with spinner

### Entry History
- **Grouped by date** with daily totals
- **Card design** with gradient headers
- **Project badges** with icons
- **Hover states** reveal delete action
- **Empty state** with helpful message

### Toast Notifications
- **4 types**: Success (green), Error (red), Warning (yellow), Info (blue)
- **Auto-dismiss** after 5 seconds
- **Slide-in animation** from right
- **Icon integration** for quick recognition

## Animations

### Timing
- **Fast**: 200ms - Micro-interactions (button hover, scale)
- **Medium**: 300ms - Component transitions (fade, slide)
- **Slow**: 400ms - Page transitions (slide-up)

### Types
1. **Fade In**: Opacity 0 → 1
2. **Slide Up**: TranslateY(10px) → 0
3. **Slide In**: TranslateX(100%) → 0 (toasts)
4. **Scale**: Scale(0.95) → 1
5. **Pulse**: Animate scale for attention

### Implementation
```css
.animate-fade-in { animation: fade-in 0.3s ease-out }
.animate-slide-up { animation: slide-up 0.4s ease-out }
.animate-scale-in { animation: scale-in 0.2s ease-out }
```

## Responsive Design

### Breakpoints
- **Mobile**: < 640px - Single column, stacked layout
- **Tablet**: 640px - 1024px - 2 column grid
- **Desktop**: > 1024px - 3 column grid with sidebar

### Layout Strategy
- **Container**: Max-width 1280px, centered
- **Spacing**: 4-8 scale (16px, 32px, 64px)
- **Grid**: CSS Grid for main layout, Flexbox for components

## Accessibility

### Features
- **Focus states**: Visible ring on all interactive elements
- **Color contrast**: WCAG AA compliant
- **Keyboard navigation**: Full support
- **Screen readers**: Semantic HTML with ARIA labels
- **Loading states**: Clear indicators

## Icons
- **Library**: Lucide React
- **Size**: 16px (sm), 20px (md), 24px (lg)
- **Usage**: Labels, buttons, status indicators
- **Color**: Inherit from text or custom (primary, muted)

## Best Practices

### Performance
- **Lazy loading**: Images and heavy components
- **Optimized animations**: GPU-accelerated transforms
- **Minimal re-renders**: Memoization where needed

### UX Principles
1. **Feedback**: Every action gets visual confirmation
2. **Clarity**: Clear labels with icons
3. **Consistency**: Same patterns throughout
4. **Forgiveness**: Confirmations for destructive actions
5. **Speed**: Fast interactions, no unnecessary delays

## Component Guidelines

### Cards
```tsx
- Border: border-border/50
- Shadow: shadow-md
- Hover: shadow-lg
- Padding: p-5 (content), p-4 (header)
- Border radius: rounded-lg
```

### Buttons
```tsx
Primary: bg-primary text-primary-foreground
Ghost: hover:bg-accent
Size sm: h-8 px-3
Size default: h-10 px-4
Size lg: h-11 px-8
```

### Forms
```tsx
Labels: font-semibold with icon
Inputs: h-11 rounded-lg
Focus: ring-2 ring-primary
Hover: border-primary/50
```

## Future Enhancements
- [ ] Custom illustrations for empty states
- [ ] Advanced charts for statistics
- [ ] Customizable color themes
- [ ] Export/print layouts
- [ ] Mobile-specific optimizations
