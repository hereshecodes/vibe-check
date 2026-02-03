#!/usr/bin/env node
import { resolve } from "node:path";
import chalk from "chalk";
import ora from "ora";
import { scanFiles } from "./engine/runner.js";
import { renderReport } from "./reporters/terminal.js";
const VERSION = "0.1.0";
function printHelp() {
    console.log(`
${chalk.bold("vibe-check")} - The Grammarly for AI Code

${chalk.bold("Usage:")}
  vibe-check [path] [options]

${chalk.bold("Options:")}
  -h, --help       Show this help message
  -v, --version    Show version
  --strict         Fail on any violation (threshold=100)
  --threshold=N    Set custom pass threshold (default: 70)
  --badge          Output a README badge after the score

${chalk.bold("Examples:")}
  vibe-check .              Check current directory
  vibe-check src            Check src folder
  vibe-check --strict       Zero tolerance mode
  vibe-check --badge        Get a badge for your README
`);
}
function parseArgs(args) {
    let path = ".";
    let showBadge = false;
    const config = {
        strict: false,
        threshold: 70,
    };
    for (const arg of args) {
        if (arg === "-h" || arg === "--help") {
            printHelp();
            process.exit(0);
        }
        if (arg === "-v" || arg === "--version") {
            console.log(VERSION);
            process.exit(0);
        }
        if (arg === "--strict") {
            config.strict = true;
            config.threshold = 100;
            continue;
        }
        if (arg === "--badge") {
            showBadge = true;
            continue;
        }
        if (arg.startsWith("--threshold=")) {
            config.threshold = parseInt(arg.split("=")[1], 10);
            continue;
        }
        if (!arg.startsWith("-")) {
            path = arg;
        }
    }
    return { path, config, showBadge };
}
async function main() {
    const args = process.argv.slice(2);
    const { path, config, showBadge } = parseArgs(args);
    const targetPath = resolve(process.cwd(), path);
    console.log();
    console.log(chalk.bold("vibe-check") + chalk.dim(` v${VERSION}`));
    const spinner = ora("Scanning for AI slop...").start();
    try {
        const result = await scanFiles(targetPath, config);
        spinner.stop();
        if (result.files === 0) {
            console.log(chalk.yellow("\nNo TypeScript/JavaScript files found."));
            process.exit(0);
        }
        renderReport(result, process.cwd(), { showBadge });
        process.exit(result.passed ? 0 : 1);
    }
    catch (error) {
        spinner.fail("Scan failed");
        console.error(chalk.red(error.message));
        process.exit(1);
    }
}
main();
