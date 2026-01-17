# Changelog

## [2.0.0] - 2026-01-17

### 🎨 Major Design Overhaul

#### Visual Design
- **New Color Scheme**: Modern blue gradient palette with improved contrast
- **Dark Mode**: Full dark mode support that respects system preferences
- **Gradients**: Subtle gradients throughout the UI for depth
- **Shadows**: Layered shadow system for card elevation
- **Borders**: Refined border colors with transparency

#### Layout & Structure
- **Sticky Header**: Always-visible app header with branding
  - Logo with clock icon
  - App title and tagline
  - Total entries counter
  - Backdrop blur effect
- **Welcome Section**: Eye-catching hero with gradient text
- **Responsive Grid**: Optimized 1/3 column layout (form/history)
- **Better Spacing**: Improved padding and margins throughout

#### Components

**Time Entry Form**
- Icon-enhanced labels for better scannability
- Rounded inputs with hover effects
- Beautiful gradient submit button
- Loading spinner with animations
- Form description subtitle
- Better input sizing (h-11 instead of h-10)

**Entry History**
- Gradient card headers with date formatting
- Project badges with icons
- Improved typography hierarchy
- Daily total badges with icons
- Grand total card with gradient background
- Hover-revealed delete buttons
- Better empty state with icon

**Toast Notifications**
- 4 color-coded types (success, error, warning, info)
- Smooth slide-in animations
- Auto-dismiss after 5 seconds
- Icons for quick recognition

#### Animations
- **Fade In**: Smooth opacity transitions
- **Slide Up**: Entry animations for cards
- **Scale In**: Button and card micro-interactions
- **Pulse**: Attention-grabbing effects
- **Staggered Delays**: Sequential animations for lists

#### Typography
- Updated font weights (semibold labels)
- Better size hierarchy
- Improved line heights
- Icon + text combinations

### ✨ New Features

#### UI/UX
- Delete functionality with confirmation
- Better loading states with dual spinners
- Hover effects on all interactive elements
- Focus states for accessibility
- Smooth transitions throughout

#### Technical
- Optimized input components with hover states
- Better TypeScript types
- Improved component organization
- Cleaner code structure

### 🐛 Bug Fixes
- Fixed Node.js version compatibility
- Removed unused imports
- Fixed TypeScript warnings
- Improved error handling

### 📚 Documentation
- Updated README with design features
- Added DESIGN.md with design system documentation
- Updated screenshots section
- Improved setup instructions

### 🔧 Technical Improvements
- Node.js v22 support
- Updated dependencies
- Better CSS organization
- Improved animation performance

---

## [1.0.0] - 2026-01-17

### Initial Release

#### Backend
- NestJS REST API
- SQLite database with Prisma
- CRUD operations for time entries
- 24-hour daily limit validation
- Global error handling
- CORS configuration

#### Frontend
- Next.js 16 with App Router
- Tailwind CSS v4
- Basic form and history view
- Toast notifications
- TypeScript throughout

#### Features
- Add time entries
- View entry history
- Delete entries
- Daily and grand totals
- Form validation

#### Infrastructure
- Docker support
- Development scripts
- Environment configuration
- Git setup
