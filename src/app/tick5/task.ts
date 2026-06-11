import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-tick5-task',
  template: `
    <h2>Tick 5 — Task</h2>

    <label>
      Text:
      <textarea
        [value]="text()"
        (input)="onTextInput($event)"
        rows="4"
        cols="40"></textarea>
    </label>

    <ul>
      <li>Characters (with whitespace): {{ charCount() }}</li>
      <li>Words: {{ wordCount() }}</li>
      <li>Characters in words: {{ charsInWords() }}</li>
      <li>Average word length: {{ avgWordLength().toFixed(2) }}</li>
    </ul>
  `,
  styles: [`
    h2 { margin-top: 0; }
    label { display: block; margin: 0.5rem 0; }
    textarea { display: block; margin-top: 0.25rem; }
    ul { list-style: none; padding: 0; }
    li { padding: 0.25rem 0; }
  `],
})
export class Tick5Task {
  protected readonly text = signal('');

  protected readonly charCount = computed(() => this.text().length);

  protected readonly wordCount = computed(() =>
    this.text().split(/\s+/).filter(w => w.length > 0).length
  );

  protected readonly charsInWords = computed(() =>
    this.text().replace(/\s+/g, '').length
  );

  protected readonly avgWordLength = computed(() => {
    const words = this.wordCount();
    return words === 0 ? 0 : this.charsInWords() / words;
  });

  protected onTextInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.text.set(target.value);
  }

  // === Review ===
  // - Three computeds read `text()` directly: `charCount`,
  //   `wordCount`, `charsInWords`. Each re-runs when `text` changes
  //   AND someone reads it. The template always reads all three,
  //   so in practice they run on every keystroke.
  // - `avgWordLength` is *chained*: it reads two other computeds
  //   (`wordCount` and `charsInWords`), each of which reads `text`.
  //   When `text` changes, all four are marked dirty; on next read,
  //   each runs once and caches. Reading `avgWordLength` doesn't
  //   re-run its sources if their cache is still fresh.
  // - Why split `charCount` and `charsInWords`? `charCount` gives
  //   the visible "how big is the input" number; `charsInWords` is
  //   what the average word length divides by. For `'      ds'`,
  //   `charCount = 8` but the actual word `'ds'` is only 2 chars
  //   long, so dividing by word count gives 2, not 8. Using
  //   `charCount` for the math would inflate the average by the
  //   amount of whitespace.
  // - `const words = this.wordCount();` caches the read locally so
  //   the ternary can reference it twice (the guard and the divisor)
  //   without two `()` calls. Functionally either pattern works —
  //   `computed`'s memoization makes the second call free — but
  //   one local is cleaner than two reads.
  // - The `words === 0` guard avoids dividing by zero. It also makes
  //   `avgWordLength`'s dep set dynamic: when wordCount is 0, the
  //   `charsInWords()` read is short-circuited, so `charsInWords`
  //   is not tracked as a dep on that run. (Negligible in practice
  //   — both recompute together from `text` — but a real graph-
  //   tracking side effect worth knowing.)
  // - `filter(w => w.length > 0)` and `filter(Boolean)` are both
  //   idiomatic. `filter(Boolean)` is shorter (relies on JS coercing
  //   empty string to false); explicit predicate states the intent
  //   without the JS-trivia step.
  // - Cast lives in `onTextInput`, not in the template. Angular's
  //   template parser doesn't accept TypeScript `as` casts in event
  //   expressions (same gotcha as tick 4's example).
  // - All four computeds are `protected readonly` — `protected`
  //   keeps them template-accessible but not part of the external
  //   API; `readonly` is the binding-doesn't-get-reassigned signal.
  //   The signals' *values* still change through the derivation
  //   graph.
  // - No side effects in the derivation functions. `computed`'s
  //   contract is "pure function of signal reads"; effects on
  //   change land in tick 6 (`effect()`).
}
