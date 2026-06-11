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
  {
    path: 'tick2/example',
    loadComponent: () =>
      import('./tick2/example').then(m => m.Tick2Example),
    title: 'Tick 2 · Example',
  },
  {
    path: 'tick2/task',
    loadComponent: () =>
      import('./tick2/task').then(m => m.Tick2Task),
    title: 'Tick 2 · Task',
  },
  {
    path: 'tick3/example',
    loadComponent: () =>
      import('./tick3/example').then(m => m.Tick3Example),
    title: 'Tick 3 · Example',
  },
  {
    path: 'tick3/task',
    loadComponent: () =>
      import('./tick3/task').then(m => m.Tick3Task),
    title: 'Tick 3 · Task',
  },
  {
    path: 'tick4/example',
    loadComponent: () =>
      import('./tick4/example').then(m => m.Tick4Example),
    title: 'Tick 4 · Example',
  },
  {
    path: 'tick4/task',
    loadComponent: () =>
      import('./tick4/task').then(m => m.Tick4Task),
    title: 'Tick 4 · Task',
  },
  {
    path: 'tick5/example',
    loadComponent: () =>
      import('./tick5/example').then(m => m.Tick5Example),
    title: 'Tick 5 · Example',
  },
  {
    path: 'tick5/task',
    loadComponent: () =>
      import('./tick5/task').then(m => m.Tick5Task),
    title: 'Tick 5 · Task',
  },
];
