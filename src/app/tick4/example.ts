import { Component, signal } from '@angular/core';

type TodoStatus = 'pending' | 'done' | 'cancelled';
type Todo = { id: number; text: string; status: TodoStatus };

@Component({
  selector: 'app-tick4-example',
  template: `
    <h2>Tick 4 — Example</h2>

    <input type="text" placeholder="What needs doing?"
           [value]="draft()"
           (input)="onDraftInput($event)" />
    <button (click)="add()">Add</button>

    @let pendingCount = todos().filter(t => t.status === 'pending').length;

    @if (todos().length > 0) {
      <p class="count">{{ todos().length }} todo(s) — {{ pendingCount }} pending</p>
    } @else {
      <p class="hint">Add your first todo above ↑</p>
    }

    <ul>
      @for (todo of todos(); track todo.id;
            let i = $index, first = $first, last = $last, even = $even) {
        <li [class.first]="first" [class.last]="last" [class.even]="even">
          <span class="num">{{ i + 1 }}.</span>
          @switch (todo.status) {
            @case ('pending') {
              <span class="pending">{{ todo.text }}</span>
              <button (click)="toggle(todo.id)">done</button>
              <button (click)="cancel(todo.id)">cancel</button>
            }
            @case ('done') {
              <span class="done">{{ todo.text }} ✓</span>
              <button (click)="toggle(todo.id)">undo</button>
            }
            @default {
              <span class="cancelled">{{ todo.text }} (cancelled)</span>
            }
          }
        </li>
      } @empty {
        <li class="empty">(list is empty)</li>
      }
    </ul>
  `,
  styles: [`
    h2 { margin-top: 0; }
    .count, .hint { color: #666; }
    ul { list-style: none; padding: 0; margin-top: 1rem; }
    li { padding: 0.4rem 0.5rem; border: 1px solid transparent; display: flex; align-items: center; gap: 0.5rem; }
    li.first { border-top-color: #ccc; }
    li.last { border-bottom-color: #ccc; }
    li.even { background: #fafafa; }
    .num { color: #999; min-width: 1.5rem; }
    .pending { font-weight: bold; flex: 1; }
    .done { color: green; text-decoration: line-through; flex: 1; }
    .cancelled { color: #999; flex: 1; }
    button { margin-left: 0.25rem; }
    input { padding: 0.25rem; }
  `],
})
export class Tick4Example {
  private nextId = 3;
  readonly todos = signal<Todo[]>([
    { id: 1, text: 'Read tick 4 example', status: 'pending' },
    { id: 2, text: 'Try writing your own', status: 'pending' },
  ]);
  readonly draft = signal('');

  onDraftInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.draft.set(target.value);
  }

  add() {
    const text = this.draft().trim();
    if (!text) return;
    this.todos.update(list => [
      ...list,
      { id: this.nextId++, text, status: 'pending' },
    ]);
    this.draft.set('');
  }

  toggle(id: number) {
    this.todos.update(list =>
      list.map(t =>
        t.id === id
          ? { ...t, status: t.status === 'done' ? 'pending' : 'done' }
          : t
      )
    );
  }

  cancel(id: number) {
    this.todos.update(list =>
      list.map(t => (t.id === id ? { ...t, status: 'cancelled' } : t))
    );
  }
}
