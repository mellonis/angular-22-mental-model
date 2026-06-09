# Angular 22 Mental Model

A learn-by-doing tour of Angular 22, built the same way as [RxJS Mental Model](../RxJs%20Mental%20model): small runnable ticks, one concept at a time, with a git history that replays as a course.

The goal isn't to memorize APIs — it's to build the mental model: standalone components, signals and reactivity, dependency injection, change detection, routing, forms, SSR/hydration.

## Status

Project scaffold. Ticks will land tick-by-tick, each as a `docs(tickN): … — concept, example, task scaffold` commit followed by a `feat(tickN): … — solution` commit, mirroring the RxJS repo's [commit ideology](../RxJs%20Mental%20model/README.md#commit-ideology).

## Getting started

```bash
npm install
npm run tick1:example    # serve, then navigate to /tick1/example
npm run tick1:task       # serve, then navigate to /tick1/task
ng build                 # type-check + production build
```

The two `tick1:*` scripts are currently identical (`ng serve --open`) because Angular 22's CLI doesn't expose a `--open-path` flag. The root `App` shell has nav links to both routes.

Runtime: Angular 22 CLI workspace, zoneless change detection. See [`docs/superpowers/specs/2026-06-09-batch-1-design.md`](docs/superpowers/specs/2026-06-09-batch-1-design.md) for the batch 1 design.
