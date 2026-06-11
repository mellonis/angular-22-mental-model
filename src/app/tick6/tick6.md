# Tick 6 — `effect()`

> Run: `npm run tick6:example` (demo) · `npm run tick6:task` (exercise)

## Concept

`effect(fn)` runs `fn` whenever its tracked signal dependencies change. Unlike `computed`, an effect doesn't return a value — it's the **side-effect-on-change** primitive. Touch the DOM, log to console, send a network request, sync to `localStorage`, set a `<title>` — anything outside the signal graph.

Three properties shape the behaviour:

1. **Eager (not lazy).** The effect runs once immediately after creation (to establish initial state), and again at the next microtask after any tracked dep changes. There's no "no-one's reading" optimisation like there is for `computed` — effects run because their *output* (the side effect) needs to happen.
2. **Auto-tracked.** No dep array. Every signal you read inside the effect function becomes a dep on this run. Dependencies are dynamic: branches that don't execute aren't tracked.
3. **Signal writes are blocked by default.** You can't do `someSignal.set(v)` inside an effect — Angular throws. The contract is "effects produce *external* side effects." If you find yourself wanting to write a signal from an effect, you probably want `computed()` instead. (There's an `allowSignalWrites: true` opt-out, but it's almost always a smell — see the long-form sidebar.)

### `onCleanup` — releasing resources

The effect function receives an `onCleanup` parameter. Pass it a cleanup callback to release whatever the effect acquired:

```typescript
effect((onCleanup) => {
  const id = setInterval(() => doSomething(), 1000);
  onCleanup(() => clearInterval(id));
});
```

The cleanup runs **before each next effect run** (so you cancel the previous run's resources before starting fresh) and **when the component is destroyed** (so resources don't leak after teardown). Variables captured in the cleanup closure see the values from the run that *registered* the cleanup — useful when you want to log what's being torn down.

### `untracked` — reading without subscribing

Sometimes you need a signal's value as *context* without making it a dep. `untracked(() => signal())` reads the current value without registering a subscription:

```typescript
effect(() => {
  const text = this.text();                      // tracked: re-run when text changes
  const userId = untracked(() => this.userId()); // not tracked: just current value
  this.sendAnalytics(text, userId);
});
```

Common use: logging context (user ID, locale, timestamp) that you read but don't want to drive the effect.

### Injection context

Effects must be created in an **injection context** — a component constructor, a service constructor, a field initialiser, or a function called with an `Injector`. The constructor is the most common place.

## Example (`example.ts`)

A `Tick6Example` with two signals (`name`, `color`) and one effect:

- The effect reads `name()` (tracked) and `color` via `untracked()` (not tracked). When `name` changes, the effect re-runs: `document.title` updates, the console logs the new state.
- Changing `color` updates the paragraph's color (via the `[style.color]="color()"` template binding) but does NOT re-run the effect — that's `untracked` doing its job.
- `onCleanup` captures `currentName` from the run that registered it. On the next effect run (after a name change), the cleanup logs the *previous* name first, then the new effect run logs the new name. You see both in the console.

The lesson: effects react to writes through dependency tracking; you opt out per-read via `untracked()`; you release per-run resources via `onCleanup`.

## Task (`task.ts`)

Build a `Tick6Task` counter:

- `count = signal(0)`, `step = signal(1)`.
- Display both `count()` and `step()` in the template so the current values are visible on the page (not just in the console).
- Three buttons: increment by step, reset to 0, cycle step (1 → 2 → 5 → 1).
- In the constructor, register an `effect` that:
  - Logs `[count] now N (step=M)` where N is `count()` (tracked) and M is `step` read via `untracked()`.
  - Registers `onCleanup` that logs `[cleanup] previous count was N`.

Verify in console: incrementing fires the effect; changing step does not; cleanup logs the previous count before each new effect log.

Run `npm run tick6:task` to see your output at `/tick6/task`.

## Key insights

- **Effects are eager.** They run once after creation and again on every tracked-dep change. No "skip if nothing observes" — the side effect IS the observation.
- **Auto-tracked deps; no dep array.** Every signal/computed read inside the effect on this run becomes a dep. No stale-closure bugs because there's no dep array to forget to update.
- **`onCleanup` runs twice per effect lifetime per cleanup registration**: before the next effect run (releasing the previous run's resources) and on component destroy (final teardown). Capture values in the closure to remember what's being torn down.
- **`untracked` opts out per-read.** A single effect can have some tracked deps and some untracked reads — useful when most of an expression should drive the effect but one piece is just context.
- **Signal writes are blocked.** Effects are for *outside-the-graph* side effects. Writing a signal inside an effect throws by default (the `allowSignalWrites` opt-out exists but is almost always wrong — prefer `computed` for derivations).
- **Injection context required.** Constructor of a component or service, or a function called inside `runInInjectionContext(injector, fn)`. Field initialisers also work.

## Coming from React / Vue / Svelte

- **React `useEffect`**: closest cousin shape-wise but different model. React needs an explicit dep array (`useEffect(fn, [deps])`); stale-dep-array is the #1 bug. Angular auto-tracks — no dep array. React's effect returns the cleanup function; Angular uses an `onCleanup` parameter. React effects run after render; Angular effects run at the next microtask after a write, before render commits.
- **Vue 3 `watchEffect`**: identical model. Same auto-tracking, same eager run. `onWatcherCleanup` (or the callback's first arg in older versions) is Vue's analogue of `onCleanup`.
- **Svelte 5 `$effect`**: same auto-tracking, same eager run. The cleanup function is the return value of the effect (like React) rather than a separate parameter.
- **Solid `createEffect`**: same model. Cleanups are registered via `onCleanup` (function imported from Solid), similar to Angular.

## Sidebar — why are signal writes in effects blocked?

The short answer: **infinite loops**. If `effect(() => signal.set(signal() + 1))` were allowed, the write would mark the effect dirty, which would schedule the effect to re-run, which would write, which would mark dirty, forever.

The longer answer: **the reactive graph has to terminate.** Computeds form a directed acyclic graph — writes propagate dirtiness downstream, reads pull fresh values upstream, but no cycles. Effects sit at the "edges" of the graph: they read from the graph and act on the outside world (DOM, network, console). If effects could write back into the graph, they'd create cycles and the framework couldn't guarantee termination.

The opt-out `effect(fn, { allowSignalWrites: true })` exists for migration cases and rare circumstances, but it's almost always wrong. The legitimate alternatives:

- **You wanted a derived value, not a side effect.** Use `computed()`. The derivation is declarative, memoised, equality-stable downstream — all the things effects with writes can't provide.
- **You wanted to react to an event.** Don't react via the signal graph — react via the event handler. `(click)="foo.set(...)"` is the explicit, traceable form.
- **You wanted to debounce or throttle a signal.** That's a *real* signal write driven by an effect, and it's a hard case. Patterns include: use RxJS `toSignal`/`toObservable` (batch 2 territory), or split the input signal from the output signal (you write input directly; an effect reads input + a debounced timer to set output). Even then, prefer not to — the resulting cycle is fragile.

Rule of thumb: if you reach for `allowSignalWrites: true`, take a step back and ask whether `computed()` is what you actually wanted.
