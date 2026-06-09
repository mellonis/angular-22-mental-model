import { Component, signal } from '@angular/core';

type Condition = 'sunny' | 'cloudy' | 'rainy';
type Day = { day: string; condition: Condition; highF: number };

/**
 * TASK
 *
 * Build a 5-day weather forecast component:
 *   - holds a `forecast` signal with five days (already initialized below)
 *   - displays a header via @if/@else:
 *       - "5-day forecast" if forecast is non-empty
 *       - "No forecast loaded" if empty
 *   - renders the forecast as a list with @for, tracking by `day.day`
 *     - highlight today (first row) with a `.today` class via $first
 *   - per row, use @switch on `day.condition`:
 *       - 'sunny'  → "☀️ Sunny"
 *       - 'cloudy' → "☁️ Cloudy"
 *       - 'rainy'  → "🌧️ Rainy"
 *       - @default → "❓ Unknown"
 *   - shows the high temp as "{{ day.highF }}°F"
 *   - uses @empty inside @for for "(no days)" message
 *
 * Run `npm run tick4:task` to see your output at /tick4/task.
 */

@Component({
  selector: 'app-tick4-task',
  template: `
    <h2>Tick 4 — Task</h2>
    <p>Your task is to fill in this component (see the comment above).</p>
    <!-- write your code here -->
  `,
})
export class Tick4Task {
  protected readonly forecast = signal<Day[]>([
    { day: 'Mon', condition: 'sunny', highF: 72 },
    { day: 'Tue', condition: 'cloudy', highF: 68 },
    { day: 'Wed', condition: 'rainy', highF: 60 },
    { day: 'Thu', condition: 'sunny', highF: 74 },
    { day: 'Fri', condition: 'cloudy', highF: 70 },
  ]);

  // write your code here
}
