# Tick 7 — Lifecycle hooks

> Run: `npm run tick7:example` (demo) · `npm run tick7:task` (exercise)

## Concept

A lifecycle hook is a method on the component class that Angular calls at a specific moment in the component's life. They're how you observe — and respond to — the framework's create/update/destroy timeline.

Modern Angular's signals + `effect()` + `computed()` cover most of what you'd traditionally reach for lifecycle hooks to do. The hooks that remain are the cases `effect()` can't cleanly replace:

- **Single-shot init at a known time** (`ngOnInit`).
- **Post-view DOM access** (`ngAfterViewInit` / `ngAfterContentInit`).
- **Deterministic destruction** (`ngOnDestroy` / `DestroyRef.onDestroy`).
- **Legacy input-change reactions** (`ngOnChanges`, tied to decorator `@Input`).

Framing: *the modern signal model covers most cases; these hooks are the remainder.*

### `ngOnInit`

```typescript
ngOnInit() { /* runs once, after input bindings have settled */ }
```

Use for: single-shot init that needs input values but doesn't need the DOM. Examples: fetching initial data, setting up subscriptions, initializing state from inputs. Does NOT fire when inputs change later — for that, `ngOnChanges` (legacy IO) or signal-based `input()` (tick 8) which is reactive by construction.

### `ngAfterContentInit`

```typescript
ngAfterContentInit() { /* runs once, after `<ng-content>` has been projected */ }
```

Use for: code that needs to query or interact with projected content. Rarely used in modern Angular component design; more common in library components that wrap children.

### `ngAfterViewInit`

```typescript
ngAfterViewInit() { /* runs once, after the component's own view DOM is rendered */ }
```

Use for: code that needs the DOM to be in place. Examples: focus an input, measure layout, attach a third-party widget (Chart.js, Leaflet, etc.). Before `ngAfterViewInit`, the component's template hasn't been inserted into the DOM yet.

### `ngOnDestroy`

```typescript
ngOnDestroy() { /* runs once, before the component is removed */ }
```

Use for: cleanup. Clear timers (`clearInterval`), unsubscribe from observables, remove DOM event listeners, release file handles. Anything you acquired during the component's life.

### `ngOnChanges`

```typescript
ngOnChanges(changes: SimpleChanges) { /* runs whenever a decorator @Input changes */ }
```

Tied to the legacy `@Input()` decorator pattern. With signal-based `input()` (tick 8) you don't need `ngOnChanges` — inputs are signals you read directly, and `effect()` reacts to changes. Tick 9 (legacy decorator IO) shows the full pattern.

### Hooks ↔ TypeScript interfaces

Each hook has a matching interface (`OnInit`, `AfterContentInit`, `AfterViewInit`, `OnDestroy`, `OnChanges`). Implementing the interface is optional — Angular finds the methods by name — but conventional: it catches typos at compile time and documents intent.

## Example (`example.ts`)

Two components in one file. `Tick7Example` (parent) has a `show = signal(true)` toggle and conditionally renders `Tick7Child` via `@if`. `Tick7Child` implements all four common hooks: each logs to console when fired; `ngOnInit` starts a `setInterval` that logs a tick every second; `ngOnDestroy` clears it.

Behaviour:
- Page load → child mounts → `ngOnInit` → `ngAfterContentInit` → `ngAfterViewInit` log in order, then ticks start.
- Click "Destroy" → `ngOnDestroy` logs, interval clears, ticks stop.
- Click "Create" → new child instance, all init hooks fire fresh, tick counter resets.

This is the canonical "lifecycle hooks fire in order" demonstration. Toggling shows the destroy story too.

## Task (`task.ts`)

Build a `Tick7TaskTracker` child that:

- In `ngOnInit`, captures `Date.now()` in a private field (e.g., `startedAt`) and logs `[tracker] started at <ISO>` (`new Date(this.startedAt).toISOString()`).
- In `ngOnDestroy`, computes `Date.now() - this.startedAt` and logs `[tracker] lived for Nms`.

Add `implements OnInit, OnDestroy` to the class. The parent (`Tick7Task`) is already wired with a `showTracker` toggle.

Verify in the console:
- Click "Start tracker" → see the start timestamp logged.
- Wait a few seconds.
- Click "Stop tracker" → see the lifetime in milliseconds.
- Click "Start tracker" again → fresh init, new start timestamp.

Run `npm run tick7:task` to see your output at `/tick7/task`.

## Key insights

- **Hooks are methods on the class; Angular calls them by name.** The matching interfaces (`OnInit` etc.) are TypeScript-only — implementing them is conventional but optional; it catches name typos at compile time.
- **Firing order on init: `ngOnChanges` → `ngOnInit` → `ngAfterContentInit` → `ngAfterViewInit`.** `ngOnChanges` only fires if there are decorator inputs (legacy IO, tick 9). With signal-based components, the init order simplifies to `ngOnInit` → content → view.
- **`ngOnInit` runs after inputs are settled.** Don't reach for inputs in the constructor — they're not guaranteed to be set yet. `ngOnInit` is the canonical place.
- **`ngAfterViewInit` is where the DOM exists.** Before it, the component's template hasn't been inserted into the DOM. Reach for it when you need to focus, measure, or attach to a real DOM element.
- **`ngOnDestroy` is deterministic.** It runs once, when the component is being removed (route change, `@if` toggle, parent destroyed). Use for cleanup that must happen — clear intervals, unsubscribe, release resources.
- **`inject(DestroyRef).onDestroy(fn)` is the modern functional alternative.** Works without `implements OnDestroy`, anywhere you have an injection context. Useful in services, helper functions, and inside `effect()` setups where you want both effect-tied cleanup AND component-tied cleanup.

## Coming from React / Vue / Svelte

- **React class components**: `componentDidMount` ≈ `ngAfterViewInit` (post-mount DOM access), `componentWillUnmount` ≈ `ngOnDestroy`, `componentDidUpdate` has no exact Angular analogue (effects/signals fill this role).
- **React function components**: `useEffect(fn, [])` is the "mount" pattern; the returned cleanup is the "unmount". Angular's hooks are explicit per-event (init vs destroy), not unified into one signature.
- **Vue 3 Composition API**: `onMounted` ≈ `ngAfterViewInit`, `onBeforeUnmount` / `onUnmounted` ≈ `ngOnDestroy`, `onUpdated` has no direct Angular analogue. Setup function ≈ constructor; `onMounted` is the closest to `ngOnInit + ngAfterViewInit` combined.
- **Svelte 5**: `onMount(fn)` ≈ `ngAfterViewInit`; return value or `onDestroy(fn)` ≈ `ngOnDestroy`. Svelte's lifecycle is simpler — fewer named hooks because the compiler handles more.

## Sidebar — `DestroyRef` and "what `effect()` doesn't replace"

`DestroyRef` is the modern functional alternative to `ngOnDestroy`:

```typescript
import { Component, DestroyRef, inject } from '@angular/core';

@Component({ /* ... */ })
export class MyComponent {
  constructor() {
    const destroyRef = inject(DestroyRef);
    const intervalId = setInterval(() => doSomething(), 1000);
    destroyRef.onDestroy(() => clearInterval(intervalId));
  }
}
```

Two reasons this is sometimes preferable to `ngOnDestroy`:

1. **It works without `implements OnDestroy`.** Cleaner in service classes, helper functions, and anywhere outside a lifecycle-class context.
2. **It composes with setup code.** The cleanup is registered right next to the resource acquisition, instead of a separate `ngOnDestroy` method at the bottom of the class.

`effect()` (tick 6) handles a subset of "react and clean up" cases — its `onCleanup` runs both before each next effect run AND on component destroy. The decision rubric:

- **Need to react to signal changes AND clean up between runs?** → `effect()` with `onCleanup`. E.g., re-subscribing whenever a query signal changes.
- **Need to do something once on init AND clean up on destroy?** → `inject(DestroyRef).onDestroy(...)` in the constructor (or `ngOnInit` + `ngOnDestroy` if you prefer interfaces).
- **Need post-DOM access?** → `ngAfterViewInit`. `effect()` doesn't guarantee DOM is ready on its first run (effects run at a microtask boundary, before DOM commits).
- **Need synchronous "happens before first input read"?** → constructor. `ngOnInit` runs *after* inputs settle but before `ngAfterContentInit`/`ngAfterViewInit`; the constructor runs *before* anything.

The hooks aren't going away. Modern Angular adds tools (signals, `effect()`, `DestroyRef`) that subsume *some* of what hooks were used for; the rest remain canonical.
