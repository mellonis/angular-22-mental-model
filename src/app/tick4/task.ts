import { Component, signal } from '@angular/core';

type Condition = 'sunny' | 'cloudy' | 'rainy';
type Day = { day: string; condition: Condition; highF: number };

@Component({
  selector: 'app-tick4-task',
  template: `
    <h2>Tick 4 — Task</h2>

    @if (forecast().length > 0) {
      <p class="header">5-day forecast</p>
    } @else {
      <p class="header">No forecast loaded</p>
    }

    <ul>
      @for (day of forecast(); track day.day; let isFirst = $first) {
        <li [class.today]="isFirst">
          <span class="day">{{ day.day }}</span>
          @switch (day.condition) {
            @case ('sunny') { <span>☀️ Sunny</span> }
            @case ('cloudy') { <span>☁️ Cloudy</span> }
            @case ('rainy') { <span>🌧️ Rainy</span> }
            @default { <span>❓ Unknown</span> }
          }
          <span class="high">{{ day.highF }}°F</span>
        </li>
      } @empty {
        <li class="empty">(no days)</li>
      }
    </ul>
  `,
  styles: [`
    h2 { margin-top: 0; }
    .header { color: #666; margin: 0.5rem 0; }
    ul { list-style: none; padding: 0; }
    li { padding: 0.4rem 0.5rem; display: flex; gap: 1rem; align-items: center; }
    li.today { background: #ffeaa7; font-weight: bold; }
    .day { min-width: 4rem; }
    .high { margin-left: auto; }
    .empty { font-style: italic; color: #999; }
  `],
})
export class Tick4Task {
  protected readonly forecast = signal<Day[]>([
    { day: 'Mon', condition: 'sunny', highF: 72 },
    { day: 'Tue', condition: 'cloudy', highF: 68 },
    { day: 'Wed', condition: 'rainy', highF: 60 },
    { day: 'Thu', condition: 'sunny', highF: 74 },
    { day: 'Fri', condition: 'cloudy', highF: 70 },
  ]);

  // === Review ===
  // - `@if (forecast().length > 0)` and `@for ... @empty` are TWO
  //   different empty-handling stories. They're not redundant: the
  //   `@if` controls the HEADER (always rendered as one of two
  //   messages); `@empty` on `@for` controls the LIST'S empty state.
  //   The list could be empty for a different reason than the
  //   forecast being unloaded, so both are honest.
  // - `track day.day` uses the day name as the stable identifier.
  //   This works as long as day names are unique (they are here:
  //   Mon/Tue/Wed/Thu/Fri). For a real forecast with rolling dates
  //   that repeat across weeks, you'd use a date string or ID.
  // - `@switch (day.condition)` does strict-equality comparison
  //   (`===`). The cases must match exactly — `'Sunny'` would fall
  //   through to `@default`. The `@default` block catches anything
  //   not enumerated, including unexpected/future condition values.
  // - `let isFirst = $first` aliases the implicit `$first` context
  //   variable, which is `true` on the first iteration only. Used
  //   to highlight today's row. Other implicit vars: `$index`,
  //   `$last`, `$even`, `$odd`, `$count`.
  // - `signal<Day[]>(...)` uses the explicit type generic — same
  //   reason as tick 3's color picker. TS inference would give us
  //   the right type, but stating it communicates intent and helps
  //   future-you remember the shape.
  // - One natural extension worth knowing: `signal<readonly Day[]>(Object.freeze([...]))`
  //   combines TS-level `readonly` (compile-time) with runtime
  //   immutability via `Object.freeze`. Belt-and-suspenders against
  //   the accidental-mutation trap from tick 4's sidebar. For a
  //   tutorial demonstrating control flow it's overkill, but it's
  //   solid defensive coding in production.
  // - All three blocks (`@if`, `@for`, `@switch`) are compiled
  //   directly into the template render function. They're language
  //   constructs, not structural directives. No `<ng-template>`
  //   indirection, smaller bundle.
}
