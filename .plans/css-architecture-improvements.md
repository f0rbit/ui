# CSS Architecture Improvements Plan

## Executive Summary

After analyzing the CSS architecture across `tokens.css`, `components.css`, `utilities.css`, `reset.css`, and the docs stylesheets, I've identified **17 actionable improvements** organized by priority. The codebase is already well-structured with CSS layers and design tokens, but there are opportunities to improve consistency, reduce hardcoded values, and simplify complex patterns.

---

## Priority 1: Design Token Gaps (High Impact)

### 1.1 Add Missing Semantic Tokens

**Problem:** Several hardcoded values should be tokens for theming consistency.

| Current Value | Suggested Token | Usage Count |
|---------------|-----------------|-------------|
| `9999px` | `--radius-pill` | 3 (badge, status) |
| `0.5` | `--opacity-disabled` | 3 (btn, input, empty-icon) |
| `rgb(0 0 0 / 0.5)` | `--overlay-bg` | 1 (overlay) |
| `100` | `--z-overlay` | 2 (overlay, dropdown-menu) |
| `1` | `--z-above` | 1 (step-indicator) |

**Files affected:** `tokens.css`, `components.css`  
**Estimated effort:** ~30 LOC changed

```css
/* tokens.css - Add to :root */
--radius-pill: 9999px;
--opacity-disabled: 0.5;
--overlay-bg: rgb(0 0 0 / 0.5);
--z-overlay: 100;
--z-above: 1;
```

### 1.2 Add Font Weight Tokens

**Problem:** `font-weight: 500`, `600`, `700` appear 20+ times but only `--font-semibold: 600` exists.

**Suggested tokens:**
```css
--font-medium: 500;
--font-semibold: 600;  /* exists */
--font-bold: 700;
```

**Files affected:** `tokens.css`, `components.css`, `utilities.css`  
**Estimated effort:** ~25 LOC changed

### 1.3 Add Component Size Tokens

**Problem:** Stepper uses hardcoded `32px`, `16px` for indicator sizing. Status dot uses `6px`.

**Suggested tokens:**
```css
--size-indicator: 32px;
--size-indicator-sm: 16px;
--size-dot: 6px;
```

**Files affected:** `tokens.css`, `components.css`  
**Estimated effort:** ~15 LOC changed

---

## Priority 2: Architecture Simplification (Medium Impact)

### 2.1 Extract Shared "Pill" Base Style

**Problem:** Badge and Status share identical pill styling but define it separately.

**Current (duplicated):**
```css
.badge {
    border-radius: 9999px;
    padding: 2px var(--space-sm);
    font-size: var(--text-xs);
    /* ... */
}

.status {
    border-radius: 9999px;
    padding: 2px var(--space-sm);
    font-size: var(--text-xs);
    /* ... */
}
```

**Suggested:** Either use CSS custom properties inheritance or a shared `.pill` utility:
```css
/* Option A: Utility class */
.pill {
    border-radius: var(--radius-pill);
    padding: 2px var(--space-sm);
    font-size: var(--text-xs);
}

/* Option B: Just use token - simpler, less breaking */
/* Keep current structure but use --radius-pill token */
```

**Recommendation:** Option B (token only) - less invasive, no component API changes.  
**Files affected:** `components.css`  
**Estimated effort:** ~10 LOC changed

### 2.2 Extract Shared Header/Footer Patterns

**Problem:** Modal and Card have nearly identical header/footer styles.

**Current:**
```css
.card-header, .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    /* ... */
}
.card-footer, .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-sm);
    /* ... */
}
```

**Analysis:** These are semantically different (card vs modal context) and the duplication is minimal. **No action recommended** - the clarity of separate definitions outweighs DRY concerns here.

### 2.3 Consolidate Badge Variant Pattern

**Problem:** Badge variants repeat `border-color: transparent`.

**Current:**
```css
.badge-success { background: var(--success); color: var(--success-fg); border-color: transparent; }
.badge-error { background: var(--error); color: var(--error-fg); border-color: transparent; }
.badge-warning { background: var(--warning); color: var(--warning-fg); border-color: transparent; }
.badge-info { background: var(--info); color: var(--info-fg); border-color: transparent; }
.badge-accent { background: var(--accent); color: var(--accent-fg); border-color: transparent; }
```

**Suggested:** Use `:where()` selector to reduce repetition:
```css
.badge:where(.badge-success, .badge-error, .badge-warning, .badge-info, .badge-accent) {
    border-color: transparent;
}
.badge-success { background: var(--success); color: var(--success-fg); }
/* etc */
```

**Trade-off:** Slightly more complex selector vs 5 fewer `border-color` declarations.  
**Recommendation:** Low priority - current approach is clear and maintainable.  
**Estimated effort:** ~10 LOC changed

---

## Priority 3: Specificity & Selector Improvements (Medium Impact)

### 3.1 Remove `!important` Where Possible

**Problem:** 5 uses of `!important`, only 2 are truly necessary.

| Location | Rule | Assessment |
|----------|------|------------|
| `components.css:708` | `.tab { margin-bottom: -1px !important; }` | **Questionable** - fix the source issue instead |
| `starlight.css:82` | `main { padding-bottom: unset !important; }` | **Necessary** - overriding Starlight |
| `reset.css:88-90` | `prefers-reduced-motion` rules | **Necessary** - accessibility override |

**Action:** Investigate tab margin issue - the negative margin hack with `!important` suggests a structural problem.

**Files affected:** `components.css`  
**Estimated effort:** ~5 LOC investigation/fix

### 3.2 Simplify Overly Specific Selectors

**Problem:** Some selectors have unnecessary specificity.

```css
/* Current - unnecessarily specific */
.stepper-horizontal .step:last-child .step-connector { display: none; }
.stepper-vertical .step:last-child .step-connector { display: none; }

/* Simplified - both do the same thing */
.step:last-child .step-connector { display: none; }
```

**Files affected:** `components.css`  
**Estimated effort:** ~5 LOC

### 3.3 Use `:where()` for Low-Specificity Variants

**Problem:** Button hover selectors could use `:where()` for easier overrides.

```css
/* Current */
.btn:hover:not(:disabled) { border-color: var(--fg-faint); }

/* Could be */
.btn:where(:hover:not(:disabled)) { border-color: var(--fg-faint); }
```

**Trade-off:** Better for library consumers but less intuitive.  
**Recommendation:** Low priority - current specificity is reasonable.

---

## Priority 4: Missing Utilities (Low Impact)

### 4.1 Add Gap Utilities

**Problem:** No standalone gap utilities; users must use `.row-sm`, `.stack-sm` etc.

**Suggested:**
```css
.gap-xs { gap: var(--space-xs); }
.gap-sm { gap: var(--space-sm); }
.gap-md { gap: var(--space-md); }
.gap-lg { gap: var(--space-lg); }
```

**Files affected:** `utilities.css`  
**Estimated effort:** ~10 LOC

### 4.2 Add Padding/Margin Utilities

**Problem:** No spacing utilities for one-off adjustments.

**Suggested (minimal set):**
```css
.p-0 { padding: 0; }
.p-sm { padding: var(--space-sm); }
.p-md { padding: var(--space-md); }
.m-0 { margin: 0; }
/* etc - keep minimal */
```

**Trade-off:** Utility bloat vs flexibility.  
**Recommendation:** Only add if there's demonstrated need. Current layout utilities may be sufficient.

### 4.3 Add `text-center` Utility

**Problem:** `.center` is for max-width containers, not text alignment.

```css
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }
```

**Files affected:** `utilities.css`  
**Estimated effort:** ~5 LOC

---

## Priority 5: Dead Code Removal (Low Impact)

### 5.1 Audit Unused CSS

**Potential dead code:**
- `.card-content` - empty ruleset (just a comment)
- `.card-icon` - verify if used anywhere

**Action:** Run CSS coverage analysis or grep for class usage.

```bash
# Check if .card-icon is used
grep -r "card-icon" --include="*.tsx" --include="*.astro"
```

**Files affected:** `components.css`  
**Estimated effort:** ~5 LOC investigation

### 5.2 Remove `.card-content` Empty Ruleset

**Current:**
```css
.card-content {
    /* Content wrapper - card already provides padding */
}
```

**Action:** Either add actual styles or remove the empty rule.

---

## Priority 6: Modern CSS Opportunities (Future/Optional)

### 6.1 CSS Nesting (When Supported)

**Current:**
```css
.btn { /* base */ }
.btn:hover:not(:disabled) { /* hover */ }
.btn:disabled { /* disabled */ }
.btn-secondary { /* variant */ }
```

**With nesting:**
```css
.btn {
    /* base */
    &:hover:not(:disabled) { /* hover */ }
    &:disabled { /* disabled */ }
    &-secondary { /* variant */ }
}
```

**Status:** Native CSS nesting has ~90% browser support. Consider for v2.  
**Trade-off:** Cleaner source vs broader compatibility.

### 6.2 Container Queries

**Potential use:** Theme playground responsive behavior, card layouts.

**Current:**
```css
@media (max-width: 768px) {
    .theme-playground { grid-template-columns: 1fr; }
}
```

**With container queries:**
```css
.theme-playground {
    container-type: inline-size;
}
@container (max-width: 600px) {
    .theme-controls { /* responsive styles */ }
}
```

**Status:** Good support (~90%). Consider for components that resize independently of viewport.

### 6.3 `:has()` Selector

**Potential use:** The starlight.css already uses `:has()` for conditional hiding:
```css
.content-panel:has(.splash-title-placeholder) { display: none; }
```

**Other opportunities:**
- `.card:has(.card-footer)` for conditional spacing
- `.dropdown:has(.dropdown-menu:not([hidden]))` for open state

**Status:** Good support (~90%). Already used, can expand usage.

---

## Priority 7: Consistency Fixes (Low Impact)

### 7.1 Inconsistent Token Format

**Problem:** Tokens mix `%` and decimal lightness values in OKLCH.

```css
/* Percentage format */
--bg: oklch(99% 0.02 290);
--fg: oklch(1% 0.02 290);

/* Decimal format */
--success: oklch(0.95 0.05 150);
--error: oklch(0.95 0.05 20);
```

**Action:** Standardize on one format (decimals preferred for consistency with OKLCH spec).

**Files affected:** `tokens.css`  
**Estimated effort:** ~15 LOC

### 7.2 Tab Indentation in Dark Mode

**Problem:** Dark mode success/error/warning/info tokens have inconsistent indentation.

```css
@media (prefers-color-scheme: dark) {
    :root {
        --bg: oklch(21% 0.015 280);
        /* ... properly indented ... */
        
    --success: oklch(0.35 0.05 150);  /* <-- wrong indentation */
    --success-fg: oklch(0.85 0.1 150);
```

**Action:** Fix indentation.

**Files affected:** `tokens.css`  
**Estimated effort:** ~10 LOC

---

## Summary Table

| Priority | Issue | Impact | Effort | Recommendation |
|----------|-------|--------|--------|----------------|
| 1.1 | Semantic tokens (pill, opacity, z-index) | High | ~30 LOC | **Do** |
| 1.2 | Font weight tokens | High | ~25 LOC | **Do** |
| 1.3 | Component size tokens | Medium | ~15 LOC | **Do** |
| 2.1 | Pill base style | Low | ~10 LOC | Token only |
| 2.2 | Header/footer patterns | Low | 0 | Skip |
| 2.3 | Badge variant consolidation | Low | ~10 LOC | Optional |
| 3.1 | Remove !important | Medium | ~5 LOC | Investigate |
| 3.2 | Simplify stepper selectors | Low | ~5 LOC | **Do** |
| 3.3 | :where() for variants | Low | 0 | Skip |
| 4.1 | Gap utilities | Low | ~10 LOC | Optional |
| 4.2 | Padding/margin utilities | Low | 0 | Skip |
| 4.3 | Text alignment utilities | Low | ~5 LOC | **Do** |
| 5.1 | Audit unused CSS | Low | ~5 LOC | **Do** |
| 5.2 | Remove empty .card-content | Low | ~2 LOC | **Do** |
| 6.x | Modern CSS (nesting, containers) | Future | - | Track |
| 7.1 | OKLCH format consistency | Low | ~15 LOC | **Do** |
| 7.2 | Fix token indentation | Low | ~10 LOC | **Do** |

---

## Recommended Action Items (In Order)

### Phase 1: Token Consolidation (~70 LOC)
1. Add `--radius-pill`, `--opacity-disabled`, `--overlay-bg` tokens
2. Add `--z-overlay`, `--z-above` z-index tokens  
3. Add `--font-medium`, `--font-bold` tokens
4. Add `--size-indicator`, `--size-dot` tokens
5. Fix OKLCH format inconsistency (use decimals)
6. Fix dark mode indentation

### Phase 2: Component Cleanup (~25 LOC)
1. Update components to use new tokens
2. Simplify stepper `:last-child` selectors
3. Investigate tab `!important` issue
4. Remove empty `.card-content` ruleset

### Phase 3: Utility Additions (~15 LOC)
1. Add `text-center`, `text-left`, `text-right` utilities
2. Add gap utilities if needed

### Phase 4: Audit & Modern CSS (Future)
1. Run CSS coverage audit
2. Evaluate CSS nesting adoption
3. Consider container queries for isolated components

---

## Breaking Changes

**None.** All recommended changes are additive or internal refactors that don't affect the public API.

