# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A learn-by-doing tour of **Angular 22**, built as a series of "ticks" whose git history replays as a course. The README is authoritative on intent — read it first.

This repo follows the same pedagogical and commit pattern as **[mellonis/rxjs-mental-model](https://github.com/mellonis/rxjs-mental-model)** (referenced from `README.md` as `../RxJs Mental model/`, the local sibling checkout). Before adding anything new, read that repo's `README.md`, `package.json`, `tsconfig.json`, and `tick1/` to see the established shape. Mirror it unless there's a deliberate reason not to (see "Angular vs. RxJS" below).

Current state: **scaffold only** — one `chore:` commit, no ticks, no `tsconfig.json`, no Angular dependencies installed. The single existing `package.json` script is `typecheck` (`tsc --noEmit`), which currently has nothing to typecheck and no tsconfig to drive it.

## Commands

- `npm install` — install deps (none beyond what `package.json` lists yet).
- `npm run typecheck` — `tsc --noEmit` across the project. Will need a `tsconfig.json` before it does anything useful; the [rxjs-mental-model tsconfig](https://github.com/mellonis/rxjs-mental-model/blob/main/tsconfig.json) (`target: ES2022`, `strict`, `include: ["tick*/*.ts"]`) is a reasonable starting point but Angular ticks will likely need `experimentalDecorators`, `useDefineForClassFields: false`, and `lib: ["DOM"]` additions.
- Per-tick scripts will follow the RxJS pattern: `tickN:example` and `tickN:task`. Whether they invoke `tsx`, the Angular CLI, or something else is an **open decision** — see below.

## Tick anatomy (when ticks land)

Each `tickN/` directory holds three files, copied from the RxJS model:

- `example.ts` — runnable demo of the concept.
- `task.ts` — the exercise. In the `docs(tickN):` commit it ends in `// write your code here`; in the `feat(tickN):` commit it holds the worked answer with a `// === Review ===` comment.
- `tickN.md` — prose: concept · example · task · key takeaways.

`example.ts` and `task.ts` are separate programs so their console output never interleaves. Preserve that property.

## Commit discipline

**Two commits per tick**, conventional-commit prefixes — this is the whole point of the repo, do not deviate:

1. `docs(tickN): <topic> — concept, example, task scaffold` — adds `tickN/example.ts`, `tickN/task.ts` with `// write your code here`, `tickN/tickN.md`, and the `tickN:example` / `tickN:task` npm scripts. Reader can `git checkout` here to attempt the task.
2. `feat(tickN): <topic> — solution + cheatsheet` — fills `tickN/task.ts` with the worked solution and `=== Review ===` notes, and appends that tick's section to `CHEATSHEET.md` (header range grows `Ticks 1–N`).

Plus the existing root `chore:` setup commit. `CHEATSHEET.md` does not yet exist — it gets created with the `feat(tick1):` commit.

`git diff <docs-commit>..<feat-commit>` should equal: filled-in task solution + one new `CHEATSHEET.md` section. Nothing else.

Global commit rules from `~/.claude/CLAUDE.md` still apply — notably, do not run `git commit` without explicit permission, and do not append any Claude attribution footer.

## Angular vs. RxJS — the runtime question is open

The RxJS repo runs every tick via `tsx` on Node, no build step. Angular cannot do this for everything — concepts like routing, change detection, forms, and SSR/hydration require a real Angular runtime (browser DOM, or an Angular SSR host). When the first tick lands, the shape will need to be decided. Possibilities:

- **`tsx` for API-level ticks** (signals, DI primitives) + a separate Angular CLI app for browser ticks.
- **Angular CLI workspace** with one feature/route per tick.
- **Hybrid** — a single CLI workspace where each tick exposes both a Node-runnable script and a browser entry point.

Do not silently assume `tsx` works for everything just because the RxJS repo does. If you're picking up an empty repo and the user asks you to start tick 1, surface the runtime choice as a question before scaffolding.

## Topics the README commits to covering

Standalone components · signals and reactivity · dependency injection · change detection · routing · forms · SSR/hydration. The tick breakdown isn't published yet — when proposing one, mirror the RxJS table format (number · topic · key idea) in the README.
