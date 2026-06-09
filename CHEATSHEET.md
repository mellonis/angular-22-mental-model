# Cheatsheet — Ticks 1–2

One-page recap of the mental model. Each section is one tick.

## Tick 1 — Standalone component + `bootstrapApplication()`

- A component is a class with `@Component({ selector, template, styles?, imports? })`. The decorator carries config; the class body carries state.
- Every directive, pipe, or component referenced in a template must be declared in the component's `imports: [...]`. There is no central registry — each component is self-describing.
- Reading `{{ expr }}` in a template evaluates `expr` and inserts `String(expr)` at that point. `expr` is a full TypeScript expression — ternaries, method calls, property access all work.
- `bootstrapApplication(App, appConfig)` in `src/main.ts` is the application entry. There is no `AppModule`.
- Routes lazy-load components: `{ path: 'foo', loadComponent: () => import('./foo').then(m => m.Foo) }`.
- Angular 22 file convention drops the `.component.ts` suffix and the `Component` class-name suffix — files are `example.ts`, classes are `Tick1Example`.
- `NgModule` is legacy. Reading it is mostly straightforward; writing new ones is unnecessary in Angular 22.

## Tick 2 — `signal()`

- `signal(initial)` creates a reactive primitive. Read with `()` (function call); write with `.set(v)` (replace) or `.update(fn)` (derive from current).
- Reading inside a tracked context (template, `computed`, `effect`) subscribes — writes notify subscribers and trigger re-renders.
- Reading outside a tracked context (e.g., `console.log(count())` in a method) is just a function call; no subscription.
- `.asReadonly()` returns a read-only wrapper (no `.set`/`.update`). Useful for service-exposed state.
- In zoneless Angular 22, signal writes are the mechanism that tells the framework what to re-render. No `zone.js`, no `markForCheck()`.
- Signals track value *replacement* (`.set`/`.update`), not deep mutation. `signal()[0].x = y` does NOT trigger updates — produce a new value (`update(s => ({ ...s, x: y }))`) instead. Tick 4 has a sidebar with the full story.
- Event bindings (`(click)="…"`) flow template → component; the expression inside the quotes runs on the event. Tick 3 covers the full binding story.
