# Cheatsheet — Ticks 1–4

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

## Tick 3 — Template syntax (bindings and events)

- `[prop]="expr"` writes the JavaScript property on the DOM element. `[attr.x]="expr"` writes the HTML attribute — use for ARIA, `data-*`, SVG, or anywhere the property and attribute differ.
- `(event)="expr"` runs `expr` when the event fires; `$event` is the implicit event payload (cast via `($event.target as HTMLInputElement).value` for form events).
- `[class.x]="cond"` toggles class `x`. `[style.prop]="…"` sets style `prop`. `[style.prop.unit]="n"` appends the unit (e.g. `[style.width.px]="50"` → `width: 50px`). `[style.--bg]="…"` also works for CSS custom properties.
- `@let name = expr;` introduces a template-local variable scoped to the rest of the template region. Doesn't add a field to the class. `@let` is naming, not reactivity — the subscription lives in signal calls inside the RHS expression; `@let` itself re-evaluates on every template render.
- All template expressions are full TypeScript expressions, strict-type-checked against the component class.
- Legacy structural directives (`*ngIf`/`*ngFor`/`*ngSwitch`) are the pre-v17 way to do what `@if`/`@for`/`@switch` cover in tick 4.

## Tick 4 — Built-in control flow (`@if`, `@for`, `@switch`)

- `@if (cond) { ... } @else if (cond) { ... } @else { ... }` — language-level conditional. `@if (expr; as alias) { ... }` binds the truthy result to `alias` (useful for narrowing nullable signals).
- `@for (item of items; track item.id; let i = $index, first = $first, …) { ... } @empty { ... }` — language-level loop. Implicit context vars: `$index`, `$first`, `$last`, `$even`, `$odd`, `$count`. `@empty` fires when the iterable is empty.
- `@switch (expr) { @case (x) { ... } @default { ... } }` — language-level switch on a value, strict equality (`===`).
- `track` is mandatory in `@for`. It's a per-item expression returning a stable identifier; controls how Angular reuses DOM when the list changes. Pre-v17 `trackBy` was optional and a common perf footgun.
- All three blocks are compiled directly into the template render function — no structural-directive indirection, smaller bundle.
