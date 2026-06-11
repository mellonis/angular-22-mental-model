import { Component, signal, effect, untracked } from '@angular/core';

type Color = 'red' | 'green' | 'blue';

@Component({
  selector: 'app-tick6-example',
  template: `
    <h2>Tick 6 — Example</h2>

    <label>
      Name:
      <input [value]="name()" (input)="onNameInput($event)" />
    </label>

    <label>
      Color (untracked):
      <select [value]="color()" (change)="onColorChange($event)">
        <option value="red">red</option>
        <option value="green">green</option>
        <option value="blue">blue</option>
      </select>
    </label>

    <p [style.color]="color()">Hello, {{ name() }}!</p>

    <p class="hint">
      Try: type in the name (effect runs, title + console update) →
      change color (no effect run; color just restyles the paragraph) →
      type again (cleanup logs the previous name first, then the new run).
    </p>
  `,
  styles: [`
    h2 { margin-top: 0; }
    label { display: block; margin: 0.5rem 0; }
    input, select { margin-left: 0.5rem; }
    .hint { color: #666; font-size: 0.9rem; margin-top: 1rem; }
  `],
})
export class Tick6Example {
  readonly name = signal('World');
  readonly color = signal<Color>('red');

  constructor() {
    effect(onCleanup => {
      const currentName = this.name();
      const currentColor = untracked(() => this.color());
      document.title = `Hello, ${currentName}!`;
      console.log(`[effect] name=${currentName}, color=${currentColor}`);

      onCleanup(() => {
        console.log(`[cleanup] previous run had name=${currentName}`);
      });
    });
  }

  onNameInput(event: Event) {
    this.name.set((event.target as HTMLInputElement).value);
  }

  onColorChange(event: Event) {
    this.color.set((event.target as HTMLSelectElement).value as Color);
  }
}
