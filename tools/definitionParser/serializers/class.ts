import * as ts from "typescript";
import serializeSignature from "./signature";
import serializeSymbol from "./symbol";
import { DocEntry } from "..";

export default function serializeClass(checker: ts.TypeChecker) {
  return function(symbol: ts.Symbol): DocEntry {
    let details = serializeSymbol(checker)(symbol);
    if (details) {
      if (symbol.members) {
        let constructorType = checker.getTypeOfSymbolAtLocation(
          symbol,
          symbol.valueDeclaration
        );
        details.constructors = constructorType
          .getConstructSignatures()
          .map(serializeSignature(checker));
        return details;
      }
    }
  };
}
