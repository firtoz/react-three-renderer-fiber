import * as ts from "typescript";
import { DocEntry } from "..";

export default function serializeSymbol(checker: ts.TypeChecker) {
  return function(symbol: ts.Symbol): DocEntry {
    const name = symbol.getName();
    const _symbol: DocEntry = {
      name,
      documentation: ts.displayPartsToString(symbol.getDocumentationComment()),
      type: checker.typeToString(
        checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration)
      )
    };

    symbol.getDeclarations().forEach(declaration => {
      if (ts.isParameter(declaration)) {
        _symbol.required = !checker.isOptionalParameter(declaration);
      }
    });

    const documentation = ts.displayPartsToString(
      symbol.getDocumentationComment()
    );
    if (documentation && documentation !== "")
      _symbol.documentation = documentation;
    return _symbol;
  };
}
