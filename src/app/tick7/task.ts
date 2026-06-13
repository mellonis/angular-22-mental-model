import { Component, signal } from '@angular/core';

/**
 * TASK
 *
 * Build a "time tracker" child component (`Tick7TaskTracker`) that
 * demonstrates two lifecycle hooks:
 *   - `ngOnInit`: capture `Date.now()` in a private field; log
 *     `[tracker] started at <ISO timestamp>`
 *   - `ngOnDestroy`: compute the elapsed milliseconds since init;
 *     log `[tracker] lived for Nms`
 *
 * The parent (`Tick7Task`) is already wired up below with a
 * `showTracker` signal toggle and `@if` mount/unmount. Just fill in
 * `Tick7TaskTracker`'s class body with the two hooks (and add the
 * `implements OnInit, OnDestroy` clause).
 *
 * Run `npm run tick7:task` to see your output at /tick7/task.
 * Open the console to see the logs.
 *
 * Verify:
 *   - Click "Start tracker" → console logs the start timestamp.
 *   - Wait a few seconds.
 *   - Click "Stop tracker" → console logs the lifetime in ms.
 *   - Click "Start tracker" again → fresh init, fresh start timestamp.
 */

@Component({
  selector: 'app-tick7-task-tracker',
  template: `<p>Tracker is alive.</p>`,
})
export class Tick7TaskTracker {
  // write your code here
}

@Component({
  selector: 'app-tick7-task',
  imports: [Tick7TaskTracker],
  template: `
    <h2>Tick 7 — Task</h2>

    <button (click)="showTracker.update(v => !v)">
      {{ showTracker() ? 'Stop' : 'Start' }} tracker
    </button>

    @if (showTracker()) {
      <app-tick7-task-tracker />
    }
  `,
  styles: [`
    h2 { margin-top: 0; }
  `],
})
export class Tick7Task {
  protected readonly showTracker = signal(false);
}
