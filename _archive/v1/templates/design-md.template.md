# DESIGN.md Template

# [Project Name] Design System

## 1. Design Philosophy
[Describe the core philosophy in 3-5 sentences. What kind of interfaces are you trying to create? What do you explicitly avoid?]

### Surface Register
Primary register: [brand / product / system]

- Brand surfaces: [how expressive/public-facing work should feel]
- Product surfaces: [how app/dashboard/workflow UI should behave]
- System surfaces: [how tokens/components/templates prove repeatability]
- Anti-references: [visual or UX directions to avoid]

## 2. Core Principles
### Hierarchy & Scanning
### Spacing & Rhythm
### Components
### Responsiveness
### Accessibility

## 3. Visual Language
### Color
### Typography
### Elevation & Depth
### Motion

## 4. Do / Don't
**Do**
- ...

**Don't**
- ...

## 5. Component Philosophy
[Brief guidance on how major components should behave and compose.]

## 6. Reusable Patterns
Define the named pieces Claude Design should preserve when the design is later moved to code.

- Layouts:
  - `MarketingLayout`
  - `AppShell`
- Navigation:
  - `MarketingNav`
  - `AppNav`
- Primitives:
  - `Button`
  - `Card`
  - `SectionHeader`
- Page patterns:
  - `Hero`
  - `DashboardFrame`

## 7. Framework Handoff
Preferred handoff target: [Astro / Vite / Next].

- Astro when the output is mostly marketing, editorial, or static content.
- Vite when the output is an interactive app or dashboard prototype.
- Next only when SSR, SEO-heavy React routes, or team conventions require it.
