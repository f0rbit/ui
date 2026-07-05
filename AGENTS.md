# @f0rbit/ui

A minimal, composable UI component library for SolidJS. Single-package repo (not a monorepo) — components live flat under `src/components/`, barrel-exported from `src/index.tsx`. See `README.md` for philosophy, usage, and the component list.

## Layout

```
src/
├── components/       # SolidJS components, kebab-case filenames (button.tsx, chip-input.tsx, ...)
├── styles/           # CSS source (tokens, reset, utilities, components, starlight)
└── index.tsx         # Public barrel — every export goes through here
docs/                  # Astro + Starlight documentation site (separate bun workspace)
scripts/
├── build-css.js       # Concatenates CSS with layer ordering
└── generate-llm-docs.js  # Generates llms.txt-style docs
```

`tsup` bundles a single entry (`src/index.tsx`) into `dist/index.js` + `dist/server.js` — component filenames are an internal implementation detail, not part of the published surface. `package.json` `exports` only exposes `.` and `./styles*`.

## Scripts

```bash
bun install               # install dependencies
bun run typecheck         # tsc --noEmit
bun run build              # tsup + CSS build
bun run dev                # tsup --watch
bun run lint               # oxlint . && eslint .
bun run lint:fix           # oxlint --fix . && eslint --fix .
bun run fmt                # oxfmt .
bun run fmt:check          # oxfmt --check .
bun run docs / docs:dev / docs:build
```

There are no tests in this repo yet (component library with no headless test harness set up) — CI does not run a test step; don't add one speculatively.

## Lint & format

Toolchain is `@f0rbit/lint` (exact-pinned in `package.json`, no `^`/`~`) — see `~/dev/lint/AGENTS.md` for the umbrella model (oxlint fast gate → thin typed ESLint layer → oxfmt formatting).

- `eslint.config.ts` calls `define_lint_config({ naming: "camelCase", package_name: "@f0rbit/ui", module_resolution: "bundler", ... })`. `"bundler"` mode is required here (not the default `"node-esm"`) because tsup/bundler-resolved imports are extensionless by convention — `import-x/extensions` would otherwise demand `.ts`/`.tsx` suffixes that don't match how this repo actually imports.
- **Filenames are kebab-case** (`unicorn/filename-case` via oxlint), including component files — `Button.tsx` → `button.tsx`. Exported symbol names are unaffected (components stay PascalCase: `Button`, `Card`, ...) — the 0.1.4 `.tsx` naming-convention carve-out in `@f0rbit/lint` allows PascalCase for component functions/consts while everything else (locals, parameters) follows the base convention.
- **Base naming convention, regardless of the `camelCase` preset**: `let` variables and function parameters are always `snake_case` (e.g. `input_ref`, `parent_id`). Only function names and `const` declarations follow the repo's `naming` preset (`camelCase` here). This is a `@f0rbit/lint` factory-wide convention, not ui-specific — see `packages/eslint-config/src/presets.ts` in the `lint` repo.
- **Exceptions are config-scoped, not comment-scoped.** Repo-specific allowlists go in `overrides` as `files`-scoped blocks in `eslint.config.ts`, with a why-comment at the site. Inline `eslint-disable` needs a description and unused directives are errors — avoid them; prefer fixing the code or adding a scoped override.
- **Solid `ref={var}` shorthand trips oxlint's `no-unassigned-vars`** — oxlint's static analysis doesn't understand that Solid's JSX ref-assignment desugars to an implicit assignment at compile time; a bare `let x: T | undefined` with only `ref={x}` looks like `x` is never assigned. Fix: use the callback form `ref={(el) => (x = el)}` instead of the shorthand — every ref in this codebase does this now.
- `.git-blame-ignore-revs` lists the oxfmt normalization squash commit — configure your local git to use it (`git config blame.ignoreRevsFile .git-blame-ignore-revs`) so `git blame` skips the formatting-only diff.

### 0.3.0 rollout (lint-rules-v2, task 3.4)

Bumped `@f0rbit/lint` 0.1.4 → 0.3.0 (spans the 0.2.0 and 0.3.0 rule waves in one jump). New error-tier rules: `no-test-mocks`, `require-schema-at-boundary`, `@typescript-eslint/consistent-type-definitions`, `no-console`. New warn+graduation-tier rules: `no-ambient-effects`, `prefer-pipe`.

- **Per-rule delta at adoption:** `consistent-type-definitions` — 33 exported prop `interface`s across 22 component files autofixed to `type` aliases (the only real delta). `no-test-mocks`, `require-schema-at-boundary`, `no-console`, `no-ambient-effects`, `prefer-pipe` — 0 hits. This repo has no test suite (see above), no `JSON.parse`/fetch-`Body.json()` boundary code, and no ambient `Date.now()`/`Math.random()` reads in `src/` — components are pure render functions.
- **`no-console` needs no override for `scripts/*.js`** — the typed ESLint layer (which carries `no-console`) scopes to `ts_files` (`**/*.ts`, `**/*.tsx`, `.mts`, `.cts`) only; plain `.js` build scripts (`scripts/build-css.js`, `scripts/generate-llm-docs.js`) fall outside that glob entirely, and oxlint's canonical config has no `no-console` rule at all. Their `console.log` calls are exempt by file extension, not by a config override — don't add one speculatively.
- **interface→type d.ts surface note (augmentation-risk verdict: none, safe to convert all)**: surveyed all 33 exported prop interfaces plus README/docs for any documented `declare module` / interface-merging consumer pattern — found none. All are ordinary one-way `extends` (either `JSX.*Attributes<...>` or plain shape) with no consumer-facing augmentation contract. Autofix converted every one to `type X = { ... } & JSX.SomeAttributes<...>` (or a bare object type where there was no `extends`). Verified via a before/after `bun run build` d.ts diff: the bundled `export { ... }` statement in `dist/index.d.ts` is byte-identical before and after (same names, same `type`/value markers, same order) — zero export renames, value-level API unchanged. This is a pre-1.0 type-level-only breaking change (consumers relying on declaration merging against these prop types would break); noted in the PR body per the plan's breaking-changes section.
- Autofix (`eslint --fix`) leaves the closing brace of a converted type without a trailing semicolon — always run `bun run fmt` (oxfmt) immediately after `lint:fix` when this rule fires, before `fmt:check`.

## CI

`.github/workflows/ci.yml` — single `test` job: `bun install --frozen-lockfile`, typecheck, lint, `fmt:check`, build. Bun is pinned to `1.3.13` (1.3.14 segfaults — known issue tracked across the f0rbit repos, see `pulse`/`lint` CI).
