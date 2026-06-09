# Cheatsheet — Ticks 1–1

One-page recap of the mental model. Each section is one tick.

## Tick 1 — Standalone component + `bootstrapApplication()`

- A component is a class with `@Component({ selector, template, styles?, imports? })`. The decorator carries config; the class body carries state.
- Every directive, pipe, or component referenced in a template must be declared in the component's `imports: [...]`. There is no central registry — each component is self-describing.
- Reading `{{ expr }}` in a template evaluates `expr` and inserts `String(expr)` at that point. `expr` is a full TypeScript expression — ternaries, method calls, property access all work.
- `bootstrapApplication(App, appConfig)` in `src/main.ts` is the application entry. There is no `AppModule`.
- Routes lazy-load components: `{ path: 'foo', loadComponent: () => import('./foo').then(m => m.Foo) }`.
- Angular 22 file convention drops the `.component.ts` suffix and the `Component` class-name suffix — files are `example.ts`, classes are `Tick1Example`.
- `NgModule` is legacy. Reading it is mostly straightforward; writing new ones is unnecessary in Angular 22.
