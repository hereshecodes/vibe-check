import type { SourceFile } from "ts-morph";
export interface Violation {
    rule: string;
    message: string;
    file: string;
    line: number;
    column: number;
    severity: "error" | "warning";
}
export interface CheckResult {
    violations: Violation[];
}
export interface Check {
    name: string;
    description: string;
    run(sourceFile: SourceFile, filePath: string): CheckResult;
}
export interface ScanResult {
    files: number;
    violations: Violation[];
    score: number;
    passed: boolean;
}
export interface VibeCheckConfig {
    strict: boolean;
    threshold: number;
}
