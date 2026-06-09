# Tick 3 — Template syntax (bindings and events)

> Run: `npm run tick3:example` (demo) · `npm run tick3:task` (exercise)

## Concept

Angular templates have four "directions" for data flow between the component class and the rendered DOM:

1. **Interpolation** — `{{ expr }}`. Reads from the class into a text position in the template.
2. **Property binding** — `[prop]="expr"`. Reads from the class into a *JavaScript property* on the DOM element.
3. **Attribute binding** — `[attr.x]="expr"`. Reads from the class into an *HTML attribute*. Use this when the attribute and property differ (ARIA, `data-*`, SVG, `aria-label`, etc.) or no JS property exists.
4. **Event binding** — `(event)="expr"`. Runs an expression *back into* the class when the event fires. `$event` is the implicit event payload.

Plus the local-variable form:

5. **`@let foo = expr;`** — introduces a template-local variable scoped to the rest of the current template region. Useful for naming a derived value without putting it on the class.

Every binding expression is a full TypeScript expression, strict-type-checked against the component class. Ternaries, method calls, property access, string concatenation — all work.

## Example (`example.ts`)

A `Tick3Example` class with `volume = signal(50)` rendered through every binding form:

- The `<input type="range">` syncs with the signal via `[value]="volume()"` (property binding in) and `(input)="onSliderChange($event)"` (event out, reading `$event.target.value`).
- `Volume: {{ volume() }}` interpolates the current value.
- `@let label = volume() + '%';` introduces a derived display label.
- `[class.loud]="volume() > 80"` toggles a CSS class when the volume crosses 80.
- `[style.width.px]="volume() * 3"` sets the visual bar's width — the `.unit` suffix appends `px` to the number automatically.
- `[style.background]="volume() > 80 ? '#fee' : '#efe'"` ties the bar's background to the same threshold.
- `[attr.aria-label]="'Reset volume from ' + volume()"` writes a dynamic ARIA label on the Reset button.

The example reuses the `signal()` primitive from tick 2; derived values stay inline as template expressions (`volume() > 80 ? … : …`). Tick 5 introduces `computed()` for derived values that you want memoized and named.

## Task (`task.ts`)

Build a `Tick3Task` color picker:
- A `color = signal('red')` field.
- Three buttons (`red`, `green`, `blue`); clicking sets the signal to that color.
- The active button gets a `selected` class via `[class.selected]`.
- Each button gets `[attr.aria-pressed]="color() === 'red'"` (and similar for the others) for accessibility.
- A preview swatch using `[style.background]="color()"`.
- An interpolation showing the current color.
- An `@let upperColor = color().toUpperCase();` displayed somewhere.

Practice every binding form from the spec except `[value]`/`(input)`/`$event` — those are the example's job.

Run `npm run tick3:task` to see your output at `/tick3/task`.

## Key insights

- **`[prop]` vs `[attr.x]` is real.** Property and attribute can differ. Examples: `<input disabled>` — the property is `disabled` (a boolean), the attribute is the empty string (presence-based). Most of the time `[prop]` is what you want; reach for `[attr.x]` for ARIA, `data-*`, SVG, or any attribute without a matching JS property.
- **`$event` is implicit.** Inside an event-binding expression, `$event` is the event object. For `(input)`/`(change)`, `($event.target as HTMLInputElement).value` is the cast pattern.
- **`[style.prop.unit]` appends the unit.** `[style.width.px]="50"` → `width: 50px`. Saves the string-template gymnastics.
- **`@let` is template-local.** It doesn't add a field to the class. The name is in scope from its declaration to the end of the template region (template / block / structural directive body). Re-declare in another region if needed.
- **Templates are TypeScript.** Expressions are type-checked against the component class. `volume() > 80 ? 'too loud!' : 'ok'` is a regular TS ternary that lives inside `{{ … }}`.
- **No `[class]` / `[style]` general form here.** The spec scopes tick 3 to the `[class.x]` / `[style.prop]` specialized forms. The general object/array forms (`[class]="{ active: x }"`) appear in batch 3 if at all.

## Coming from React / Vue / Svelte

- **React**: `onChange={(e) => setVolume(+e.target.value)}` ≈ `(input)="volume.set(+$event.target.value)"`. React's `style={{ width: ` + "`${volume * 3}px`" + ` }}` is the closest cousin of Angular's `[style.width.px]="volume() * 3"`. React has no attribute/property distinction at the JSX level — Angular's `[prop]` vs `[attr.x]` is unfamiliar.
- **Vue 3**: `:disabled="cond"` ≈ `[disabled]="cond"`. `:style="{ width: volume + 'px' }"` ≈ `[style.width.px]="volume()"`. `@click="…"` ≈ `(click)="…"`. Vue's `v-bind` short form `:prop` maps cleanly to Angular's `[prop]`. `@let` has no Vue analogue — closest is a `computed` or a `setup`-scoped const.
- **Svelte**: `{volume}` ≈ `{{ volume() }}` (Svelte 5 reads bare, Angular calls). `class:loud={volume > 80}` ≈ `[class.loud]="volume() > 80"`. `style:width="{volume * 3}px"` ≈ `[style.width.px]="volume() * 3"`. `on:click={fn}` ≈ `(click)="fn()"`. The `@let` block matches Svelte's `{@const x = …}`.

## Sidebar — structural directives the legacy way

In pre-v17 Angular code you'll see `*ngIf`, `*ngFor`, and `*ngSwitch` instead of the modern `@if`/`@for`/`@switch` control flow. Quick reference for reading legacy templates:

| Legacy | Modern equivalent |
|--------|-------------------|
| `<div *ngIf="cond">…</div>` | `@if (cond) { <div>…</div> }` |
| `<div *ngIf="cond; else other">…</div>` `<ng-template #other>…</ng-template>` | `@if (cond) { <div>…</div> } @else { … }` |
| `<li *ngFor="let item of items; trackBy: trackFn">…</li>` | `@for (item of items; track item.id) { <li>…</li> }` |
| `<div *ngFor="let item of items; let i = index">…</div>` | `@for (item of items; track item.id; let i = $index) { <div>…</div> }` |
| `<div [ngSwitch]="x"><div *ngSwitchCase="1">…</div></div>` | `@switch (x) { @case (1) { <div>…</div> } }` |

The legacy syntax is a *structural directive*: the leading `*` is sugar that desugars to `<ng-template>` + a directive that creates/destroys views. The modern `@if`/`@for`/`@switch` are language-level constructs compiled directly — no `<ng-template>` indirection, smaller bundle. Tick 4 covers the modern control flow in depth.
