import type { SourceFile } from "ts-morph";
import type { Check, CheckResult, Violation } from "../types.js";

const LAZY_PATTERNS = [
  { pattern: /\b(TODO|FIXME|XXX|HACK)\b/i, message: "Lazy TODO/FIXME comment detected" },
  { pattern: /\/\/\s*(fix\s*(this|later|me)|idk|wtf|idfk)/i, message: "Unprofessional comment detected" },
  { pattern: /\/\/\s*\.{3,}$/i, message: "Meaningless comment detected" },
  { pattern: /\/\/\s*(?:this\s+)?(?:works?|should\s+work|somehow\s+works)/i, message: "'It works' is not documentation" },
  { pattern: /\/\/\s*don'?t\s+(?:touch|change|delete)/i, message: "Scary comment detected - document WHY instead" },
  { pattern: /\/\/\s*(?:magic|hacky?|ugly|terrible|sorry)/i, message: "Self-deprecating code comment - fix the code instead" },
];

export const NoLazyComments: Check = {
  name: "no-lazy-comments",
  description: "Detects TODO, FIXME, and other lazy comments",

  run(sourceFile: SourceFile, filePath: string): CheckResult {
    const violations: Violation[] = [];
    const text = sourceFile.getFullText();
    const lines = text.split("\n");

    lines.forEach((line, index) => {
      for (const { pattern, message } of LAZY_PATTERNS) {
        if (pattern.test(line)) {
          violations.push({
            rule: this.name,
            message,
            file: filePath,
            line: index + 1,
            column: line.search(pattern) + 1,
            severity: "warning",
          });
          break; // Only report first match per line
        }
      }
    });

    return { violations };
  },
};
