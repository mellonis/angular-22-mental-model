import { Component, signal, effect, untracked } from '@angular/core';

@Component({
  selector: 'app-tick6-task',
  template: `
    <h2>Tick 6 — Task</h2>

    <p>Count: {{ count() }}</p>
    <p>Step: {{ step() }}</p>

    <button (click)="increment()">+{{ step() }}</button>
    <button (click)="reset()">Reset</button>
    <button (click)="nextStep()">Change step</button>

    <p class="hint">Check the console to see effect and cleanup logs.</p>
  `,
  styles: [`
    h2 { margin-top: 0; }
    button { margin-right: 0.5rem; }
    .hint { color: #666; font-size: 0.9rem; margin-top: 1rem; }
  `],
})
export class Tick6Task {
  protected readonly count = signal(0);
  protected readonly step = signal(1);

  constructor() {
    effect(onCleanup => {
      const c = this.count();
      const s = untracked(() => this.step());
      console.log(`[count] now ${c} (step=${s})`);

      onCleanup(() => {
        console.log(`[cleanup] previous count was ${c}`);
      });
    });
  }

  protected increment() {
    this.count.update(c => c + this.step());
  }

  protected reset() {
    this.count.set(0);
  }

  protected nextStep() {
    this.step.update(s => (s === 1 ? 2 : s === 2 ? 5 : 1));
  }

  // === Review ===
  // - The `effect` is registered in the constructor — a valid
  //   injection context. Without that, Angular would throw
  //   `NG0203: effect() can only be used within an injection
  //   context`.
  // - `this.count()` inside the effect creates a tracked
  //   subscription: any future write to `count` schedules the
  //   effect to re-run. `untracked(() => this.step())` reads the
  //   current step *without* registering a subscription, so
  //   `step.update(...)` from `nextStep()` doesn't trigger the
  //   effect. Verify in console: clicking "Change step" produces
  //   no log; clicking increment after a step change uses the new
  //   step value in the log.
  // - `onCleanup` captures `c` (the count from the *registering*
  //   run) in its closure. When the effect re-runs, Angular fires
  //   each registered cleanup first (so you see the "previous"
  //   count), then runs the effect function (logging the new
  //   count). Net effect: every increment produces a cleanup log
  //   followed by a new count log.
  // - `count.update(c => c + this.step())` reads `step` from the
  //   *event handler*, not from inside the effect. Event handlers
  //   are not tracked contexts; reading `step()` here is just a
  //   plain function call. The increment fires synchronously and
  //   completes before the effect schedules its next run.
  // - The `increment` / `reset` / `nextStep` methods are
  //   `protected` to match the access scope of the signals
  //   (template-readable, not external API).
  // - No `computed` involved. If you wanted, e.g., a "ten times
  //   the count" display, you'd reach for `computed` (tick 5), not
  //   another effect. Effects are for the *outside-the-graph*
  //   side effect; computeds are for derivation.
}
