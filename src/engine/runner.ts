import { Project } from "ts-morph";
import { glob } from "glob";
import { checks } from "../checks/index.js";
import type { Violation, ScanResult, VibeCheckConfig } from "../types.js";
import { calculateScore } from "../scoring/calculator.js";

export async function scanFiles(
  targetPath: string,
  config: VibeCheckConfig
): Promise<ScanResult> {
  const violations: Violation[] = [];

  // Find all TS/JS files
  const pattern = `${targetPath}/**/*.{ts,tsx,js,jsx}`;
  const files = await glob(pattern, {
    ignore: ["**/node_modules/**", "**/dist/**", "**/*.d.ts", "**/*.test.ts", "**/*.spec.ts"],
  });

  if (files.length === 0) {
    return {
      files: 0,
      violations: [],
      score: 100,
      passed: true,
    };
  }

  // Create ts-morph project
  const project = new Project({
    skipAddingFilesFromTsConfig: true,
    compilerOptions: {
      allowJs: true,
      checkJs: false,
    },
  });

  // Add files to project
  for (const file of files) {
    project.addSourceFileAtPath(file);
  }

  // Run all checks on all files
  for (const sourceFile of project.getSourceFiles()) {
    const filePath = sourceFile.getFilePath();

    for (const check of checks) {
      const result = check.run(sourceFile, filePath);
      violations.push(...result.violations);
    }
  }

  const score = calculateScore(violations, files.length);
  const passed = score >= config.threshold;

  return {
    files: files.length,
    violations,
    score,
    passed,
  };
}
