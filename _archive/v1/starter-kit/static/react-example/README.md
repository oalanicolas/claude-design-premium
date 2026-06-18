# Canvas-Safe React Example

Use this only when a Claude Design Web canvas prototype needs component state or a richer interaction
than vanilla JS should carry.

Rules:

- Load React and ReactDOM through fixed UMD script tags.
- Load Babel standalone in the browser.
- Use `<script type="text/babel">`.
- Do not use `import`, `export`, `type="module"`, npm packages, or bundler-dependent output.
- For portable starter examples, expose reusable pieces on `window`.
- Prefer mounting the component from the same `.jsx` file that defines it.
- Keep the active token CSS as the CSS token runtime.

The default scaffold should remain plain HTML, CSS, and vanilla JS. React is an escape hatch, not the
first move.
