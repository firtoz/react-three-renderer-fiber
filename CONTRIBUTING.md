# Contributing

```jsx
<statement-of-love/>
```

First of all, this repository is going to be moving fast and breaking things so you will need to be ready for adventures.

Even this document is WIP so it's not usable yet!

Once [#22](https://github.com/toxicFork/react-three-renderer-fiber/issues/22) is closed then I guess it should be at an acceptable level.

## Assumptions

You may need to know these:
- a bit of git
- a bit of TypeScript
- a bit of React

This repo will use advanced crazy weird concepts from React and TypeScript so it will be scary at first.

## Some info

### Setup

I use `yarn`. `npm install` should work too in theory.

### Strange Dependencies

Until [react-reconciler](https://www.npmjs.com/package/react-reconciler) is properly published the author has created [react-fiber-export](https://www.npmjs.com/package/react-fiber-export).

## Testing

```bash
yarn test
```

This will launch a nightly version of firefox (until [#23](https://github.com/toxicFork/react-three-renderer-fiber/issues/23) is fixed).

You can find the tests in the "tests" directory.

## Basic workflow
- make sure whatever you are working on has a case
- create a branch
- there are a few different kinds of work, from easy to difficult:
  - documentation
  - adding prop type hints to existing properties (TODO: create guide for this)
  - (once enough types and properties are defined), trying to implement examples from THREEjs documentation
  - [implementing property updates for existing descriptors e.g. adding an "intensity" parameter to pointLight](https://github.com/toxicFork/react-three-renderer-fiber/wiki/updating-descriptor-properties)
  - [adding new descriptor types for classes such as `mesh`, `pointLight`, `boxGeometry`](https://github.com/toxicFork/react-three-renderer-fiber/wiki/adding-a-new-descriptor)
  - implementing advanced descriptors e.g. `shape` / `moveTo` / `lineTo`
  - resources (TODO: create ticket)?
  - modules/extensions (TODO: sigh)
