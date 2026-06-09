import { Component } from '@angular/core';

@Component({
  selector: 'app-tick1-example',
  template: `
    <h2>Tick 1 — Example</h2>
    <p>Hello, {{ name }}!</p>
    <p>Framework version: {{ version }}</p>
    <p>
      This is a standalone component. The class fields above
      (<code>name</code>, <code>version</code>) are interpolated into
      the template via double-brace syntax. No <code>NgModule</code>,
      no providers, no setup beyond the <code>&#64;Component</code> decorator.
    </p>
  `,
  styles: [`
    h2 { margin-top: 0; }
    code { background: #f4f4f4; padding: 0 4px; border-radius: 3px; }
  `],
})
export class Tick1Example {
  readonly name = 'Angular';
  readonly version = '22';
}
