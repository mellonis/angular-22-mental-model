import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-tick3-example',
  template: `
    <h2>Tick 3 — Example</h2>

    <input type="range" min="0" max="100"
           [value]="volume()"
           (input)="onSliderChange($event)" />

    <p>Volume: {{ volume() }}</p>

    @let label = volume() + '%';
    <p>Display label: {{ label }}</p>

    <p [class.loud]="volume() > 80">
      Status: {{ volume() > 80 ? 'too loud!' : 'ok' }}
    </p>

    <div class="bar"
         [style.width.px]="volume() * 3"
         [style.background]="volume() > 80 ? '#fee' : '#efe'"></div>

    <button [attr.aria-label]="'Reset volume from ' + volume()"
            (click)="volume.set(50)">Reset</button>
  `,
  styles: [`
    h2 { margin-top: 0; }
    .bar { height: 20px; border: 1px solid #ccc; transition: width 0.2s; margin: 0.5rem 0; }
    .loud { color: red; font-weight: bold; }
    button { margin-top: 0.5rem; }
  `],
})
export class Tick3Example {
  readonly volume = signal(50);

  onSliderChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.volume.set(+target.value);
  }
}
