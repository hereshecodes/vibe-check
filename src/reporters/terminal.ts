import chalk from "chalk";
import boxen from "boxen";
import type { ScanResult, Violation } from "../types.js";
import { getScoreLabel } from "../scoring/calculator.js";
import { generateBadgeMarkdown } from "../utils/badge.js";
import { isLikelyPrivateRepo } from "../utils/git.js";

function getScoreColor(score: number): (text: string) => string {
  if (score >= 90) return chalk.green;
  if (score >= 70) return chalk.cyan;
  if (score >= 50) return chalk.yellow;
  return chalk.red;
}

function getScoreEmoji(score: number): string {
  if (score >= 90) return "🔥";
  if (score >= 70) return "✨";
  if (score >= 50) return "😐";
  if (score >= 30) return "💀";
  return "🗑️";
}

function formatViolation(v: Violation, cwd: string): string {
  const relativePath = v.file.replace(cwd + "/", "");
  const location = chalk.dim(`${relativePath}:${v.line}:${v.column}`);
  const severity =
    v.severity === "error" ? chalk.red("error") : chalk.yellow("warn ");
  const rule = chalk.dim(`[${v.rule}]`);

  return `  ${severity} ${location}\n         ${v.message} ${rule}`;
}

export interface RenderOptions {
  showBadge?: boolean;
}

export function renderReport(
  result: ScanResult,
  cwd: string,
  options: RenderOptions = {}
): void {
  const { files, violations, score, passed } = result;
  const colorFn = getScoreColor(score);
  const label = getScoreLabel(score);
  const emoji = getScoreEmoji(score);

  // Group violations by rule
  const byRule = new Map<string, Violation[]>();
  for (const v of violations) {
    const existing = byRule.get(v.rule) || [];
    existing.push(v);
    byRule.set(v.rule, existing);
  }

  // Print violations
  if (violations.length > 0) {
    console.log();
    console.log(chalk.bold("Violations Found:"));
    console.log();

    for (const [rule, ruleViolations] of byRule) {
      console.log(chalk.bold.underline(`${rule} (${ruleViolations.length})`));
      console.log();

      // Show first 5 violations per rule
      const toShow = ruleViolations.slice(0, 5);
      for (const v of toShow) {
        console.log(formatViolation(v, cwd));
      }

      if (ruleViolations.length > 5) {
        console.log(chalk.dim(`  ... and ${ruleViolations.length - 5} more`));
      }
      console.log();
    }
  }

  // Render scorecard - optimized for screenshots
  const scoreDisplay = chalk.bold(colorFn(`${score}`));
  const labelDisplay = colorFn(`${emoji} ${label}`);

  const content = [
    ``,
    `   ${chalk.bold("VIBE SCORE")}   ${scoreDisplay}/100`,
    ``,
    `   ${labelDisplay}`,
    ``,
    chalk.dim(`   ─────────────────────────`),
    `   ${chalk.dim("Files:")} ${files}  ${chalk.dim("Issues:")} ${violations.length}`,
  ].join("\n");

  const borderColor = score >= 90 ? "green" : score >= 70 ? "cyan" : score >= 50 ? "yellow" : "red";

  const box = boxen(content, {
    padding: { top: 0, bottom: 1, left: 1, right: 1 },
    margin: 1,
    borderStyle: "double",
    borderColor,
    title: passed ? "✓ vibe-check" : "✗ vibe-check",
    titleAlignment: "center",
  });

  console.log(box);

  // Badge output
  if (options.showBadge) {
    console.log(chalk.bold("\nAdd this badge to your README:\n"));
    console.log(chalk.cyan(generateBadgeMarkdown(score)));
    console.log();
  }

  // Nagware for private repos (honor system)
  const hasLicense = process.env.VIBE_CHECK_LICENSE;
  const isProbablyPrivate = isLikelyPrivateRepo();

  if (!hasLicense && isProbablyPrivate) {
    console.log(
      chalk.dim(
        "  ℹ️  Using vibe-check on private repos? Please support development:"
      )
    );
    console.log(chalk.dim("     https://vibe-check-lilac-five.vercel.app ($10 lifetime)\n"));
  } else if (!hasLicense) {
    console.log(chalk.dim("  ⚡ vibe-check-lilac-five.vercel.app\n"));
  }

  // Exit message
  if (passed) {
    if (score >= 90) {
      console.log(chalk.green.bold("Certified Vibe Coder. Ship it. 🚀"));
    } else {
      console.log(chalk.green("Vibe check passed."));
    }
  } else {
    if (score < 30) {
      console.log(chalk.red.bold("AI Slop Detected. Do not ship. 🛑"));
    } else {
      console.log(chalk.red("Vibe check failed. Clean up the slop."));
    }
  }
}
