import { SyntaxKind, type SourceFile } from "ts-morph";
import type { Check, CheckResult, Violation } from "../types.js";

export const NoEmptyCatch: Check = {
  name: "no-empty-catch",
  description: "Detects empty catch blocks that swallow errors",

  run(sourceFile: SourceFile, filePath: string): CheckResult {
    const violations: Violation[] = [];

    sourceFile.forEachDescendant((node) => {
      if (node.getKind() === SyntaxKind.CatchClause) {
        const catchClause = node;
        const block = catchClause.getChildrenOfKind(SyntaxKind.Block)[0];

        if (block) {
          const statements = block.getStatements();

          // Check if catch block is empty or only has comments
          if (statements.length === 0) {
            violations.push({
              rule: this.name,
              message: "Empty catch block swallows errors silently",
              file: filePath,
              line: node.getStartLineNumber(),
              column: node.getStart() - node.getStartLinePos(),
              severity: "error",
            });
          }
        }
      }
    });

    return { violations };
  },
};
