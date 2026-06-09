import { Component } from '@angular/core';

@Component({
  selector: 'app-tick1-task',
  template: `
    <h2>Tick 1 — Task</h2>
    <p>Hello, I'm {{ name }} and I write code for {{ yearsOfCoding }} {{ yearsOfCoding > 1 ? 'years' : 'year' }}.</p>
  `,
})
export class Tick1Task {
  readonly name = 'Ruslan';
  readonly yearsOfCoding = 15;

  // === Review ===
  // - The @Component decorator carries the selector and template; the class
  //   carries the data. Same shape as the example.
  // - `readonly` signals intent — these fields don't change. TypeScript enforces
  //   it; Angular ignores it. Not required to render.
  // - {{ expr }} evaluates expr and inserts `String(expr)` into the DOM at
  //   that point. Inside the braces is a full TypeScript expression — the
  //   ternary `yearsOfCoding > 1 ? 'years' : 'year'` is a regular expression
  //   that happens to live in a template. Tick 3 covers the binding story
  //   in depth ([prop], [attr.x], (event), and so on).
  // - No signals, no lifecycle hooks, no observables. This is the minimum
  //   viable Angular unit: class + decorator + template.
  // - Static `readonly` fields work here only because nothing ever changes.
  //   In tick 2, `signal(...)` arrives as the correct primitive for state
  //   that *does* change; the template re-reads it automatically when it does.
}
