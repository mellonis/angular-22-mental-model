import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-tick3-task',
  template: `
    <h2>Tick 3 — Task</h2>

    @let upperColor = color().toUpperCase();
    @let isRed = color() === 'red';
    @let isGreen = color() === 'green';
    @let isBlue = color() === 'blue';

    <p>Selected: {{ upperColor }}</p>

    <div class="swatch" [style.background]="color()"></div>

    <button [class.selected]="isRed" [attr.aria-pressed]="isRed" (click)="color.set('red')">red</button>
    <button [class.selected]="isGreen" [attr.aria-pressed]="isGreen" (click)="color.set('green')">green</button>
    <button [class.selected]="isBlue" [attr.aria-pressed]="isBlue" (click)="color.set('blue')">blue</button>
  `,
  styles: [`
    h2 { margin-top: 0; }
    .swatch { width: 60px; height: 60px; border: 1px solid #ccc; margin: 0.5rem 0; }
    button { margin-right: 0.5rem; }
    .selected { outline: 2px solid black; }
  `],
})
export class Tick3Task {
  protected readonly color = signal<'red' | 'green' | 'blue'>('red');

  // === Review ===
  // - `signal<'red' | 'green' | 'blue'>('red')` is a typed signal — the
  //   literal-union generic prevents typos at the type-check stage.
  //   `color.set('rad')` becomes a compile error. The generic is optional
  //   (TS would have inferred `string` from `'red'`), but stating it
  //   communicates intent and tightens type safety.
  // - `protected readonly` on the field: `protected` keeps it
  //   template-accessible but not part of the component's external
  //   API; `readonly` enforces "this binding doesn't get reassigned"
  //   (the signal's *value* still changes via `.set()`).
  // - The three buttons each bind two attributes (`[class.selected]`
  //   and `[attr.aria-pressed]`) to the same expression — a CSS class
  //   toggle for visual styling and an ARIA attribute for assistive
  //   tech, both driven from the same source of truth. The expression
  //   itself is named via `@let isRed = color() === 'red';` (and
  //   `isGreen` / `isBlue`) so the buttons read as intent rather than
  //   comparisons. This is the second common `@let` pattern: after
  //   "named derived display value" (`upperColor`), "named condition"
  //   (`isRed`).
  // - `[style.background]="color()"` writes directly to the element's
  //   `style.background` property. The signal's values ('red', 'green',
  //   'blue') are already valid CSS color names, so no transformation
  //   is needed.
  // - `@let upperColor = color().toUpperCase();` introduces a
  //   template-local variable. It's visible in the rest of the
  //   template region; no class field needed for this derived value.
  // - Subscription mechanics: `@let` itself is *naming, not
  //   reactivity*. The subscription lives in the function call
  //   `color()` inside the right-hand side — that call happens in
  //   the template's tracked context, so the template subscribes to
  //   `color`. When `color` changes, the framework re-runs the
  //   template's render function; `@let isRed = color() === 'red';`
  //   re-evaluates, `isRed` gets the new boolean, the bindings using
  //   it pick up the new value. `@let` would not be reactive on its
  //   own — `@let staticValue = 42;` evaluates to a constant on
  //   every render and creates no subscription.
  // - Two consequences: (1) `@let` re-evaluates on every template
  //   render, so put expensive computations in `computed()` (tick 5)
  //   for memoization; (2) all `@let`s share the template's single
  //   subscription scope, they don't create independent ones.
  // - Worth knowing: `[style.x]` also accepts CSS custom properties.
  //   `[style.--bg]="color()"` writes `--bg: red` to the element's
  //   style attribute, which descendant CSS can read via `var(--bg)`.
  //   Useful for theming patterns; tick 3 doesn't require it.
  // - The three buttons (and the three `@let` lines) could be reduced
  //   to a `@for` loop over an array of color names — that's a tick 4
  //   trick (built-in control flow). For tick 3 we hard-code three
  //   buttons to stay on topic.
}
