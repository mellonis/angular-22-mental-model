import { Component, signal } from '@angular/core';

/**
 * TASK
 *
 * Build a color-picker component that:
 *   - holds a color name as a signal, defaulting to 'red'
 *   - has three buttons: red, green, blue
 *     - clicking a button sets the signal to that color name
 *     - the currently-selected button gets a `selected` class
 *     - each button has `[attr.aria-pressed]` reflecting selection
 *   - shows the current color via interpolation
 *   - has a preview swatch using `[style.background]="color()"`
 *   - uses `@let upperColor = color().toUpperCase();` somewhere and displays it
 *
 * Binding forms to exercise:
 *   - {{ expr }}         interpolation
 *   - [style.background] style binding
 *   - [class.selected]   class binding
 *   - [attr.aria-pressed] attribute binding
 *   - (click)            event binding
 *   - @let               template-local variable
 *
 * Run `npm run tick3:task` to see your output at /tick3/task.
 */

@Component({
  selector: 'app-tick3-task',
  template: `
    <h2>Tick 3 — Task</h2>
    <p>Your task is to fill in this component (see the comment above).</p>
    <!-- write your code here -->
  `,
})
export class Tick3Task {
  // write your code here
}
