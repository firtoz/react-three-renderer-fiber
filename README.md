# react-three-renderer-fiber

## PSA:
This project is advancing at a glacial rate. If you'd like to contribute to the React + Three bridge ecosystems, please take a look at how you can help with the more active https://github.com/drcmda/react-three-fiber project instead.

## Back to regular readme
[![Build Status](https://travis-ci.org/toxicFork/react-three-renderer-fiber.svg?branch=master)](https://travis-ci.org/toxicFork/react-three-renderer-fiber)

Porting R3R to use [React Fiber](https://github.com/acdlite/react-fiber-architecture).

This is even more WIP than `react-three-renderer` itself! Literally unusable. The point of this repository is to play around with react fiber and ask questions to React team and others.

## Notes:
- Motivation was [this tweet by Dan](https://twitter.com/dan_abramov/status/852150540985401345) :)
- [Lin Clark's talk on fiber](https://www.youtube.com/watch?v=ZCuYPiUIONs) helped a lot!
- Still needed some reverse engineering but not even close to the amount necessary for `react-three-renderer`.
  - Looked at how [react-ionize](https://github.com/mhink/react-ionize) does it
  - Looked at how [react-dom does it](https://github.com/facebook/react/blob/15-stable/src/renderers/dom/fiber/ReactDOMFiber.js)
- It seems to be super fast (for this specific experiment, that does not mean that much though)
- I &nbsp; :heart: &nbsp; fiber

## Current state:
- It's so minimal it only works with a few hardcoded components :D
- TODO:
  - Remove hacks
  - Reuse / Port / rewrite existing internal components
  - Make an actual module package

## Wanna play around?
- Clone repository
- `> yarn`
- `> cd examples && yarn && cd ..`
- `> yarn start`
- Open http://localhost:8080/
- Look at react devtools
- Tweak code and break things!
