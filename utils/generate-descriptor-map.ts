import * as fs from "fs";
import * as path from "path";

const outputFileName = path.resolve(__dirname + "/../src/core/renderer/hostDescriptors/generated-descriptor-map.ts");
const outputDirectory = path.dirname(outputFileName);

const descriptorImportLines: string[] = [];
const descriptorRequireLines: string[] = [];

function processDirectory(directoryPath: string) {
  const children = fs.readdirSync(directoryPath)
    .sort();

  children.forEach((childPath) => {
    const childFullPath = path.join(directoryPath, childPath);
    const importPath = path.relative(outputDirectory, childFullPath).replace(/\\/g, "/");

    if (childPath.endsWith(".ts")) {
      // it's a descriptor
      const importKey = childPath.replace(/.ts$/, "");

      descriptorImportLines.push(
        `import ${importKey} from "./${importPath.replace(/.ts$/, "")}";`,
      );

      descriptorRequireLines.push(
        `descriptorMap.set("${importKey}", ${importKey});`,
      );
    }
  });

  children.forEach((childPath) => {
    const childFullPath = path.join(directoryPath, childPath);
    const importPath = path.relative(outputDirectory, childFullPath).replace(/\\/g, "/");

    if (!childPath.endsWith(".ts")) {
      if (fs.statSync(childFullPath).isDirectory()) {
        descriptorRequireLines.push(`\n// ${importPath}`);
        processDirectory(childFullPath);
      }
    }
  });
}

processDirectory(path.resolve(__dirname + "/../src/core/renderer/hostDescriptors/descriptors/"));

const thisFileLocation = path.relative(outputFileName, __filename)
  .replace(/\\/g, "/");

const fileContents = `// this file is automatically generated by ${thisFileLocation}

import {IReactThreeRendererDescriptorClass} from "../../../extensions/resources/ResourceDescriptorWrapper";

/* tslint:disable:ordered-imports */

${descriptorImportLines.sort().join("\n")}

const descriptorMap = new Map<string, IReactThreeRendererDescriptorClass>();

${descriptorRequireLines.join("\n")}

export default descriptorMap;
`;

fs.writeFileSync(outputFileName, fileContents);
