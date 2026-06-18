# Observed Legacy Claude Design Export Format

This is a reference for the legacy-style folder format observed in two untouched Claude Design
exports: *Redpine Design System* and *Amazon Design System*.

> **Evidence level: observed primary samples, not universal law.** This file is based on direct reads
> of those exports: `_ds_manifest.json`, `_ds_bundle.js` header, `_adherence.oxlintrc.json`,
> `SKILL.md`, `preview/*.html`, and `ui_kits/*/index.html`. Use it as strong evidence for similar
> brownfield exports. Do not treat it as proof that Claude Design never supports other native rails
> such as `templates/` or namespace components.

## 1. Observed Legacy Skeleton

```text
<Name> Design System/
├── SKILL.md                 # package entry: YAML frontmatter + "read README.md"
├── README.md                # brand context + index table + foundations narrative
├── DESIGN.md                # optional taste/spec contract
├── colors_and_type.css      # token CSS, imported first
├── foundations.css          # optional additive layer, imported after tokens
├── preview/<specimen>.html  # @dsCard specimens for the review panel
├── ui_kits/<kit>/           # full screens: index.html + *.jsx + ui-kit.css
├── slides/                  # optional deck specimens
├── assets/ fonts/ uploads/ screenshots/
├── _ds_bundle.js            # compiler-generated; do not author
├── _ds_manifest.json        # compiler-generated; read for evidence
└── _adherence.oxlintrc.json # compiler-generated oxlint config
```

In these two exports there was no root `CLAUDE.md`, no `design-tokens.json`, no root `styles.css`,
no populated `templates[]`, and no populated `components[]`. That means a brownfield repair should
not force the greenfield starter layout onto them. It does **not** mean those files or tracks are
invalid in every Claude Design project.

## 2. `SKILL.md` Entry

The exported package entry is a `SKILL.md` with YAML frontmatter and a short body:

```markdown
---
name: amazon-design
description: Use this skill to generate well-branded interfaces and assets for <brand> ...
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
```

This is separate from the `CLAUDE.md` strategy in this starter. Treat `SKILL.md` as the native package
entry used by these exports, and `CLAUDE.md` as session governance/routing when you are operating a
project with Claude Design Premium.

## 3. Tokens

- CSS custom properties are the runtime token source. JSON tokens are handoff/reference artifacts
  only.
- Use `_ds_manifest.json.globalCssPaths` to find the active CSS graph in a brownfield export.
- There is no required `--cds-*` prefix. The samples used brand-prefixed variables plus semantic
  aliases, or unprefixed shadcn-style semantic names.
- `colors_and_type.css` was the primary token file in the observed exports. `foundations.css` was an
  optional additive layer for spacing, type, grids, and similar foundations.

For this starter's greenfield path, `starter-kit/static/tokens.css` can be the initial active token
file. For brownfield exports, keep the existing token file and avoid renaming it just to match the
starter.

## 4. `@dsCard` Specimens

The observed exports used `preview/*.html` files with an `@dsCard` comment near the top of the file:

```html
<!doctype html>
<!-- @dsCard group="Components" name="Buttons" subtitle="Primary · secondary · ghost" viewport="700x280" -->
<html>
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="../colors_and_type.css">
  </head>
  <body>...</body>
</html>
```

Observed properties:

- `group`, `name`, `subtitle`, and `viewport="WxH"` populate `manifest.cards[]`.
- Specimens are often plain HTML/CSS and may not include full public-page metadata such as `title`,
  `lang`, or viewport meta.
- Decks and UI kits can also be `@dsCard` entries.

This matters for validation scripts: a native card is not always a complete standalone public page.

## 5. UI Kits

The observed interactive screens lived in `ui_kits/<kit>/`:

```html
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="..." crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="..." crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="..." crossorigin="anonymous"></script>
<script type="text/babel" src="components.jsx"></script>
<script type="text/babel" src="pages.jsx"></script>
```

Observed runtime facts:

- Raw `.jsx` files were loaded through `type="text/babel"`.
- The samples did not use ESM imports or npm packages in the canvas.
- `localStorage` was used by at least one UI kit.
- These HTML files did not manually load `_ds_bundle.js`.

This supports the starter's rule: vanilla HTML/CSS/JS is the default, and React+Babel is an optional
canvas-safe escape hatch when the prototype needs state.

## 6. Compiler Artifacts

`_ds_manifest.json`, `_ds_bundle.js`, and `_adherence.oxlintrc.json` were generated artifacts in the
observed exports.

`_ds_manifest.json` is useful evidence:

- `globalCssPaths[]` identifies active token/style files.
- `cards[]` lists collected `@dsCard` specimens.
- `tokens[]` is extracted from CSS.
- `templates[]` and `components[]` existed as fields but were empty in the two samples.

`_ds_bundle.js` exposed a generated namespace, but authored HTML in the samples did not load it.
Do not hand-author this file. Do not build starter behavior around loading it unless the current live
Claude Design project and `check_design_system` prove that path is expected.

## 7. What This Corrects

| Claim | Correction |
|---|---|
| Brownfield exports should be normalized to root `styles.css`. | No. Use `globalCssPaths[]` and preserve files such as `colors_and_type.css`. |
| JSON tokens can be the canvas runtime token source. | No. CSS custom properties are the runtime source; JSON is handoff/reference. |
| `@dsCard` files are ordinary full public pages. | No. They are review-panel specimens and may omit normal page metadata. |
| React cannot run in the canvas. | Too strong. React+Babel via script tags was observed in UI kits. |
| Authored cards must load `_ds_bundle.js`. | Not in these exports. Treat the bundle as generated unless live validation says otherwise. |
| Two legacy exports define all native Claude Design rails. | No. They define a common brownfield shape, not every possible project shape. |

## 8. Implications For This Starter

- Keep greenfield starter files useful, but do not impose them on existing Claude Design exports.
- For brownfield work, read `_ds_manifest.json` first and preserve the active CSS graph.
- Keep `CLAUDE.md` as governance, not as a replacement for native `SKILL.md` package entries.
- Keep repo-side scripts as maintenance preflight only. The live gate remains `check_design_system`
  inside Claude Design.
- When a claim depends on native compiler behavior, label it as observed, verified in the current
  project, or still pending live validation.
