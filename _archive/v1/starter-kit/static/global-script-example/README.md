# Canvas-Safe Global Script Example

Use this when the canvas needs a prebuilt browser script without React and without a build step.

Rules:

- Load the script with a plain `<script src="./widget.js"></script>`.
- Keep the script self-contained: no `import`, no `export`, no `type="module"`, no npm packages.
- Expose the public API on `window`.
- Resolve assets relative to the HTML document, or pass paths explicitly from the HTML.

This pattern can represent a UMD/IIFE file that was built outside Claude Design Web. The canvas can
load the file, but it cannot create the bundle, install packages, or run a bundler.

