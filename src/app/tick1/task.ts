import { Component } from '@angular/core';

/**
 * TASK
 *
 * Build a standalone component that displays:
 *   - your name (any string)
 *   - the count of years you've been writing code (any number)
 *
 * Use ONLY the @Component decorator and class fields with template
 * interpolation. Do not use signals — they arrive in tick 4.
 *
 * The component should render in the browser at /tick1/task.
 * Run `npm run tick1:task` to see your output.
 */

@Component({
  selector: 'app-tick1-task',
  template: `
    <h2>Tick 1 — Task</h2>
    <p>Your task is to fill in this component (see the comment above).</p>
    <!-- write your code here -->
  `,
})
export class Tick1Task {
  // write your code here
}
