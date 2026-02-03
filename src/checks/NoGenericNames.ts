import { SyntaxKind, type SourceFile } from "ts-morph";
import type { Check, CheckResult, Violation } from "../types.js";

// Generic names that AI loves to use
const GENERIC_NAMES = new Set([
  // Variables
  "data",
  "result",
  "response",
  "item",
  "items",
  "value",
  "values",
  "temp",
  "tmp",
  "obj",
  "arr",
  "str",
  "num",
  "val",
  "res",
  "ret",
  "output",
  "input",
  "info",
  "stuff",
  "thing",
  "things",
  // Functions
  "handleClick",
  "handleChange",
  "handleSubmit",
  "handleStuff",
  "doStuff",
  "doThing",
  "doSomething",
  "processData",
  "processItem",
  "fetchData",
  "getData",
  "setData",
  "updateData",
  "handleData",
  "processResponse",
  "handleResponse",
  "util",
  "helper",
  "manager",
]);

// Short names that are OK in certain contexts (loop indices, callbacks)
const ALLOWED_SHORT = new Set(["i", "j", "k", "n", "x", "y", "z", "e", "el", "id", "ok", "fn"]);

export const NoGenericNames: Check = {
  name: "no-generic-names",
  description: "Detects generic variable and function names",

  run(sourceFile: SourceFile, filePath: string): CheckResult {
    const violations: Violation[] = [];

    // Check variable declarations
    sourceFile.getVariableDeclarations().forEach((decl) => {
      const name = decl.getName();
      if (GENERIC_NAMES.has(name) || GENERIC_NAMES.has(name.toLowerCase())) {
        violations.push({
          rule: this.name,
          message: `Generic variable name '${name}' - use a more descriptive name`,
          file: filePath,
          line: decl.getStartLineNumber(),
          column: decl.getStart() - decl.getStartLinePos(),
          severity: "warning",
        });
      }
    });

    // Check function declarations
    sourceFile.getFunctions().forEach((func) => {
      const name = func.getName();
      if (name && (GENERIC_NAMES.has(name) || GENERIC_NAMES.has(name.toLowerCase()))) {
        violations.push({
          rule: this.name,
          message: `Generic function name '${name}' - use a more descriptive name`,
          file: filePath,
          line: func.getStartLineNumber(),
          column: func.getStart() - func.getStartLinePos(),
          severity: "warning",
        });
      }
    });

    // Check parameters with generic names (but not in arrow functions/callbacks which often have short names)
    sourceFile.forEachDescendant((node) => {
      if (node.getKind() === SyntaxKind.Parameter) {
        const paramNode = node;
        const name = paramNode.getChildAtIndex(0)?.getText();
        if (name && GENERIC_NAMES.has(name) && !ALLOWED_SHORT.has(name)) {
          violations.push({
            rule: this.name,
            message: `Generic parameter name '${name}' - use a more descriptive name`,
            file: filePath,
            line: node.getStartLineNumber(),
            column: node.getStart() - node.getStartLinePos(),
            severity: "warning",
          });
        }
      }
    });

    return { violations };
  },
};
