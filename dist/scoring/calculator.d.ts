import type { Violation } from "../types.js";
export declare function calculateScore(violations: Violation[], fileCount: number): number;
export declare function getScoreEmoji(score: number): string;
export declare function getScoreLabel(score: number): string;
