import type { ScanResult } from "../types.js";
export interface RenderOptions {
    showBadge?: boolean;
}
export declare function renderReport(result: ScanResult, cwd: string, options?: RenderOptions): void;
