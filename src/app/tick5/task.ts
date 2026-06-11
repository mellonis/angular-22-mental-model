import { Component, signal, computed } from '@angular/core';

/**
 * TASK
 *
 * Build a text-analyzer component:
 *   - holds a `text` signal initialized to ''
 *   - a <textarea> bound to it via [value] + (input) (extract a method
 *     for the event cast, like tick 4's example)
 *   - four computeds:
 *       - `charCount`: total characters (including whitespace)
 *       - `wordCount`: words (text().split(/\s+/) filtering empty strings)
 *       - `charsInWords`: chars excluding whitespace
 *                         (text().replace(/\s+/g, '').length)
 *       - `avgWordLength`: charsInWords / wordCount (return 0 when wordCount is 0)
 *   - displays all four values; format `avgWordLength` with `.toFixed(2)`
 *
 * Why not `charCount / wordCount` for the average? `charCount` includes
 * whitespace, so dividing by word count inflates the average — e.g.,
 * `'      ds'` gives 8/1 = 8 instead of the actual word length 2. Use
 * `charsInWords` for the math; keep `charCount` for the readout.
 *
 * The lesson is *chained computeds*: `avgWordLength` reads both
 * `wordCount()` and `charsInWords()` — when `text` changes, all four
 * recompute on next read.
 *
 * Run `npm run tick5:task` to see your output at /tick5/task.
 */

@Component({
  selector: 'app-tick5-task',
  template: `
    <h2>Tick 5 — Task</h2>
    <p>Your task is to fill in this component (see the comment above).</p>
    <!-- write your code here -->
  `,
})
export class Tick5Task {
  // write your code here
}
