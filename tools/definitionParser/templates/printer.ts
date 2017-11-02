import * as ts from "typescript";

function addImport(name, pathTo) {
  return ts.createImportDeclaration(
    undefined,
    undefined,
    ts.createImportClause(
      undefined,
      ts.createNamespaceImport(ts.createIdentifier(name))
    ),
    ts.createLiteral(pathTo)
  );
}

function addNamedImport(names, pathTo) {
  return ts.createImportDeclaration(
    undefined,
    undefined,
    ts.createImportClause(
      undefined,
      ts.createNamedImports(
        names.map(name =>
          ts.createImportSpecifier(undefined, ts.createIdentifier(name))
        )
      )
    ),
    ts.createLiteral(pathTo)
  );
}

function makeDescriptor(file) {
  return ts.updateSourceFileNode(file, [
    // import * as THREE from "three";
    addImport("THREE", "three"),
    // import { AmbientLight } from "three";
    addNamedImport(["AmbientLight"], "three"),
    // import { WrappedEntityDescriptor, WrapperDetails } from "../../common/ObjectWrapper";
    addNamedImport(
      ["WrappedEntityDescriptor", "WrapperDetails"],
      "../../common/ObjectWrapper"
    ),
    // interface IAmbientLightProps implements IObject3DProps {
    ts.createInterfaceDeclaration(
      undefined,
      undefined,
      "IAmbientLightProps",
      undefined,
      [
        ts.createHeritageClause(ts.SyntaxKind.ImplementsKeyword, [
          ts.createExpressionWithTypeArguments(
            [],
            ts.createIdentifier("IObject3DProps")
          )
        ])
      ],
      undefined
    ),
  ]);
}

const resultFile = ts.createSourceFile(
  "output.ts",
  "",
  ts.ScriptTarget.Latest,
  false,
  ts.ScriptKind.TS
);
const printer = ts.createPrinter();
const result = printer.printNode(
  ts.EmitHint.Unspecified,
  makeDescriptor(resultFile),
  resultFile
);

console.log(result);
