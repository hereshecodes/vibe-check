import { SyntaxKind, type SourceFile } from "ts-morph";
import type { Check, CheckResult, Violation } from "../types.js";

export const NoConsole: Check = {
  name: "no-console",
  description: "Detects console.log and other console methods",

  run(sourceFile: SourceFile, filePath: string): CheckResult {
    const violations: Violation[] = [];

    sourceFile.forEachDescendant((node) => {
      if (node.getKind() === SyntaxKind.CallExpression) {
        const callText = node.getText();

        // Match console.log, console.warn, console.error, etc.
        if (/^console\.(log|warn|error|info|debug|trace)\s*\(/.test(callText)) {
          violations.push({
            rule: this.name,
            message: "Remove console statement before shipping",
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
