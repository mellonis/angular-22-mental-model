import { Component, signal, computed } from '@angular/core';

const TAX_RATE = 0.08;

type LineItem = { id: number; price: number };

@Component({
  selector: 'app-tick5-example',
  template: `
    <h2>Tick 5 — Example</h2>

    <h3>Items</h3>
    <ul>
      @for (item of items(); track item.id) {
        <li>
          <span>\${{ item.price.toFixed(2) }}</span>
          <button (click)="remove(item.id)">remove</button>
        </li>
      } @empty {
        <li class="empty">(no items)</li>
      }
    </ul>
    <button (click)="addRandom()">Add random item</button>

    <h3>Totals</h3>
    <p>Subtotal: \${{ subtotal().toFixed(2) }}</p>

    <label>
      <input type="checkbox" [checked]="showTax()" (click)="showTax.update(v => !v)" />
      Show tax
    </label>

    @if (showTax()) {
      <p>Tax ({{ TAX_RATE * 100 }}%): \${{ tax().toFixed(2) }}</p>
      <p><strong>Total: \${{ total().toFixed(2) }}</strong></p>
    }
  `,
  styles: [`
    h2 { margin-top: 0; }
    h3 { margin: 1rem 0 0.5rem; font-size: 1rem; }
    ul { list-style: none; padding: 0; }
    li { padding: 0.25rem 0; display: flex; gap: 0.5rem; align-items: center; }
    .empty { color: #999; font-style: italic; }
    label { display: block; margin: 0.5rem 0; }
    p { margin: 0.25rem 0; }
  `],
})
export class Tick5Example {
  readonly TAX_RATE = TAX_RATE;

  private nextId = 4;
  readonly items = signal<LineItem[]>([
    { id: 1, price: 9.99 },
    { id: 2, price: 4.50 },
    { id: 3, price: 12.00 },
  ]);
  readonly showTax = signal(true);

  readonly subtotal = computed(() =>
    this.items().reduce((sum, item) => sum + item.price, 0)
  );
  readonly tax = computed(() => this.subtotal() * TAX_RATE);
  readonly total = computed(() => this.subtotal() + this.tax());

  addRandom() {
    const price = Math.round(Math.random() * 5000) / 100;
    this.items.update(list => [...list, { id: this.nextId++, price }]);
  }

  remove(id: number) {
    this.items.update(list => list.filter(item => item.id !== id));
  }
}
