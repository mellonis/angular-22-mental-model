import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <header>
      <h1>Angular 22 Mental Model</h1>
      <nav>
        @for (n of tickNumbers; track n) {
          <a [routerLink]="'/tick' + n + '/example'">tick {{ n }} · example</a>
          <a [routerLink]="'/tick' + n + '/task'">tick {{ n }} · task</a>
        }
      </nav>
    </header>
    <main>
      <router-outlet />
    </main>
  `,
  styles: [`
    header { padding: 1rem; border-bottom: 1px solid #ddd; }
    nav a { margin-right: 1rem; }
    main { padding: 1rem; }
  `],
})
export class App {
  readonly tickNumbers = [1, 2, 3, 4, 5, 6];
}
