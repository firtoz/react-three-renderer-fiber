#  Definition Parser

##  What it does

This reads Three.js's DefinitelyTyped definition files (@types/three) and generates source files for the project based on their contents.

##  How to use

`ts-node --compilerOptions '{"strictNullChecks":false, "noImplicitReturns":false}' tools/definitionParser/index.ts`

###  Current Limitations

There will be many more issues than this but these are what are currently on my mind -

* It currently fails with `strictNullChecks` or `noImplicitReturns` enabled

* The search and output paths are hardcoded, i.e. it's looking for `[a-z]Light` classes and outputting `descriptors/lights/*`files

* The way it actually writes files isn't very smart. It's using Lodash's template system, ideally this would be done with the TS Compiler

* Most operations are done synchronously

* It's taking the first constructor of a class, some classes e.g. THREE.Color have multiple constructors which all accept different parameters

* It's currently only getting constructor parameters, but it should probably get instance parameters and methods too

* It's not recursively looking for associated files to build shared parents i.e. hostDescriptors/common/lightBase.ts

* Most operations are done synchronously
