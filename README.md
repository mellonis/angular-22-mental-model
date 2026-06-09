# Angular 22 Mental Model

A learn-by-doing tour of Angular 22, built the same way as [RxJS Mental Model](https://github.com/mellonis/rxjs-mental-model): small runnable ticks, one concept at a time, with a git history that replays as a course.

Repository: <https://github.com/mellonis/angular-22-mental-model>

The goal isn't to memorize APIs — it's to build the mental model: standalone components, signals and reactivity, dependency injection, change detection, routing, forms, SSR/hydration.

## Status

Batch 1 in progress. Ticks 1–4 landed: standalone component + `bootstrapApplication()`, `signal()`, template syntax (bindings and events), built-in control flow (`@if`/`@for`/`@switch`). Eight more ticks in the planned batch 1 arc — see the [batch 1 design spec](docs/superpowers/specs/2026-06-09-batch-1-design.md).

Each tick lands as exactly two commits: `docs(tickN): … — concept, example, task scaffold` followed by `feat(tickN): … — solution + cheatsheet`, mirroring the RxJS repo's [commit ideology](https://github.com/mellonis/rxjs-mental-model#commit-ideology). `git checkout <docs-commit>` to attempt the task; `git diff <docs>..<feat>` to compare against the canonical solution.

## Getting started

```bash
npm install
npm run tickN:example    # serve, then navigate to /tickN/example
npm run tickN:task       # serve, then navigate to /tickN/task
ng build                 # type-check + production build
```

All `tickN:*` scripts are identical (`ng serve --open`) because Angular 22's CLI doesn't expose a `--open-path` flag. The root `App` shell has nav links to every tick's example and task.

Runtime: Angular 22 CLI workspace, zoneless change detection. See [`docs/superpowers/specs/2026-06-09-batch-1-design.md`](docs/superpowers/specs/2026-06-09-batch-1-design.md) for the batch 1 design.
