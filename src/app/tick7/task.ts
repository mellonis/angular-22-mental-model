import { Component, OnDestroy, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-tick7-task-tracker',
  template: `<p>Tracker is alive.</p>`,
})
export class Tick7TaskTracker implements OnInit, OnDestroy {
  private startedAt = 0;

  ngOnInit() {
    this.startedAt = Date.now();
    console.log(`[tracker] started at ${new Date(this.startedAt).toISOString()}`);
  }

  ngOnDestroy() {
    const lifetimeMs = Date.now() - this.startedAt;
    console.log(`[tracker] lived for ${lifetimeMs}ms`);
  }

  // === Review ===
  // - The class declares `implements OnInit, OnDestroy`. The
  //   interfaces are TypeScript-only — Angular finds the methods
  //   by name (`ngOnInit`, `ngOnDestroy`). Skipping the interface
  //   works too; what you lose is the compile-time hint of "you
  //   intended to implement these" (and the typo protection: write
  //   `ngOnInti` by mistake and TypeScript stays silent without
  //   the implements clause).
  // - `startedAt` is a plain class field initialised to 0. It's
  //   set in `ngOnInit` rather than the constructor because the
  //   convention is "init-time state lives in `ngOnInit`" (and
  //   conceptually, if inputs were involved, we'd need them to
  //   be settled before reading them — `ngOnInit` is the
  //   guaranteed-after-input-bindings moment).
  // - `ngOnDestroy` runs once when the component is being removed
  //   (here: when the parent's `@if (showTracker())` flips to
  //   false). It's the deterministic teardown moment — useful
  //   when you need a value at destroy time (the lifetime ms here).
  // - No `if (startedAt)` guard before computing the lifetime.
  //   Angular's lifecycle contract guarantees `ngOnInit` fires
  //   before `ngOnDestroy` for a normal teardown — if `ngOnInit`
  //   threw, you'd want to know about it (a guarded silent skip
  //   would hide the problem). Trust the framework's lifecycle;
  //   add defensive checks only where the framework offers no
  //   guarantee.
  // - `new Date(this.startedAt).toISOString()` formats the raw
  //   `Date.now()` integer (milliseconds since epoch) as a
  //   human-readable ISO 8601 string. Useful for logs you'll
  //   actually read.
  // - This pattern — capture-on-init, compute-on-destroy — is
  //   ubiquitous: timing components, view duration tracking,
  //   analytics dwell time, log-the-lifecycle decorators.
  // - The alternative `inject(DestroyRef).onDestroy(...)` would
  //   work too:
  //     constructor() {
  //       this.startedAt = Date.now();
  //       inject(DestroyRef).onDestroy(() => {
  //         console.log(`[tracker] lived for ${Date.now() - this.startedAt}ms`);
  //       });
  //     }
  //   Same behaviour, no `implements OnDestroy` needed, the setup
  //   and cleanup are next to each other. Stylistic choice — the
  //   constructor doesn't have the "inputs settled" guarantee
  //   that `ngOnInit` does, but there are no inputs here.
}

@Component({
  selector: 'app-tick7-task',
  imports: [Tick7TaskTracker],
  template: `
    <h2>Tick 7 — Task</h2>

    <button (click)="showTracker.update(v => !v)">
      {{ showTracker() ? 'Stop' : 'Start' }} tracker
    </button>

    @if (showTracker()) {
      <app-tick7-task-tracker />
    }
  `,
  styles: [`
    h2 { margin-top: 0; }
  `],
})
export class Tick7Task {
  protected readonly showTracker = signal(false);
}
