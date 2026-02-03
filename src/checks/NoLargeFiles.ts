import type { SourceFile } from "ts-morph";
import type { Check, CheckResult, Violation } from "../types.js";

const MAX_LINES = 500;

export const NoLargeFiles: Check = {
  name: "no-large-files",
  description: "Detects files that are too large",

  run(sourceFile: SourceFile, filePath: string): CheckResult {
    const violations: Violation[] = [];
    const lineCount = sourceFile.getEndLineNumber();

    if (lineCount > MAX_LINES) {
      violations.push({
        rule: this.name,
        message: `File has ${lineCount} lines (max: ${MAX_LINES}). Break it up.`,
        file: filePath,
        line: 1,
        column: 1,
        severity: "warning",
      });
    }

    return { violations };
  },
};
