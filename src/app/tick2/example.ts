import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-tick2-example',
  template: `
    <h2>Tick 2 — Example</h2>
    <p>Count: {{ count() }}</p>
    <button (click)="count.set(0)">Reset</button>
    <button (click)="count.set(count() + 1)">+1 (via set)</button>
    <button (click)="count.update(c => c * 2)">×2 (via update)</button>
  `,
  styles: [`
    h2 { margin-top: 0; }
    button { margin-right: 0.5rem; }
  `],
})
export class Tick2Example {
  readonly count = signal(0);
}
