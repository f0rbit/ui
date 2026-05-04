# Component Consolidation Plan: ChipInput, Tree, MultiSelect

## Executive Summary

Three new components (ChipInput, Tree, MultiSelect) have been added to the @f0rbit/ui library with several patterns that violate the library's component reuse principles:

1. **Raw `<button>` elements** instead of the `<Button>` component (ChipInput, MultiSelect)
2. **Duplicate CSS** for chip removal buttons (shared between ChipInput and MultiSelect)
3. **Inline SVG icons** duplicated across components instead of a shared Icon approach
4. **Minor CSS redundancy** that could leverage existing styles

**Positive observations**: Tree and MultiSelect already use `<Button>` in some places, and all three components correctly use `<Badge>` for chips/tags.

---

## Detailed Analysis by Component

### 1. ChipInput.tsx

**Current Issues:**

| Line | Issue | Current Code | Should Be |
|------|-------|--------------|-----------|
| 67-77 | Raw `<button>` for chip removal | `<button type="button" class="chip-input-remove" ...>` | `<Button variant="ghost" icon size="sm" ...>` |
| 74-76 | Inline close SVG icon | Raw SVG | Shared CloseIcon component |

**Component Reuse Opportunities:**
- The remove button should use `<Button variant="ghost" icon size="sm">` with a close icon
- Consider enhancing Badge to accept an optional `onRemove` callback, which would make removable badges a first-class pattern

**CSS Analysis (lines 1059-1110 in components.css):**
- `.chip-input` (1059-1069) - **KEEP**: Unique wrapper styling
- `.chip-input:focus-within` (1071-1073) - **KEEP**: Input focus state
- `.chip-input-disabled` (1075-1078) - **KEEP**: Disabled state
- `.chip-input-chip` (1080-1083) - **MODIFY**: Only adds `gap`, could be inline or merged
- `.chip-input-remove` (1085-1099) - **REMOVE**: Replace with Button component styling
- `.chip-input-field` (1101-1109) - **KEEP**: Unique inline input styling

---

### 2. Tree.tsx

**Current Issues:**

This component is **well-implemented** and already uses:
- `<Button variant="ghost" icon size="sm">` for the expand/collapse toggle (line 108-117)
- `<Chevron>` component for the indicator (line 116)

**No changes needed to the component itself.**

**CSS Analysis (lines 1111-1200 in components.css):**
- All Tree CSS is **unique and necessary** for the tree structure
- `.tree-node-toggle` (1133-1135) overrides Button padding - this is **acceptable** as a contextual override

**Minor Note:** The tree toggle button has `padding: 2px` override. This could potentially be avoided if Button supported an `xs` size or if `btn-icon` + `btn-sm` combination produced appropriate sizing. However, this is a minor issue and the current approach is fine.

---

### 3. MultiSelect.tsx

**Current Issues:**

| Line | Issue | Current Code | Should Be |
|------|-------|--------------|-----------|
| 144-155 | Raw `<button>` for badge removal | `<button type="button" class="multi-select-remove" ...>` | `<Button variant="ghost" icon size="sm" ...>` |
| 151-153 | Inline close SVG icon | Raw SVG | Shared CloseIcon component |
| 192-208 | Raw `<button>` for dropdown options | `<button type="button" class="dropdown-item" ...>` | Could use `<DropdownItem>` |

**Component Reuse Opportunities:**

1. **Badge removal button**: Same issue as ChipInput - use `<Button>` or enhance Badge with `onRemove`
2. **Dropdown options**: Currently uses raw `<button class="dropdown-item">`. Could use `<DropdownItem>` component, BUT this would require changes since:
   - DropdownItem auto-closes dropdown via context (which MultiSelect doesn't use)
   - DropdownItem doesn't support `disabled` forwarding properly
   - Decision: Keep raw buttons but document this is intentional

**CSS Analysis (lines 1202-1249 in components.css):**
- `.multi-select` (1203-1205) - **KEEP but SIMPLIFY**: Only `position: relative`, dropdown class already provides this
- `.multi-select-disabled` (1207-1210) - **KEEP**: Unique disabled state
- `.multi-select-header` (1212-1216) - **KEEP**: Unique layout
- `.multi-select-selected` (1218-1225) - **KEEP**: Unique layout
- `.multi-select-badge` (1080-1083, combined with chip-input-chip) - **KEEP**: Shared between both
- `.multi-select-remove` (1085-1099, combined with chip-input-remove) - **REMOVE**: Replace with Button
- `.multi-select-menu` (1227-1239) - **REVIEW**: Extends `.dropdown-menu`, some overlap
- `.multi-select-empty` (1245-1249) - **KEEP**: Could reuse `.empty` pattern but this is simpler

---

## Shared Patterns to Extract

### 1. Removable Badge Pattern

Both ChipInput and MultiSelect have identical patterns for badges with close buttons. Two approaches:

**Option A: Enhance Badge component** (Recommended)
```tsx
interface BadgeProps {
  // ... existing props
  onRemove?: (e: MouseEvent) => void;  // NEW
  removeLabel?: string;                 // NEW
}
```

**Option B: Create a shared CloseIcon component**
```tsx
// In src/components/icons/Close.tsx
export function CloseIcon(props: { size?: number | string }) {
  return (
    <svg width={props.size ?? 12} height={props.size ?? 12} viewBox="0 0 24 24" 
         fill="none" stroke="currentColor" stroke-width="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
```

**Recommendation**: Option A is cleaner - make Badge support `onRemove` directly.

---

## CSS to Remove/Consolidate

### Lines to DELETE entirely (after refactoring):
```css
/* These become unnecessary when using Button for remove actions */
.chip-input-remove,
.multi-select-remove {
  /* lines 1085-1099 - all of this */
}
```

### Lines to KEEP:
All other CSS is either unique to the component's layout or provides necessary contextual overrides.

---

## Prioritized Action Items

### Phase 1: Extract Shared Icon (Low effort, High reuse)
**Est: ~20 LOC**

1. Create `src/components/icons/Close.tsx` with a reusable close/X icon
2. Update Modal.tsx to use it (removes duplicate SVG there too)

### Phase 2: Enhance Badge with onRemove (Medium effort, High impact)
**Est: ~30 LOC changes**

1. Add `onRemove?: (e: MouseEvent) => void` and `removeLabel?: string` to Badge props
2. When `onRemove` is provided, render a `<Button variant="ghost" icon size="sm">` with CloseIcon
3. Add minimal CSS for badge-remove button positioning (if needed, likely just `margin-left: auto`)

### Phase 3: Refactor ChipInput (Low effort)
**Est: ~-15 LOC (net reduction)**

1. Remove inline close SVG and raw button
2. Use enhanced Badge with `onRemove` prop
3. Delete `.chip-input-remove` CSS

### Phase 4: Refactor MultiSelect (Low effort)  
**Est: ~-15 LOC (net reduction)**

1. Remove inline close SVG and raw button from badge removal
2. Use enhanced Badge with `onRemove` prop
3. Keep dropdown options as raw buttons (intentional - see analysis)
4. Delete `.multi-select-remove` CSS

### Phase 5: CSS Cleanup (Low effort)
**Est: ~-20 LOC CSS**

1. Remove the combined `.chip-input-remove, .multi-select-remove` block (~15 lines)
2. Remove `.chip-input-chip, .multi-select-badge` if Badge handles its own gap (or keep if needed)
3. Verify `.multi-select` class is needed (dropdown already provides position: relative)

---

## Task Breakdown for Parallel Execution

### Phase 1: Foundation (Sequential - must complete first)
| Task | Files | Est LOC | Dependencies |
|------|-------|---------|--------------|
| Create CloseIcon component | `src/components/icons/Close.tsx` (new) | +15 | None |
| Export from index | `src/components/index.ts` | +1 | Above |

### Phase 2: Badge Enhancement (Sequential - depends on Phase 1)
| Task | Files | Est LOC | Dependencies |
|------|-------|---------|--------------|
| Add onRemove to Badge | `src/components/Badge.tsx` | +20 | Phase 1 |
| Add Badge CSS for remove button | `src/styles/components.css` | +5 | Above |

### Phase 3: Component Refactors (Parallel - all depend on Phase 2)
| Task | Files | Est LOC | Can Parallelize |
|------|-------|---------|-----------------|
| Refactor ChipInput | `src/components/ChipInput.tsx` | -12 | Yes |
| Refactor MultiSelect | `src/components/MultiSelect.tsx` | -12 | Yes |
| Update Modal to use CloseIcon | `src/components/Modal.tsx` | -3 | Yes |

### Phase 4: CSS Cleanup (Sequential - depends on Phase 3)
| Task | Files | Est LOC | Dependencies |
|------|-------|---------|--------------|
| Remove unused CSS | `src/styles/components.css` | -15 | Phase 3 |

---

## Net Impact Summary

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| New CloseIcon component | 0 | ~15 LOC | +15 |
| Badge.tsx | ~39 LOC | ~60 LOC | +21 |
| ChipInput.tsx | ~93 LOC | ~81 LOC | -12 |
| MultiSelect.tsx | ~217 LOC | ~205 LOC | -12 |
| Modal.tsx | ~107 LOC | ~104 LOC | -3 |
| components.css | ~1251 LOC | ~1236 LOC | -15 |
| **Total** | | | **-6 LOC** |

The goal isn't LOC reduction - it's **consistency** and **reuse**. After this refactor:
- All clickable elements use `<Button>`
- All removable badges use the same pattern
- No duplicate SVG icons
- CSS is minimal and purposeful

---

## Limitations & Notes

1. **DropdownItem not used in MultiSelect**: Intentional - the existing DropdownItem component auto-closes via context and doesn't fit MultiSelect's UX (user may want to select multiple items without the dropdown closing)

2. **Tree component is well-implemented**: No changes needed

3. **No backwards compatibility concerns**: These are new components, no existing consumers to break

4. **Testing note**: After refactoring, ensure:
   - ChipInput chip removal still works (click, keyboard)
   - MultiSelect badge removal still works
   - Modal close button still works
   - Disabled states are properly forwarded
