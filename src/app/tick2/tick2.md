# Tick 2 — `signal()`

> Run: `npm run tick2:example` (demo) · `npm run tick2:task` (exercise)

## Concept

A **signal** is a value the framework can watch. `signal(initial)` creates one. Read it by *calling* it — `count()` — and write it with `count.set(v)` (replace with a new value) or `count.update(fn)` (derive a new value from the current).

Reading inside a *tracked context* — a template, a `computed`, or an `effect` — records the dependency. Subsequent writes notify everything that read. Reading outside a tracked context (e.g., `console.log(count())` in a method) is just a function call: you get the current value, no subscription.

Signals are why Angular 22 doesn't need `zone.js` to know when to repaint. The framework sees signal writes; signal writes notify subscribers; subscribers re-run. There is no global "something changed, re-check everything" mechanism — tick 12 unpacks the change-detection story in full.

## Example (`example.ts`)

A `Tick2Example` class with `count = signal(0)` and three buttons:

- **Reset** — `count.set(0)`. Replaces with a literal.
- **+1 (via set)** — `count.set(count() + 1)`. Reads the current value, then sets a new one.
- **×2 (via update)** — `count.update(c => c * 2)`. Passes a function that receives the current value and returns the new one.

`.set()` and `.update()` are interchangeable for any write; `.update()` is sugar for "read the current value, then set" — it avoids the explicit `count()` call.

## Task (`task.ts`)

Build a `Tick2Task` class that displays a temperature value. It should default to 20, with three buttons:

- **down** — subtract 1
- **up** — add 1
- **reset** — back to 20

Use `signal()` with `.set()` or `.update()`. Run `npm run tick2:task` to see your output at `/tick2/task`.

## Key insights

- **Reading is a function call.** `count()` — not `count.value`, not bare `count`. This is the load-bearing detail of Angular's signal API.
- **Writing is via a method.** `count.set(v)` for replacement, `count.update(fn)` for derivation.
- **Subscriptions are automatic but contextual.** Reading inside a template subscribes the template. Reading inside a `console.log` doesn't — there's nothing to subscribe.
- **No `useState`-style tuple.** Signals are a single object with methods, not `[value, setValue]`. The signal can be passed around without losing the link between read and write.
- **`signal.asReadonly()`** returns a read-only wrapper (no `.set`, no `.update`). Useful when services publish state.

## Coming from React / Vue / Svelte

- **React `useState`**: `const [count, setCount] = useState(0)`. Tuple-destructured; reading is a bare variable; rules-of-hooks apply. Angular's `signal(0)` is one object; reading is `count()`, writing is `count.set(v)`. Signals can live anywhere — services, fields, helper functions.
- **Vue 3 `ref`**: `const count = ref(0)`; read with `count.value`; write with `count.value = v`. Same primitive shape, different ergonomics. Vue auto-unwraps `.value` in templates; Angular doesn't.
- **Svelte 5 `$state`**: `let count = $state(0)`; read and write as a bare variable, compiler-instrumented. Angular's signals are runtime APIs, not compiler magic.
- **Solid `createSignal`**: `const [count, setCount] = createSignal(0)`. Same call-to-read pattern (`count()`); tuple of getter/setter instead of object-with-methods. Angular's API is closest to Solid, just spelled differently.

## Sidebar — `signal.asReadonly()`

When a service exposes state, you typically want consumers to read it but not mutate it. `signal.asReadonly()` returns a wrapper without `.set` or `.update`:

```typescript
class CounterService {
  private readonly _count = signal(0);
  readonly count = this._count.asReadonly();
  increment() { this._count.update(c => c + 1); }
}
```

Consumers call `service.count()` to read and subscribe; they can't bypass the service's API. We'll see this pattern in tick 10 (services + `inject()`).

## Sidebar — what is `(click)`?

`(click)="..."` is **event binding**. The parentheses signal "this flows *out* of the template back to the component"; the expression inside the quotes runs when the event fires. It's the directional counterpart to `[prop]="expr"` (which flows *into* the template). Tick 3 covers the full binding story — property bindings, attribute bindings, the event payload via `$event`, and `@let` template-local variables.

For tick 2 it's enough to know: every button's `(click)` callback runs the expression you wrote, which writes to a signal, which triggers the template to re-render. The signal mechanics are the lesson; `(click)` is the trigger that exercises them.
