# Security

This repository distributes documents that users paste into projects driven by AI agents. Treat them
with the same care as any instruction you give an agent.

## Security posture

Instruction documents do not execute. The governance files: `CLAUDE.md`, `.skill.md`, `DESIGN.md`,
setup docs, token CSS, and optional token JSON: are natural-language instructions or static data.
The examples under `starter-kit/static/` are client-side browser artifacts when opened in preview.

- They run no shell commands, package scripts, installers, or background automation inside the canvas.
- The instruction documents make no network calls or requests.
- They contain no credential, secret, environment variable, or token handling.
- They contain no hidden automation or instructions to send data to external services.

A `.skill.md` may *reference* an optional repo-side script as a preflight, but referencing is not
executing: nothing runs until you choose to run it yourself (see "Repo-side scripts" below).

`CLAUDE.md` and every `.skill.md` are operational instructions for Claude Design Web: natural
language only.

`starter-kit/static/` includes browser-preview JavaScript for static canvas scaffolds. It must stay
client-only and must not add package installs, shell execution, or credential handling.

The optional `starter-kit/static/global-script-example/` demonstrates a self-contained browser
script that exposes `window.CDPGlobalWidget`. Keep this pattern client-only: no dynamic remote code,
no secret handling, and no package or shell assumptions.

The optional `starter-kit/static/react-example/` is different: it is a runnable prototype example and
uses fixed CDN script tags for React, ReactDOM, and Babel standalone. Treat it as opt-in: review the
URLs and integrity hashes before use, and remove it when a no-network canvas policy is required.

## Repo-side scripts (optional, opt-in)

`scripts/` contains optional Node helpers you run **outside** Claude Design Web, in your own repo:
`generate-design-tokens.mjs`, `validate-cdp.mjs`, `detect-canvas-antipatterns.mjs`, and
`context-signals.mjs`. They are local-only: they read project files and report, run `node --check`
for syntax, generate/check token JSON from CSS, and call each other. They make no network calls,
touch no credentials, install nothing, and perform no destructive operations, and they are never
pasted into or invoked from the canvas. Review them before running, as with any script.

## What you should do

1. **Review before you use.** Read `CLAUDE.md` and any `.skill.md` before adding them to your Claude
   Design Web project context. Do not paste files you have not read.
2. **Verify the source.** Only use this content from the official repository or your own fork. Be wary
   of forks, mirrors, or "installers" that add commands, URLs, or automation: that is a red flag.
3. **Watch for typosquatting.** Similar repo or package names may impersonate this project. Confirm the
   owner and history before trusting a copy.
4. **Keep secrets out.** Do not place credentials, tokens, or private data inside `DESIGN.md`,
   `starter-kit/static/tokens.css`, `design-tokens.json`, or any file you load into context.

## Reporting a problem

If you find a **canvas artifact** (`CLAUDE.md`, a `.skill.md`, `DESIGN.md`,
`starter-kit/static/tokens.css`, `design-tokens.json`, a setup doc, or anything in
`starter-kit/static/`) that executes code, calls the network, or handles credentials: or any script
outside the documented `scripts/` that does so: open an issue using the bug report template and
describe exactly what you found. Do not include real secrets in the report.

## Disclaimer

Unofficial community workflow. Not affiliated with Anthropic.
