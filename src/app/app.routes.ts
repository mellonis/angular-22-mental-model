import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tick1/example',
    loadComponent: () =>
      import('./tick1/example').then(m => m.Tick1Example),
    title: 'Tick 1 · Example',
  },
  {
    path: 'tick1/task',
    loadComponent: () =>
      import('./tick1/task').then(m => m.Tick1Task),
    title: 'Tick 1 · Task',
  },
];
