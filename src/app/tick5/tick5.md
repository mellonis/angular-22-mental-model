# Tick 5 — `computed()`

> Run: `npm run tick5:example` (demo) · `npm run tick5:task` (exercise)

## Concept

`computed(() => expr)` creates a **derived signal**: a read-only signal whose value is computed from other signals. Read it with `()` just like a regular signal. The function inside is the *derivation*.

Three load-bearing properties:

1. **Lazy** — the function doesn't run until someone reads the computed. If the template doesn't read it, it doesn't compute.
2. **Memoized** — once computed, the value is cached. Reading it again returns the cache without re-running the function. The function re-runs only on the *next read after* a dependency has changed.
3. **Equality-stable downstream** — when the function re-runs and produces the same value as before, subscribers are not notified. The propagation stops at the boundary where the value didn't actually change.

Inside the derivation function, every signal you read (other signals OR other computeds) becomes a dependency. Dependencies are tracked **dynamically** — branches that don't execute aren't tracked, so the dep set can change between runs.

## Example (`example.ts`)

A `Tick5Example` class with a price calculator. Three signals (`items`, `showTax`, plus the constant `TAX_RATE`) drive three chained computeds:

- `subtotal = computed(() => items().reduce(...))` — derives from `items`.
- `tax = computed(() => subtotal() * TAX_RATE)` — derives from `subtotal` (transitively from `items`).
- `total = computed(() => subtotal() + tax())` — derives from `subtotal` AND `tax` (each read once).

Adding or removing an item propagates through the entire chain: `items` changes → `subtotal` recomputes on next read → `tax` recomputes → `total` recomputes. But the order matters: nothing actually runs until the template reads the displayed values.

**The `showTax` toggle demonstrates laziness directly.** When `showTax` is false, the template doesn't read `tax()` or `total()`. Adding items still updates `subtotal()` (the template reads it), but `tax` and `total` never run — Angular knows nobody's listening. Toggle `showTax` back on and they compute fresh from the current `subtotal`.

## Task (`task.ts`)

Build a `Tick5Task` text analyzer:

- A `text` signal initialized to `''`.
- A `<textarea>` bound via `[value]="text()"` and `(input)="onTextInput($event)"`. Extract the event-target cast into a method (templates can't do TS `as` casts inline — same gotcha as tick 4).
- Four computeds:
  - `charCount` — `text().length` (counts everything, including whitespace).
  - `wordCount` — `text().split(/\s+/).filter(w => w.length > 0).length`.
  - `charsInWords` — `text().replace(/\s+/g, '').length` (chars excluding whitespace).
  - `avgWordLength` — `charsInWords() / wordCount()`, but return `0` when `wordCount() === 0`.
- Display all four; format `avgWordLength` with `.toFixed(2)`.

Why not `charCount / wordCount` for the average? `charCount` includes whitespace, so dividing by word count inflates the average — e.g., `'      ds'` gives 8/1 = 8 instead of the actual word length 2. Use `charsInWords` for the math; keep `charCount` for the readout.

The lesson is the *chained read*: `avgWordLength` reads both `wordCount()` and `charsInWords()`, both of which read `text`. When you type, all four recompute on the template's next read. Verify with the browser — every keystroke updates all four numbers.

Run `npm run tick5:task` to see your output at `/tick5/task`.

## Key insights

- **Lazy + memoized = push-pull hybrid.** Signal *writes* push: when a dep changes, computeds reading that dep are marked dirty. Reading a computed *pulls*: if dirty, run the function and cache; otherwise return the cache. The framework only does work when both halves meet — a write happened AND someone reads.
- **Dependencies are dynamic.** Inside the derivation function, every signal read becomes a dep. If a branch doesn't execute, its reads don't register. `computed(() => flag() ? a() : b())` depends on `flag` always, and on `a` OR `b` depending on flag's value.
- **`computed` callbacks must be pure.** No side effects (no DOM writes, no logs you care about, no signal writes — Angular blocks those). The function should produce a value that depends only on its signal reads.
- **Equality-stable downstream.** If `computed(() => x() * 2)` recomputes and the new product equals the cached one, subscribers don't re-run. This is automatic with primitives (Angular uses `===`); for objects you'd need a custom `equal` option (deferred to batch 2).
- **Chained computeds form a graph.** `total = computed(() => subtotal() + tax())` reads two other computeds, which themselves read signals. The framework propagates dirtiness down the graph on writes; on read, it pulls fresh values bottom-up.
- **Don't store the result of `()` and read it later.** `const s = subtotal()` captures *the current value*. If you need the live signal-ness, pass `subtotal` (without parens) as a reference and call it where you need the read.

## Coming from React / Vue / Svelte

- **React `useMemo`**: closest cousin. Both lazy, both memoized. Difference: `useMemo(() => expr, [deps])` needs an explicit dep array; Angular's `computed` auto-tracks dependencies inside the function. Stale-dep-array bugs are impossible with `computed`.
- **Vue 3 `computed`**: same name, same idea, same auto-tracking. The only difference is how you read it (`computed.value` in Vue, `computed()` in Angular).
- **Svelte 5 `$derived(expr)`**: same primitive, compiler-instrumented. Read as a bare identifier; behind the scenes the compiler generates the tracking code.
- **Solid `createMemo`**: same primitive, function-call to read. `const x = createMemo(() => ...)` then `x()`. Angular's API is closest to Solid here.

## Sidebar — pull-push and the computed lifecycle

Angular's reactivity is a **pull-push hybrid**. Pure push (Vue 2-style, RxJS) would re-run every subscriber on every write — expensive and surprising. Pure pull would have to walk the entire graph on every read — slow. Angular splits the work:

**Write phase (push):**
1. `signal.set(v)` writes the value.
2. The framework walks the consumer graph (signals → computeds → templates that read them) and marks each consumer as *dirty*. This is a marker, not a re-run.
3. Templates that read the dirty signals get scheduled for change detection.

**Read phase (pull):**
1. When something reads a computed via `()`:
   - If not dirty, return the cached value. **Zero work.**
   - If dirty, run the derivation function. Compare the new value to the cached one (`===` by default, or custom `equal`).
   - If the value is unchanged, propagation *stops here* — downstream subscribers aren't re-marked dirty. Equality stability.
   - If changed, cache the new value and return it.

This means **a computed only runs when both halves apply**: a dep has changed (push) AND someone reads it (pull). A computed nobody reads is free. A computed with stable deps re-runs only when its deps actually change.

The dep set is rebuilt on every run. Inside the derivation function, Angular tracks every signal/computed read. Reads that don't happen on this run drop out of the dep set. That's how `computed(() => flag() ? a() : b())` works: whichever branch ran on the most recent execution is the only one tracked.

The framework never re-runs a `computed` that nobody reads. It never re-runs a `computed` whose deps haven't changed. It never re-notifies downstream of a recomputed-but-equal value. Three guarantees, all default — you don't pay for what you don't use.
