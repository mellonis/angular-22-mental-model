import { Component, signal } from '@angular/core';

/**
 * TASK
 *
 * Build a temperature-widget component that:
 *   - holds a temperature value as a signal, defaulting to 20
 *   - has three buttons:
 *       - down  → decreases the temperature by 1
 *       - up    → increases the temperature by 1
 *       - reset → sets it back to 20
 *
 * Use `signal()` with `.set()` or `.update()` (your choice — both work).
 * The template should read the value via `temperature()` so it stays
 * subscribed to updates.
 *
 * Run `npm run tick2:task` to see your output at /tick2/task.
 */

@Component({
  selector: 'app-tick2-task',
  template: `
    <h2>Tick 2 — Task</h2>
    <p>Your task is to fill in this component (see the comment above).</p>
    <!-- write your code here -->
  `,
})
export class Tick2Task {
  // write your code here
}
