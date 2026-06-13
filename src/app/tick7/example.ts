import {
  AfterContentInit,
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-tick7-child',
  template: `
    <div class="child">
      <p>Child is alive. Check the console for hook logs.</p>
    </div>
  `,
  styles: [`
    .child { padding: 0.5rem; border: 1px solid #999; margin-top: 0.5rem; }
  `],
})
export class Tick7Child implements OnInit, AfterContentInit, AfterViewInit, OnDestroy {
  private intervalId: ReturnType<typeof setInterval> | undefined;
  private tickCount = 0;

  ngOnInit() {
    console.log('[child] ngOnInit — inputs settled, ready to set up state');
    this.intervalId = setInterval(() => {
      console.log(`[child] tick ${++this.tickCount}`);
    }, 1000);
  }

  ngAfterContentInit() {
    console.log('[child] ngAfterContentInit — projected content available');
  }

  ngAfterViewInit() {
    console.log('[child] ngAfterViewInit — view DOM rendered');
  }

  ngOnDestroy() {
    console.log('[child] ngOnDestroy — clearing interval');
    clearInterval(this.intervalId);
  }
}

@Component({
  selector: 'app-tick7-example',
  imports: [Tick7Child],
  template: `
    <h2>Tick 7 — Example</h2>

    <button (click)="show.update(v => !v)">
      {{ show() ? 'Destroy' : 'Create' }} child
    </button>

    @if (show()) {
      <app-tick7-child />
    }

    <p class="hint">
      Open the console. Toggle the button: child is created → hooks fire in order
      (ngOnInit, ngAfterContentInit, ngAfterViewInit) → ticks log every second →
      destroy → ngOnDestroy fires, ticks stop. Toggle again → fresh instance,
      fresh tick counter.
    </p>
  `,
  styles: [`
    h2 { margin-top: 0; }
    button { margin-bottom: 0.5rem; }
    .hint { color: #666; font-size: 0.9rem; margin-top: 1rem; }
  `],
})
export class Tick7Example {
  protected readonly show = signal(true);
}
