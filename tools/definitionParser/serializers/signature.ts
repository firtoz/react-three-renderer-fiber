import * as ts from "typescript"
import serializeSymbol from "./symbol"
import {DocEntry} from ".."

export default function serializeSignature(checker:ts.TypeChecker) {
  /** Serialize a signature (call or construct) */
  return function (signature: ts.Signature):DocEntry {
    const _signature: DocEntry = {};
    const documentation = ts.displayPartsToString(
      signature.getDocumentationComment()
    );
    if (documentation && documentation !== "")
      _signature.documentation = documentation;
    const parameters = signature.parameters.map(serializeSymbol(checker));
    if (parameters && parameters.length > 0) _signature.parameters = parameters;
    const returnType = checker.typeToString(signature.getReturnType());
    // if (returnType && returnType !== "") _signature.returnType = returnType;
    return _signature;
  }
}
