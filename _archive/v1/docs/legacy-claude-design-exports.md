# Legacy Claude Design Exports

This note captures the older/less-organized Claude Design export pattern observed in untouched
downloads such as Redpine and Amazon design systems.

These exports are valid evidence, but they are not the same shape as the native-component starter
track.

## Observed Shape

Common root files:

- `README.md`
- `SKILL.md`
- `_ds_bundle.js`
- `_ds_manifest.json`
- `_adherence.oxlintrc.json`
- one or more root CSS token files, commonly `colors_and_type.css`

Common folders:

- `preview/` for many small `@dsCard` HTML specimens
- `ui_kits/<name>/` for larger interactive prototypes
- `assets/`, `uploads/`, and sometimes `fonts/`
- optional `slides/`, `variations/`, `spec/`, or `screenshots/`

Common omissions:

- no root `styles.css`
- no `templates/<slug>/index.html`
- no exported native component files in `components/*.jsx` + `components/*.d.ts`
- no `components` entries in `_ds_manifest.json`

## What The Native Compiler Still Produces

Even without native components, the compiler still writes:

- `namespace`
- `cards`
- `globalCssPaths`
- `tokens`
- `themes`
- `brandFonts`
- `_adherence.oxlintrc.json`

In these exports, `@dsCard` is the main design-system surface. Cards often live in `preview/` and may
omit normal public-page affordances such as `<title>`, viewport meta, or `lang`. Treat them as
specimens, not pages.

## Migration Implications

When converting a legacy export into this starter:

1. Keep `colors_and_type.css` or the CSS files listed in `_ds_manifest.json.globalCssPaths` as the
   brownfield token source.
2. Do not add `styles.css` just to satisfy the greenfield starter shape. If you add it during an
   explicit migration, treat it as a compatibility facade that imports the existing CSS files. It is
   not the token source.
3. Keep `preview/*.html` as `@dsCard` specimens; do not force them into component sidecars.
4. Add `templates/<slug>/index.html` only when the project needs native picker templates.
5. Add real components later as `.jsx` + `.d.ts`; do not mistake UI kit prototype files for native
   design-system components.
6. Treat `_ds_bundle.js`, `_ds_manifest.json`, and `_adherence.oxlintrc.json` as generated evidence,
   not files to author by hand.

## Brownfield Token Rule

For brownfield work, the active token source is the existing CSS graph, not this starter's preferred
file name. Use this order:

1. `_ds_manifest.json.globalCssPaths`, if present.
2. Root token CSS names already used by the export, commonly `colors_and_type.css`.
3. CSS linked by existing `preview/*.html` cards, such as `preview/_card.css` importing
   `../colors_and_type.css`.
4. Only after that, consider adding a `styles.css` facade for future normalization.

## Detector Calibration

The local anti-pattern detector exempts native `@dsCard` specimens from public-page title, viewport,
and language checks. It still checks deterministic issues such as missing image alt text, broken image
sources, outline removal without focus replacement, and risky typography/layout patterns.
