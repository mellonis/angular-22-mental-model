# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A learn-by-doing tour of **Angular 22**, built as a series of "ticks" whose git history replays as a course. The README is authoritative on intent — read it first.

This repo follows the same pedagogical and commit pattern as **[mellonis/rxjs-mental-model](https://github.com/mellonis/rxjs-mental-model)** (referenced from `README.md` as `../RxJs Mental model/`, the local sibling checkout). Mirror that repo's commit cadence and per-tick discipline; **do not mirror its runtime** — Angular ticks live in an Angular CLI workspace, not a `tsx`-runnable Node script (see "Locked design decisions" below).

Current state: design spec landed at [`docs/superpowers/specs/2026-06-09-batch-1-design.md`](docs/superpowers/specs/2026-06-09-batch-1-design.md); no ticks yet, no Angular CLI workspace scaffolded yet. The single existing `package.json` script is `typecheck` (`tsc --noEmit`), which will be replaced by the Angular CLI's scripts once the workspace lands in the tick 1 `docs` commit.

## Locked design decisions

The full rationale is in the [batch 1 spec](docs/superpowers/specs/2026-06-09-batch-1-design.md); the short version a future session needs:

- **Audience: "knows another framework, new to Angular's modern story."** Reader has shipped React/Vue/Svelte; knows components and reactivity as concepts; doesn't know Angular's specifics. Angular's flavor of fundamentals (template syntax, control flow) is taught as first-class ticks, not glossed.
- **Runtime: pure Angular CLI workspace.** No `tsx`-runnable Node scripts; every tick is a route in the CLI app. The hybrid option was considered and rejected — for this audience, signals-as-a-Node-API doesn't motivate.
- **Batch 1 = 12 ticks.** Standalone bootstrap, template syntax, control flow, `signal`/`computed`/`effect`, lifecycle hooks, signal IO + decorator-IO legacy, services + `inject`, hierarchical injectors, zoneless CD. Routing/forms/HTTP/RxJS interop/SSR all deferred to batch 2.
- **Dependencies: latest stable as scaffolded by `ng new`.** No conservative pinning — the repo's job is to track the modern story as it lands.

If you're picking up the repo at a point that contradicts any of these, the spec is the source of truth, not this file. Update both together.

## Tick anatomy

Each tick is a directory under `src/app/tickN/` containing:

- `example.component.ts` (+ supporting components/templates as needed) — the runnable concept demo.
- `task.component.ts` — the exercise. `// write your code here` in the `docs(tickN):` commit; worked solution + `// === Review ===` notes in the `feat(tickN):` commit.
- `tickN.md` — prose: concept · example · task · key insights · "coming from React/Vue/Svelte" sidebar.

`app.routes.ts` exposes `/tickN/example` and `/tickN/task`. The example and task are separate routes (not separate Node programs as in the RxJS sibling), so their state and console output don't interleave — the learner navigates to one at a time.

Per-tick npm scripts: `tickN:example` and `tickN:task` each `ng serve` the workspace with a configuration that opens the corresponding route. Exact serve flags pinned at implementation time.

## Commit discipline

**Two commits per tick**, conventional-commit prefixes — this is the whole point of the repo, do not deviate:

1. `docs(tickN): <topic> — concept, example, task scaffold` — adds `src/app/tickN/example.component.ts`, `src/app/tickN/task.component.ts` (with `// write your code here`), `src/app/tickN/tickN.md`, route entries for `/tickN/example` and `/tickN/task`, and the `tickN:example` / `tickN:task` npm scripts. Reader can `git checkout` here to attempt the task.
2. `feat(tickN): <topic> — solution + cheatsheet` — fills `task.component.ts` with the worked solution and `=== Review ===` notes, and appends that tick's section to `CHEATSHEET.md` (header range grows `Ticks 1–N`).

Plus the existing root `chore:` setup commit, plus the spec commit, plus the tick 1 `docs` commit that lands the `ng new` workspace scaffold (one-time setup cost, shape preserved for all subsequent ticks). `CHEATSHEET.md` does not yet exist — it gets created with the `feat(tick1):` commit.

`git diff <docs-commit>..<feat-commit>` should equal: filled-in task solution + one new `CHEATSHEET.md` section. Nothing else.

Global commit rules from `~/.claude/CLAUDE.md` still apply — notably, do not run `git commit` without explicit permission, and do not append any Claude attribution footer.

## Writing conventions

- Every `tickN.md` includes a **"coming from React/Vue/Svelte" sidebar** — three short bullets naming the analogous primitive in those frameworks and where Angular's diverges.
- Modern syntax is the default in every example. Legacy syntax appears only where the tick is explicitly about it (tick 9, decorator IO) or in sidebars (tick 1: NgModule history; tick 4: `*ngIf`/`*ngFor`/`*ngSwitch` reference; tick 12: OnPush + zone.js).
- Templates use `@if`/`@for`/`@switch` throughout. `*ngIf`/`*ngFor`/`*ngSwitch` appear only in the tick 4 sidebar reference table.
- Imports use the standalone style — no `NgModule.declarations` anywhere outside the tick 1 sidebar's code-fence example.

## Topics covered

Per the spec's batch 1 arc — standalone components, template syntax, control flow, signals (`signal`/`computed`/`effect`), lifecycle hooks, signal IO (`input`/`output`/`model`) + decorator IO legacy, services + `inject`, hierarchical injectors, zoneless change detection.

Deferred to batch 2: routing, Signal Forms (+ reactive/template-driven legacy sidebars), HTTP (`httpResource` + legacy sidebars), RxJS interop, template queries, SSR + hydration, signal refinements (`linkedSignal`, custom equality, `resource`).
