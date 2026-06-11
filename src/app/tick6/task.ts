import { Component, signal, effect, untracked } from '@angular/core';

/**
 * TASK
 *
 * Build a counter component with an effect-based logger:
 *   - `count` signal initialized to 0
 *   - `step` signal initialized to 1
 *   - displays both `count()` and `step()` in the template so the
 *     current values are visible on the page (not just in the console)
 *   - three buttons:
 *       - "+{step}" — increment count by the current step
 *       - "Reset" — set count back to 0
 *       - "Change step" — cycle step through 1 → 2 → 5 → 1
 *   - an `effect` (in the constructor) that:
 *       - logs every `count` change to the console as `[count] now N (step=M)`
 *         where M is the *current* step value read via `untracked()`
 *       - registers `onCleanup` that logs `[cleanup] previous count was N`
 *         where N is the count captured from the previous effect run
 *   - the effect should track `count` but NOT `step`
 *
 * Verify in the console:
 *   - clicking increment → cleanup log (previous count), then effect log (new count)
 *   - clicking Change step → no log (step is untracked)
 *   - clicking increment again → both logs again, with the new step value
 *
 * Run `npm run tick6:task` to see your output at /tick6/task.
 */

@Component({
  selector: 'app-tick6-task',
  template: `
    <h2>Tick 6 — Task</h2>
    <p>Your task is to fill in this component (see the comment above).</p>
    <!-- write your code here -->
  `,
})
export class Tick6Task {
  // write your code here
}
