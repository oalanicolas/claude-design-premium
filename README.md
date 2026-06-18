<div align="center">

# Claude Design Premium

**English** · [Português](README.pt-BR.md)

**Your design system. In the room. On every screen.**

Claude Design Web moves fast. This harness makes sure fast doesn't mean forgetful.

<p>
  <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg">
  <img alt="Runtime: Claude Design Web" src="https://img.shields.io/badge/runtime-Claude%20Design%20Web-8a63d2">
  <img alt="Dependencies: 0 npm" src="https://img.shields.io/badge/deps-0%20npm-2ecc71">
  <img alt="Skills: 13" src="https://img.shields.io/badge/skills-13-3498db">
  <img alt="Modes: Builder + Consumer" src="https://img.shields.io/badge/modes-builder%20%2B%20consumer-555">
</p>

[Quick start](#quick-start) · [What changes](#what-changes) · [Skills](#skills) · [Docs](#docs)

</div>

---

> **Community project.** Not affiliated with or endorsed by Anthropic.  
> Claude Design Web is Anthropic's product. This package is a harness and skill pack for it.

## The gap

You already paid for a design system: tokens, components, voice, constraints. Claude Design doesn't know that unless you re-explain it every session.

So you get the same screen twice with different spacing. Buttons that don't exist in your library. Copy that sounds like a landing page template. Mockups your engineers can't map to real components.

That's not a model problem. It's a **context** problem.

## What changes

| Without harness | With Claude Design Premium |
|-----------------|----------------------------|
| Re-brief the DS every session | `BOUND_DS.json` + `DESIGN.md` stay loaded |
| Model invents components | Guardian checks tokens + your manifest |
| One-off pretty pages | Living `design-system.dc.html` specimen |
| "Looks fine" handoff | Audits for a11y, mobile, copy, Tailwind alignment |
| Vague prompts → vague UI | `brief-framing` turns intent into a buildable brief |

**13 skills. Zero npm deps. One message to bootstrap.**

You still design in Claude Design Web. The harness just stops your system from getting amnesia.

## Who this is for

- **Founders and product leads** who have a DS (or are building one) and want Claude to respect it
- **Design system authors** maintaining tokens + components in this repo → **Builder** mode
- **Product teams** consuming a published bundle → **Consumer** mode (`_ds/<bundle>/`)

Not sure which mode? Open the project and say:

```
Set up this harness for my design system.
```

`harness-auto-setup` detects your layout and runs bootstrap. No wiring.

## Quick start

Six steps. First three take one conversation.

**1.** Open this folder in [Claude Design Web](https://claude.ai/design).

**2.** Bootstrap:

```
Set up this harness for my design system.
```

Writes `BOUND_DS.json`, scaffolds `design-system.dc.html`, generates `.cdp/showcase-brief.json`.

**3.** Fill `DESIGN.md` with product name, voice, surfaces, and brand rules. Replace `CDP:UNCONFIGURED` placeholders.

**4.** Assemble the showcase (bootstrap only scaffolds; your model builds the real specimen):

```
Assemble the full design-system showcase from the brief.
```

**5.** Build:

```
Create a dashboard for [your product] using our design system.
```

**6.** Ship the conversation. Skills route through `CLAUDE.md`: guardian on UI work, audits before handoff, `framework-handoff` when you're ready for code.

## How it works

```
Open project in Claude Design Web
        ↓
harness-auto-setup → bootstrap-harness.mjs
        ↓
BOUND_DS.json + showcase-brief + scaffolded pages
        ↓
You own DESIGN.md (voice, surfaces, rules)
        ↓
assemble-design-system-showcase → full design-system.dc.html
        ↓
Every new screen: guardian + targeted audits
```

| Artifact | What it does |
|----------|--------------|
| `DESIGN.md` | Your voice, surfaces, constraints. The brief the model can't skip |
| `BOUND_DS.json` | Machine-readable binding: mode, paths, manifest, token count |
| `.cdp/showcase-brief.json` | Sections + inventory for the living specimen |
| `design-system.dc.html` | Scaffold first; full vitrine after assembly in Claude Design |
| `CLAUDE.md` | Routes intent → skills. You don't memorize 13 filenames |

### Builder vs consumer

| | **Builder** | **Consumer** |
|---|-------------|--------------|
| `DESIGN.md` | Project root | `_ds/<bundle>/DESIGN.md` |
| Components | Your repo | Bundle `components/` |
| You | DS maintainer | App team on a published kit |

Auto-detected. Override: `node scripts/bootstrap-harness.mjs --mode builder|consumer`.

## What's in the ZIP

- 13 skills: setup, showcase, guardian, six audit lanes, handoff
- Bootstrap pipeline: Node scripts, no `npm install`
- Starter pages: `intro.dc.html`, scaffolded `design-system.dc.html`
- [PLAYBOOK.md](PLAYBOOK.md): session recipes for real product work

**Not included on purpose:** a finished generic demo page. The specimen is assembled from *your* `DESIGN.md` so it reflects your system, not ours.

## Skills

| Skill | Runs when |
|-------|-----------|
| `harness-auto-setup` | First open: detect, bootstrap, verify |
| `assemble-design-system-showcase` | After bootstrap: complete the DS page |
| `design-system-guardian` | UI tasks: token + component fidelity |
| `fivu-identity-showcase` | Brand / identity surfaces |
| `brief-framing` | Vague ask → executable brief |
| `ui-audit` | Structure, hierarchy, layout |
| `visual-originality-audit` | Catches default-template drift |
| `polish-phase` | Last pass before you call it done |
| `text-integrity-audit` | Copy vs your voice rules |
| `mobile-first-audit` | Responsive behavior |
| `accessibility-audit` | WCAG-oriented review |
| `tailwind-audit` | Utility/token alignment |
| `framework-handoff` | Export notes for React, Vue, etc. |

Routing is in `CLAUDE.md`. Paste a prompt; the right skill shows up.

## Docs

| Doc | |
|-----|--|
| [PLAYBOOK.md](PLAYBOOK.md) | Dashboard, landing, settings: session flows |
| [LIMITATIONS.md](LIMITATIONS.md) | What this does and doesn't guarantee |
| [docs/script-pipeline.md](docs/script-pipeline.md) | Bootstrap scripts |
| [docs/canvas-runtime.md](docs/canvas-runtime.md) | `.dc.html` runtime |
| [docs/validation-method.md](docs/validation-method.md) | Verify your setup |

## Local check (optional)

```bash
node scripts/bootstrap-harness.mjs
node scripts/context-signals.mjs
node scripts/test-builder-bootstrap.mjs
```

## License

See repository license. Claude Design Web terms apply to Anthropic's product separately.

---

<div align="center">

**You built the system. Stop re-teaching it every session.**

[Quick start](#quick-start) · [PLAYBOOK](PLAYBOOK.md) · [LIMITATIONS](LIMITATIONS.md)

</div>