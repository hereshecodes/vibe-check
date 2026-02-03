import { execSync } from "node:child_process";
export function getRepoInfo() {
    try {
        // Check if we're in a git repo
        execSync("git rev-parse --git-dir", { stdio: "pipe" });
    }
    catch {
        return { isGitRepo: false, isPrivate: null, repoUrl: null };
    }
    try {
        // Get remote URL
        const remoteUrl = execSync("git remote get-url origin", {
            stdio: "pipe",
            encoding: "utf-8",
        }).trim();
        // For now, we can't definitively detect private repos without API access
        // So we just return the URL and let the honor system work
        return {
            isGitRepo: true,
            isPrivate: null, // Unknown without API access
            repoUrl: remoteUrl,
        };
    }
    catch {
        return { isGitRepo: true, isPrivate: null, repoUrl: null };
    }
}
export function isLikelyPrivateRepo() {
    const info = getRepoInfo();
    if (!info.isGitRepo || !info.repoUrl) {
        return false;
    }
    // If it's a GitHub URL, it might be private
    // We can't know for sure without API access, so we just note it's a repo
    return info.repoUrl.includes("github.com") || info.repoUrl.includes("gitlab.com");
}
