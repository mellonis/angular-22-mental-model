# Tick 4 — Built-in control flow (`@if`, `@for`, `@switch`)

> Run: `npm run tick4:example` (demo) · `npm run tick4:task` (exercise)

## Concept

Angular 17 introduced three built-in template blocks for control flow: `@if`, `@for`, and `@switch`. They're **language-level constructs** — the template compiler reads them directly and emits the corresponding render code. They are NOT structural directives (the legacy `*ngIf`/`*ngFor`/`*ngSwitch` pattern); there's no `<ng-template>` indirection, no directive class loaded at runtime. Smaller bundle, simpler mental model.

**Terminology — each `@name (...) { ... }` thing is a "block".** `@if`, `@for`, `@switch` are **primary blocks** (they open a control-flow section on their own). Inside them, **secondary blocks** carry the branches: `@empty` (only inside `@for`), `@else if` and `@else` (only inside `@if`), `@case` and `@default` (only inside `@switch`). `@let` (from tick 3) is also a block, but it's a declaration, not control flow. Blocks are not operators, not directives, not JS statements — they're template-language constructs.

### `@if` / `@else if` / `@else`

```html
@if (cond) {
  ...
} @else if (otherCond) {
  ...
} @else {
  ...
}
```

The expression in parens is a regular TypeScript boolean. The blocks render exactly like a normal `if`/`else if`/`else` chain. There's an `@if (expr; as alias) { ... }` form that narrows a nullable signal and binds the non-null value to `alias` inside the block — useful for skipping null checks.

### `@for ... @empty`

```html
@for (item of items; track item.id;
      let i = $index, first = $first, last = $last) {
  ...
} @empty {
  ...
}
```

`@for`'s contract: an iterable, a `track` expression, optional `let` aliases for context variables, and a block body. An optional `@empty` block renders when the iterable is empty.

**`track` is mandatory.** It's an expression evaluated per item that returns a stable identifier (any primitive). Angular uses the identifier to decide which DOM nodes to keep, move, or remove when the list changes. Without stable identifiers, Angular would have to rebuild DOM on every list mutation — the pre-v17 `trackBy` was optional and a common perf footgun, so `@for` made it required.

**Implicit context vars:** `$index`, `$first`, `$last`, `$even`, `$odd`, `$count`. Each is aliasable via `let name = $index` (etc.).

### `@switch` / `@case` / `@default`

```html
@switch (expr) {
  @case ('a') { ... }
  @case ('b') { ... }
  @default { ... }
}
```

Strict equality (`===`) on the value. `@default` is optional but recommended for exhaustiveness.

## Example (`example.ts`)

A `Tick4Example` class with a todo list driven by `todos = signal<Todo[]>([])` and a `draft = signal('')` for the input. Three control-flow blocks each earn their place:

- **`@if (todos().length > 0) ... @else`** drives a banner above the list: "X todos (Y pending)" when there are todos, or "Add your first todo above ↑" when empty. Always one or the other.
- **`@for ... @empty`** drives the list itself. `track todo.id` keys DOM by todo ID; `let i = $index, first = $first, last = $last, even = $even` alias context vars for styling.
- **`@switch (todo.status)`** branches per row: `'pending'` shows action buttons, `'done'` shows undo, `@default` (catches `'cancelled'` and anything else) is dimmed.
- **`@let pendingCount = todos().filter(t => t.status === 'pending').length;`** (from tick 3) names the derived count without a class field.

## Task (`task.ts`)

Build a `Tick4Task` 5-day weather forecast:

- A `forecast = signal<Day[]>([…])` is pre-initialized with five days.
- An `@if`/`@else` header: "5-day forecast" if non-empty, "No forecast loaded" if empty.
- An `@for` over the forecast, tracking by `day.day` (day name as stable id). Highlight today (`$first`) with a `.today` class.
- A `@switch` per row on `day.condition`: `'sunny'` → "☀️ Sunny", `'cloudy'` → "☁️ Cloudy", `'rainy'` → "🌧️ Rainy", `@default` → "❓ Unknown".
- An `@empty` block within `@for` for "(no days)".
- Show the high temp as `{{ day.highF }}°F` next to the condition.

Run `npm run tick4:task` to see your output at `/tick4/task`.

## Key insights

- **Built-in blocks are language-level.** The compiler emits direct render code; no structural directive, no `<ng-template>` indirection. Compared to the pre-v17 `*ngIf`/`*ngFor`/`*ngSwitch` (which were directives operating on hidden `<ng-template>` views), the new blocks are smaller, faster, and clearer to read.
- **The `@name` things are called "blocks".** Primary blocks (`@if`/`@for`/`@switch`) open a control-flow region. Secondary blocks (`@empty`/`@else if`/`@else`/`@case`/`@default`) carry branches inside their primary. You can't define a custom `@myBlock` — the set is fixed by the template language.
- **`track` is mandatory in `@for`.** Pre-v17's `trackBy` was optional; people often skipped it and paid for it. The new `@for` makes you state it. For database-backed items, use the primary key (`track item.id`). For static or computed arrays, a unique field (`track item.name`) works as long as it's stable.
- **`@empty` belongs to `@for`.** Use it when the empty case is part of the list's own story. If the empty case is conceptually different (e.g., "we haven't loaded yet" vs "the response was empty"), use a separate `@if` outside the list.
- **`@if` supports `@else if` and `@else`.** The `@if (expr; as alias)` form binds the truthy result to a name — useful for narrowing nullable signals without repeated calls.
- **`@switch` does strict equality.** No type coercion. `@case (1)` doesn't match `'1'`. `@default` catches the unmatched case, including any future enum values you forgot to enumerate.
- **Context vars in `@for` are implicit and aliasable.** `$index` / `$first` / `$last` / `$even` / `$odd` / `$count`. Inside the `@for` body, read them directly; alias with `let name = $index` for a shorter local name.

## Coming from React / Vue / Svelte

- **React**: control flow in JSX is plain JS — `{items.map(x => <li key={x.id}>…</li>)}` is `@for`; `cond && <X/>` or `cond ? <X/> : <Y/>` for `@if`. No `@switch` — you write nested ternaries or extract a render function. React's `key` prop is exactly Angular's `track` expression — the same per-item-stable-identifier idea, same DOM-reuse reason.
- **Vue 3**: `v-for="x in items" :key="x.id"` ≈ `@for ... track x.id`. `v-if` / `v-else-if` / `v-else` ≈ `@if`/`@else if`/`@else`. Vue's `v-for` and `v-if` are directives applied to elements; Angular's modern blocks wrap multiple elements at the language level.
- **Svelte**: `{#each items as item (item.id)}…{/each}` ≈ `@for ... track item.id` — Svelte's keying syntax `(item.id)` is the closest cousin to Angular's `track`. `{#if cond}…{:else}…{/if}` ≈ `@if`/`@else`. `{#each items as item}…{:else}…{/each}` ≈ `@for ... @empty`. Svelte's `{#each}` shares the empty-fallback inline; Angular separates it into a labeled `@empty` block.

## Sidebar — `track` and the diff layer

When the items signal changes, Angular re-runs the `@for` block. To decide what to do with the existing DOM, it needs to know which items in the *new* list correspond to which items in the *old* list. That's what `track` provides: an expression that returns a stable identifier per item.

What Angular does with that identifier:
- **Matched identifier, same position**: keep the DOM, update bindings if any input changed.
- **Matched identifier, different position**: move the DOM node to the new position. No teardown, no rebuild.
- **Identifier missing from new list**: destroy the DOM node.
- **New identifier**: create a new DOM node, render the block body.

Without a stable `track`, the framework would have to assume "everything is potentially new" and rebuild the whole list on every change. That's the perf footgun pre-v17 `*ngFor` users would hit when they forgot `trackBy`.

For a real-world list backed by a server response (which produces fresh object references on every fetch), `track item.id` makes the diff trivial: same IDs → reuse DOM. For a static or computed array, `track $index` is acceptable but rarely what you want — it confuses moves with replacements.

The structural-directives legacy reference (`*ngFor`'s `trackBy` and the rest of `*ngIf`/`*ngFor`/`*ngSwitch` → `@if`/`@for`/`@switch` mapping) lives in tick 3's sidebar. The shape difference: `trackBy: trackFn` was a callback returning the key; `track expr` is an inline expression evaluated per item. Modern is shorter and harder to forget.

## Sidebar — signals don't watch nested mutation

Tick 4's example mutates the todos array via `update`:

```typescript
this.todos.update(list => list.map(t =>
  t.id === id ? { ...t, status: 'done' } : t
));
```

Notice that `list.map(...)` returns a **new array**, and `{ ...t, status: 'done' }` returns a **new object** for the changed todo. That matters: signals track *value replacement* (calls to `.set` and `.update`), not deep mutation of the value they hold.

If you wrote this instead:

```typescript
this.todos()[0].text = 'mutated!';   // ✗ template won't re-render
```

…the signal would never fire. The signal's stored reference (the array) didn't change; you mutated an object the array points to. From the signal's perspective, nothing happened — no notifications, no subscribers re-run, the template stays as-is. The data has changed in memory, but the framework has no way to know.

The mutation might *appear* in the UI later, if some other event triggers a re-render of this component for an unrelated reason. That non-determinism is exactly why the rule is: **never mutate signal contents; always produce a new value via `.set` or `.update`.**

Why signals work this way: deep-watching every nested object would be expensive (Vue 3's `Proxy`-based reactivity pays for this), and the explicitness of "writes only happen through `.set`/`.update`" prevents surprise re-renders. The trade-off: a small amount of immutability discipline in exchange for predictable, fast, traceable reactivity.

The `toggle` and `cancel` methods in `example.ts` show the canonical pattern: `list.map(t => t.id === id ? { ...t, status: … } : t)`. Same idea works for nested objects (`{ ...obj, nested: { ...obj.nested, prop: newVal } }`), arrays of arrays, and so on. Tools like Immer (which produces an immutable update from a mutation-shaped callback) can make this less verbose at the cost of a runtime dependency.
