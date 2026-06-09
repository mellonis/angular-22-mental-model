import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <header>
      <h1>Angular 22 Mental Model</h1>
      <nav>
        <a routerLink="/tick1/example">tick 1 · example</a>
        <a routerLink="/tick1/task">tick 1 · task</a>
        <a routerLink="/tick2/example">tick 2 · example</a>
        <a routerLink="/tick2/task">tick 2 · task</a>
        <a routerLink="/tick3/example">tick 3 · example</a>
        <a routerLink="/tick3/task">tick 3 · task</a>
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
export class App {}
