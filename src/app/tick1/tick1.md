# Tick 1 — Standalone component + `bootstrapApplication()`

> Run: `npm run tick1:example` (demo) · `npm run tick1:task` (exercise)

## Concept

An Angular **component** is a TypeScript class decorated with `@Component`. The decorator carries the configuration the framework needs to render it: a `selector` (the element name that mounts the component), a `template` (the HTML rendered when the component appears), and optional `styles`. The class body holds the component's state — plain fields, methods, and (from tick 2 onward) signals.

To start an Angular application, call `bootstrapApplication(RootComponent, appConfig)` from `src/main.ts`. The root component renders into the DOM element matching its selector in `src/index.html`. Sub-routes load their own components via the router (see `src/app/app.routes.ts`).

**There is no `AppModule`.** Angular's modern (v17+, default since v18) story is "standalone components everywhere." A component declares its own template dependencies in its `imports: [...]` array — no central manifest required.

## Example (`example.ts`)

A `Tick1Example` class with two readonly fields (`name`, `version`) interpolated into the template. The decorator carries the selector and template; the class carries the state. The component is wired into `/tick1/example` by `src/app/app.routes.ts`.

The example uses plain fields (`readonly name = 'Angular'`), not signals. Tick 1's lesson is the *shape* of a component; the reactive primitive arrives in tick 2. The framework still re-renders correctly here because zoneless change detection runs after each event, and the values never change.

## Task (`task.ts`)

Build a `Tick1Task` class that displays:
- your name
- the count of years you've been writing code

Use only the `@Component` decorator and class fields with template interpolation. Run `npm run tick1:task` to see your output at `/tick1/task`.

## Key insights

- **The decorator carries config, the class carries state.** `@Component` is configuration; the class body is everything the running component knows about itself.
- **Standalone is the default.** No `NgModule` is required. Each component declares its own template dependencies in `imports: [...]`.
- **`bootstrapApplication` is the entry.** Angular doesn't auto-mount anything — your `src/main.ts` explicitly calls `bootstrapApplication(RootComponent, appConfig)`.
- **`{{ expr }}` is just stringification.** The expression is evaluated and its string form is inserted into the DOM at that point. Tick 3 covers the full binding story (`[prop]`, `[attr.x]`, `[class.x]`, `(event)`).
- **File naming convention is v22-modern.** No `.component.ts` suffix; the class name is `Tick1Example`, not `Tick1ExampleComponent`. The Angular CLI scaffolds this way by default in v22.

## Coming from React / Vue / Svelte

- **React:** Angular's `@Component` decorator + class is similar to a function component, but the configuration (selector, template, styles, imports) lives on the decorator rather than being implicit. `bootstrapApplication` ≈ `createRoot().render()`. No JSX — the template is an HTML-with-bindings string.
- **Vue:** Angular components feel close to Vue Single-File Components flattened into one TypeScript file: `template` ≈ `<template>`, `styles` ≈ `<style scoped>`, the class ≈ `<script setup>` (but class-shaped, not script-shaped).
- **Svelte:** The class-and-decorator pattern is unfamiliar coming from Svelte, but the mental model of "one file per component with template, styles, and behavior" matches. Angular leans more on decorator-driven config; Svelte leans on compiler-driven syntax.

## Sidebar — what was `NgModule`?

Before Angular 17 (~late 2023), every component had to be **declared** in an `NgModule` (`@NgModule({ declarations: [...] })`) before it could be used. Modules also imported other modules to bring in their declarations, provided services, and bootstrapped the root component (`platformBrowserDynamic().bootstrapModule(AppModule)`). The pattern was central to every Angular tutorial for years.

Standalone components (stable in v15, default in v18+) remove this layer entirely. Each component imports its own dependencies; routes lazy-load components directly; `bootstrapApplication(AppComponent, appConfig)` replaces module bootstrap. The new default is "no central manifest" — every component is self-describing.

You will still see `NgModule` in any pre-v17 codebase. Reading it is mostly straightforward (`declarations: [X, Y]` ≈ "the templates inside X and Y can use each other"); writing new ones is unnecessary in Angular 22.
