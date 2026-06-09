import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-tick2-task',
  template: `
    <h2>Tick 2 — Task</h2>
    <p>Temperature: {{ temperature() }}°</p>
    <button (click)="temperature.update(t => t - 1)">down</button>
    <button (click)="temperature.update(t => t + 1)">up</button>
    <button (click)="temperature.set(20)">reset</button>
  `,
  styles: [`
    h2 { margin-top: 0; }
    button { margin-right: 0.5rem; }
  `],
})
export class Tick2Task {
  readonly temperature = signal(20);

  // === Review ===
  // - `signal(20)` creates a reactive primitive with initial value 20.
  //   `.set(v)` replaces; `.update(fn)` derives from the current value.
  // - `down` and `up` use `.update()` because the new value depends on
  //   the current one — `update` is sugar for "read current, set new"
  //   that skips the explicit `temperature()` call.
  // - `reset` uses `.set(20)` because the new value is independent of
  //   the current — no need to read first.
  // - The template reads `temperature()` once. That single read in a
  //   tracked context subscribes the template to the signal. After any
  //   button click, the framework knows exactly which template to
  //   re-render. No `markForCheck`, no `zone.js`.
  // - `readonly` on the field means `this.temperature` can't be
  //   reassigned — but the signal's *value* changes via `.set`/`.update`.
  //   Two different mutability stories.
  // - The literal `20` in `temperature.set(20)` and the `signal(20)`
  //   initializer share a magic number. For a tutorial component
  //   that's fine; in production code you'd extract a named constant
  //   (`const DEFAULT_TEMPERATURE = 20`) and either re-expose it as a
  //   `protected` field (so the template can name it) or add a
  //   `reset()` method that closes over the constant. Both work.
  // - No `computed`, no `effect`, no lifecycle hooks. Ticks 5 and 6
  //   cover those; here `signal()` alone is the whole reactive story.
}
