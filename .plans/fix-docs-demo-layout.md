# Fix Broken Flex/Layout in Docs Demo Sections

## Executive Summary

The docs site demo components use **6 CSS classes that don't exist** in any stylesheet:
- `.demo-section` - Used in ALL 14 demo components
- `.demo-row` - Used for horizontal flex layouts
- `.demo-stack` - Used for vertical stacking (inputs, etc.)
- `.demo-grid` - Used for grid layouts (stats)
- `.demo-row-between` - Used for space-between rows (status demo)
- `.demo-hint` - Used for helper text (dropdown demo)

These missing styles cause all demo content within `.demo-preview` to collapse into a centered blob with no visual structure.

## Root Cause Analysis

### Current State
```css
/* custom.css - ONLY demo styles defined */
.demo-container { ... }
.demo-header { ... }
.demo-title { ... }
.demo-preview {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  align-items: center;
  justify-content: center;  /* <-- This centers EVERYTHING */
}
```

### Problem
The `.demo-preview` creates a centered flex container, but all content inside (sections, rows, etc.) have no defined styles. This means:

1. **No visual separation** between demo sections (Variants, Sizes, States, etc.)
2. **No proper flow direction** for rows vs stacks
3. **Headers (`<h4>`)** rendered inline with demo content
4. **Full-width components** (inputs, cards) collapse without width constraints

### Impact by Component

| Demo Component | Classes Used | Severity |
|----------------|--------------|----------|
| ButtonDemo | `.demo-section`, `.demo-row` | High - buttons jumbled together |
| CardDemo | `.demo-section`, `.demo-row` | High - cards not laid out properly |
| InputDemo | `.demo-section`, `.demo-stack` | Critical - inputs need stacking |
| StatDemo | `.demo-section`, `.demo-row`, `.demo-grid` | High - grid layout broken |
| StatusDemo | `.demo-section`, `.demo-row`, `.demo-stack`, `.demo-row-between` | Critical |
| DropdownDemo | `.demo-section`, `.demo-row`, `.demo-hint` | Medium |
| StepperDemo | `.demo-section` | Medium - stepper has own layout |
| EmptyDemo | `.demo-section` | Medium - sections not separated |
| ClampDemo | `.demo-section` | Medium |
| CollapsibleDemo | `.demo-section`, `.demo-row` | Medium |
| ModalDemo | `.demo-section`, `.demo-row` | Low - mostly button triggers |
| BadgeDemo | `.demo-section`, `.demo-row` | Medium |
| SpinnerDemo | `.demo-section`, `.demo-row` | Low |
| ChevronDemo | `.demo-section`, `.demo-row` | Low |

## Recommended Solution

### Option A: Add Missing Classes to custom.css (Recommended)
**Pros**: Simple, contained to docs site, no library changes
**Cons**: None significant

### Option B: Refactor Demos to Use Existing Utility Classes
**Pros**: Uses library's own utilities (`.stack`, `.row`, `.grid`)
**Cons**: Requires changing all 14 demo components

**Recommendation**: Option A - Add the missing CSS classes. The demo classes serve a specific documentation purpose and having dedicated classes makes the demos self-documenting.

---

## Files to Modify

| File | Change Type | Priority |
|------|-------------|----------|
| `docs/src/styles/custom.css` | Add missing demo utility classes | P0 - Critical |

---

## Detailed CSS Fixes

### Add to `docs/src/styles/custom.css`:

```css
/* ===== Demo Layout Utilities ===== */

/* Demo section - vertical grouping with header */
.demo-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  width: 100%;
  text-align: left;
}

.demo-section h4 {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--fg);
  margin: 0 0 var(--space-xs) 0;
}

.demo-section + .demo-section {
  margin-top: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid var(--border);
}

/* Demo row - horizontal flex for inline items */
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  align-items: center;
}

/* Demo row with space-between */
.demo-row-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

/* Demo stack - vertical stacking for form elements */
.demo-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  width: 100%;
  max-width: 320px;
}

/* Demo grid - for stat/card grids */
.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-sm);
  width: 100%;
}

/* Demo hint text */
.demo-hint {
  font-size: var(--text-sm);
  color: var(--fg-subtle);
  margin: 0;
}
```

### Modify `.demo-preview` to Better Support Sections:

```css
.demo-preview {
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;  /* Changed from row-based wrap */
  gap: var(--space-md);
  align-items: stretch;     /* Changed from center */
}
```

---

## Task Breakdown

### Task 1: Add Demo Layout CSS Classes (Est: ~40 LOC)
**File**: `docs/src/styles/custom.css`

Add the following classes after the existing `.demo-preview` definition:
- `.demo-section` - Container for each demo section
- `.demo-section h4` - Section header styling
- `.demo-section + .demo-section` - Separator between sections
- `.demo-row` - Horizontal flex row
- `.demo-row-between` - Row with space-between
- `.demo-stack` - Vertical stack for form inputs
- `.demo-grid` - CSS grid for stats/cards
- `.demo-hint` - Helper text styling

### Task 2: Update `.demo-preview` (Est: ~5 LOC)
**File**: `docs/src/styles/custom.css`

Change from centered horizontal flex to vertical column layout to properly contain sections.

---

## Implementation Order

### Phase 1: CSS Fix (Single Task - No Parallelization Needed)

| Task | File | Changes | Est LOC | Deps |
|------|------|---------|---------|------|
| 1.1 | `docs/src/styles/custom.css` | Update `.demo-preview`, add 6 new classes | ~45 | None |

**Verification**: After changes, visually inspect all component docs pages to confirm:
- Sections visually separated with dividers
- Headers properly styled and positioned
- Row items (buttons, badges) properly spaced horizontally
- Stack items (inputs) properly stacked vertically
- Grid items (stats) in responsive grid
- Cards displayed with proper width

---

## Final CSS to Add (Complete)

```css
/* 
 * Update existing .demo-preview 
 */
.demo-preview {
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  align-items: stretch;
}

/* 
 * ADD: Demo section - groups related demos with a header 
 */
.demo-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  width: 100%;
  text-align: left;
}

.demo-section h4 {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--fg);
  margin: 0 0 var(--space-xs) 0;
}

.demo-section + .demo-section {
  margin-top: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid var(--border);
}

/* 
 * ADD: Horizontal row for inline elements (buttons, badges, etc.)
 */
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  align-items: center;
}

/* 
 * ADD: Row with justify space-between
 */
.demo-row-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

/* 
 * ADD: Vertical stack for form elements
 */
.demo-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  width: 100%;
  max-width: 320px;
}

/* 
 * ADD: Grid layout for stats/cards
 */
.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-sm);
  width: 100%;
}

/* 
 * ADD: Hint/helper text
 */
.demo-hint {
  font-size: var(--text-sm);
  color: var(--fg-subtle);
  margin: 0;
}
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| CSS conflicts with Starlight | Low | Medium | Demo classes use unique `demo-` prefix |
| CSS specificity issues | Low | Low | All classes are single-class selectors |
| Breaking other pages | Very Low | Low | Changes only affect `.demo-*` classes |

---

## Success Criteria

1. ✅ All demo components render with proper visual structure
2. ✅ Section headers (`<h4>`) display above their content
3. ✅ Horizontal rows of buttons/badges properly spaced
4. ✅ Form inputs stack vertically with consistent width
5. ✅ Stats display in responsive grid
6. ✅ Visual separators between demo sections
7. ✅ No layout regression on other doc pages

---

## Backwards Compatibility Note

**No breaking changes** - this is purely additive CSS. The demo components already use these class names; they just weren't defined yet. After this fix, the existing demo component code will work as intended without modification.
