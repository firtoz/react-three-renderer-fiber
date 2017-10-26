import * as _ from "lodash";
import * as fs from "fs";
import * as mkdirp from "mkdirp";
import * as path from "path";
import * as rimraf from "rimraf";
import * as ts from "typescript";
import serializeClass from "./serializers/class";

export interface DocEntry {
  name?: string;
  documentation?: string;
  type?: string;
  required?: boolean;
  constructors?: DocEntry[];
  parameters?: DocEntry[];
}

function generateDescriptors(
  files: string[],
  matcher: RegExp,
  options: ts.CompilerOptions
): void {
  const program = ts.createProgram(
    files.map(f => path.resolve(__dirname, "../..", f)),
    options
  );
  const checker: ts.TypeChecker = program.getTypeChecker();

  let output: DocEntry[] = [];

  for (const sourceFile of program.getSourceFiles()) {
    ts.forEachChild(sourceFile, visit);
  }

  function visit(node: ts.Node) {
    if (node.kind === ts.SyntaxKind.ClassDeclaration) {
      let classDeclaration = <ts.ClassDeclaration>node;
      if (classDeclaration.name) {
        let symbol = checker.getSymbolAtLocation(classDeclaration.name);
        // probably a better way to do this. it's due to strictNullChecks
        if (symbol && symbol.getName() && matcher.test(symbol.getName())) {
          output.push(serializeClass(checker)(symbol));
        }
      }
    }
  }

  // write descriptor files

  const filePath = path.resolve(__dirname, "descriptors/lights");
  const source = fs.readFileSync(
    path.resolve(__dirname, "./templates/descriptor.js")
  );
  const template = _.template(source.toString());

  rimraf("descriptors", () => {
    mkdirp(filePath, function(err) {
      if (err) console.error(err);
      else {
        for (const descriptor of output) {
          const { name, constructors } = descriptor;
          if (constructors && constructors.length > 0) {
            const { parameters } = constructors[0];
            const camelName = _.camelCase(name);
            fs.writeFile(
              `${filePath}/${camelName}.ts`,
              template({ name, camelName, parameters }),
              console.log
            );
          }
        }
      }
    });
  });
}

generateDescriptors(["node_modules/@types/three/index.d.ts"], /[a-z]+Light$/i, {
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.CommonJS
});
