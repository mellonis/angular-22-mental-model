# Angular 22 Mental Model — Batch 1 design

Spec for the first batch of ticks (1–10). Locks in the repo shape, audience, runtime, and per-tick scope. Subsequent batches get their own design docs.

## Decisions log

The route through the brainstorming, condensed so the *why* survives without re-reading the conversation:

- **Audience: "knows another framework, new to Angular's modern story."** Reader has shipped React/Vue/Svelte; understands components and reactivity as concepts; doesn't know Angular's specifics (DI tree, decorators, the standalone/signals/zoneless transition). The reader knows what interpolation, binding, and control flow *are* — but Angular's flavor of those (`{{ }}` vs `[prop]` vs `[attr.x]`, `(event)` vs `@click`, `@if`/`@for`/`@switch` with `track`/`$index`) gets taught as first-class ticks, not glossed.
- **Runtime: pure Angular CLI workspace.** Originally hybrid (`tsx` for API ticks + CLI for DOM) was selected, but that was tied to expert framing. For this audience, signals-as-a-Node-API is unmotivating — they came for *Angular's* mental model, which lives in the framework runtime. The `tsx` mode is retired for batch 1.
- **Batch size: 12 ticks.** Materially over the 5–9 soft cap. The "knows-another-framework" audience, combined with the call to teach Angular's flavor of fundamentals as first-class ticks (template syntax, control flow) and to practice legacy patterns (decorator IO, lifecycle hooks), expands batch 1 into the full Angular-as-Angular spine. Batches 2+ pick up routing, forms, HTTP, SSR, interop.
- **Commit discipline: two commits per tick** — `docs(tickN):` scaffold then `feat(tickN):` solution + cheatsheet. Pattern mirrors [mellonis/rxjs-mental-model](https://github.com/mellonis/rxjs-mental-model). Restated in `CLAUDE.md`.
- **Dependency pinning: latest stable.** The tick 1 `docs` commit runs the latest stable `@angular/cli` and lets `ng new` pin whatever Angular / TypeScript / Node versions ship at that moment. No conservative version-locking; the repo's intent is to teach the modern story, so it should track the modern story as it lands.

## Repo shape

- Single Angular CLI workspace at the repo root, scaffolded by `ng new` in the first tick's `docs` commit. Exact CLI flags pinned at implementation time, but the workspace is standalone-only and routing-enabled.
- Per-tick directory under `src/app/tickN/`:
  - `example.component.ts` (+ supporting components/templates as needed) — the runnable concept demo.
  - `task.component.ts` — the exercise. `// write your code here` in the `docs(tickN):` commit; worked solution + `// === Review ===` notes in the `feat(tickN):` commit.
  - `tickN.md` — prose: concept · example · task · key insights · "coming from React/Vue/Svelte" sidebar.
- `app.routes.ts` exposes `/tickN/example` and `/tickN/task` for each tick.
- `package.json` per-tick scripts: `tickN:example` and `tickN:task` each `ng serve` the workspace with a configuration that opens the corresponding route. Auto-navigation may use `ng serve -o --open-target /tickN/example` or equivalent — pinned at implementation time.
- `CHEATSHEET.md` lives at the root, grown one section per `feat(tickN):` commit.

## Tick anatomy

- `example` and `task` are **separate routes**, not separate Node programs as in the RxJS sibling. Their component state and console output don't interleave because the user navigates to one at a time via `npm run tickN:example` / `npm run tickN:task`.
- Each `tickN.md` carries a **"coming from React/Vue/Svelte" sidebar** — one paragraph naming the analogous primitive in those frameworks and where Angular's diverges. High signal for this audience, cheap to write.
- **Long-form sidebars** (one paragraph each, in the relevant tick's `tickN.md`):
  - Tick 1: NgModule history (what it was, why standalone replaced it, what you'll see in old codebases).
  - Tick 3: structural-directive quick reference (`*ngIf`/`*ngFor`/`*ngSwitch` ↔ `@if`/`@for`/`@switch`) — for reading legacy templates.
  - Tick 12: OnPush + `markForCheck` + zone.js history (legacy context for the modern zoneless default).

## Batch 1 arc

| # | Topic | Key idea |
|---|-------|----------|
| 1 | **Standalone component + `bootstrapApplication()`** | Angular's shape: class + `@Component` decorator + template string + `bootstrapApplication(AppRootComponent)` as the entry. No `AppModule`. Workspace scaffolds here. Sidebar: what `NgModule` was and why standalone replaced it. |
| 2 | **Template syntax — bindings and events** | `{{ expr }}` (interpolation: stringification in a tracked context), `[prop]="expr"` (typed property binding), `[attr.aria-label]="expr"` (HTML attribute binding — and when it differs from the property binding), `[class.x]="cond"` / `[style.color]="…"` (specialized class/style bindings), `(event)="…"` + `$event`, `@let foo = expr` (v19+ template-local variables). The "how does the template read from and write back to the component" tick. |
| 3 | **Built-in control flow** | `@if` / `@else if` / `@else`, `@for (item of items; track item.id)` with `@empty` and the implicit context vars (`$index`/`$first`/`$last`/`$even`/`$odd`/`$count`), `@switch` / `@case` / `@default`. Why `track` is mandatory and what it does at the diff layer. Sidebar: `*ngIf` / `*ngFor` / `*ngSwitch` quick reference for reading legacy templates. |
| 4 | **`signal()`** | The reactive primitive. `signal(initial)`, `.set(v)`, `.update(fn)`. Reading inside a tracked context subscribes; reading outside is just a function call. Not `useState` (no setter callback, no rules-of-hooks); closer cousin to Solid signals. |
| 5 | **`computed()`** | Lazy + memoized derived state. Recomputes only when next read *after* a dep changed; never recomputes if no one reads it. Equality-stable downstream. |
| 6 | **`effect()`** | Side effects on change. `onCleanup`, `untracked`, why writes-to-signals-in-effects are blocked by default. One-paragraph contrast to `useEffect`: no dep array — auto-tracked. |
| 7 | **Lifecycle hooks** | What `effect()` *can't* replace: deterministic destruction (`ngOnDestroy`), post-view-init reads (`ngAfterViewInit`/`ngAfterContentInit`), single-shot init ordering (`ngOnInit`). Also `ngOnChanges` for input-change reactions in the legacy IO world (seeds tick 9). Framing: "the modern signal model covers most cases; these hooks are the remainder." |
| 8 | **`input()`, `output()`, `model()`** | Signal-shaped component IO. Required vs optional inputs (`input.required<T>()` is a typed signal), typed event payloads via `output<T>()`, two-way via `model()`. The signal IO is genuinely novel to Angular and the centerpiece of the modern mental model. |
| 9 | **Legacy IO — `@Input()`, `@Output()`, `[(foo)]`** | The same parent/child pair from tick 8, written decorator-style. Three traps: `@Input` can't be read in the constructor (set post-construction); `@Output()` returns `EventEmitter`, which is a `Subject` underneath — RxJS-as-event-bus history surfaces; `[(x)]` desugars to `[x]/(xChange)`, a naming convention, not a primitive. `ngOnChanges` is how decorator-inputs react to changes. The task ports a function-form component back to decorator form. |
| 10 | **Service pattern + `inject()`** | A service is a class with `@Injectable({ providedIn: 'root' })`; the component consumes via `inject(MyService)` in an injection context. Same instance shared across consumers. Compare: React Context (without the provider tree at the call site), Vue `provide`/`inject` (closer cousin). |
| 11 | **Injectors as a tree** | What "injection context" actually means; root injector vs component-level `providers: [...]`; same token resolves to different instances down the tree; `useFactory`/`useValue`/`useClass`/`useExisting`. The genuinely-unique-to-Angular mechanism — no React/Vue equivalent at this depth. |
| 12 | **Zoneless change detection** | What triggers a re-render in a signal-based component (signal write → CD scheduled for the components that read that signal). Why the modern default is zoneless. Sidebar: the legacy story — `ChangeDetectionStrategy.OnPush`, `markForCheck()`, zone.js as the "everything re-renders by default" mechanism. |

## What batch 1 deliberately leaves out

Defer to batch 2:

- **Routing** — `provideRouter`, route configuration, navigation, route params as signals.
- **Signal Forms** (the modern v22 forms story), with `ReactiveFormsModule` / `FormsModule` as legacy sidebars.
- **HTTP** — `httpResource` (modern), with `HttpClient.get(...).subscribe(...)` as legacy sidebar.
- **RxJS interop** — `toSignal` / `toObservable`, with the `async` pipe as legacy sidebar.
- **Template queries** — `viewChild()` / `contentChild()`, with `@ViewChild` / `@ContentChild` as legacy sidebar.
- **SSR + hydration** — `provideClientHydration`, full SSR entry, incremental hydration.
- **Signal refinements** — `linkedSignal`, custom equality, `resource`.

Defer indefinitely (probably never):

- Full NgModule-as-application patterns (declaring/importing/exporting/`platformBrowserDynamic().bootstrapModule(AppModule)`). Reading-only coverage via the tick 1 sidebar; not writing.
- Legacy decorator template queries beyond the batch-2 mention.
- `RxJS`-in-templates as a primary pattern (it appears in interop only).

## Commit shape per tick

Restated from `CLAUDE.md` for completeness:

1. **`docs(tickN): <topic> — concept, example, task scaffold`**
   - Adds `src/app/tickN/example.component.ts`, `src/app/tickN/task.component.ts` (ending in `// write your code here`), `src/app/tickN/tickN.md`, route entries for `/tickN/example` and `/tickN/task`, and the `tickN:example` / `tickN:task` npm scripts.
   - Reader can `git checkout` this commit to attempt the task without spoilers.
2. **`feat(tickN): <topic> — solution + cheatsheet`**
   - Fills `task.component.ts` with the worked solution and `// === Review ===` notes.
   - Appends that tick's section to `CHEATSHEET.md` (header range grows `Ticks 1–N`).

Plus the existing root `chore:` setup commit. The first tick's `docs` commit also lands the `ng new` workspace scaffold (one-time setup cost; the per-tick `docs` shape is preserved for all subsequent ticks).

## Cross-cutting writing conventions

- Every `tickN.md` includes a **"coming from React/Vue/Svelte" sidebar** with three short bullets: React analogue, Vue analogue, Svelte analogue. Each names the primitive and the one-line divergence from Angular's version.
- Modern syntax is the default in every example. Legacy syntax appears only where the tick is explicitly about it (tick 7) or in sidebars.
- Templates use `@if`/`@for`/`@switch` throughout. `*ngIf`/`*ngFor`/`*ngSwitch` appear only in the tick 3 sidebar reference table.
- Imports use the standalone style — no `NgModule.declarations` anywhere outside the tick 1 sidebar's code-fence example.

## Open questions deferred to the implementation plan

- Exact `ng new` flags (e.g., `--standalone`, `--routing`, `--style`, `--ssr no`, `--zoneless`). Pin in the tick 1 `docs` commit.
- Whether to ship a minimal nav layout (links between ticks) or leave each route bare. Recommendation: bare for batch 1, revisit if it hurts navigation when ticks accumulate.
- Whether `npm run tickN:example` auto-opens the route in the browser (`-o --open-target /tickN/example`) or just serves and prints the URL.
- Whether `task.component.ts` should compile when it ends in `// write your code here` (e.g., the function returns `null as any`, or the template renders a placeholder). Recommendation: yes — the `docs(tickN):` commit must build cleanly so the learner can `ng serve` and see "your task goes here" rendered.
- TypeScript / Angular minor versions: take whatever `ng new` scaffolds at the time of the tick 1 `docs` commit; pin in `package.json` lockfile.

## Non-goals

- Teaching what a component, prop, or reactivity primitive is — the audience already has this.
- Building one continuous app across all ticks (the Angular AI Tutor's "Smart Recipe Box" approach). Conflicts with one-isolated-concept-per-tick and breaks `git checkout <docs-commit>` as a clean practice mode.
- Pinning Angular minor versions in this spec — the implementation plan pins them.
- Covering every Angular API. The arc covers the *mental model*; reference material is on angular.dev.
