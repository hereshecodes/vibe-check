// Severity weights
const SEVERITY_WEIGHTS = {
    error: 10,
    warning: 3,
};
// Max penalty per file (to prevent one bad file from tanking the score)
const MAX_PENALTY_PER_FILE = 30;
export function calculateScore(violations, fileCount) {
    if (fileCount === 0)
        return 100;
    if (violations.length === 0)
        return 100;
    // Group violations by file
    const violationsByFile = new Map();
    for (const v of violations) {
        const existing = violationsByFile.get(v.file) || [];
        existing.push(v);
        violationsByFile.set(v.file, existing);
    }
    // Calculate penalty per file
    let totalPenalty = 0;
    for (const [_, fileViolations] of violationsByFile) {
        let filePenalty = 0;
        for (const v of fileViolations) {
            filePenalty += SEVERITY_WEIGHTS[v.severity];
        }
        totalPenalty += Math.min(filePenalty, MAX_PENALTY_PER_FILE);
    }
    // Score is 100 minus average penalty across files
    const averagePenalty = totalPenalty / fileCount;
    const score = Math.max(0, Math.round(100 - averagePenalty));
    return score;
}
export function getScoreEmoji(score) {
    if (score >= 90)
        return "fire";
    if (score >= 70)
        return "thumbsup";
    if (score >= 50)
        return "neutral";
    return "thumbsdown";
}
export function getScoreLabel(score) {
    if (score >= 90)
        return "Immaculate Vibes";
    if (score >= 70)
        return "Good Vibes";
    if (score >= 50)
        return "Mid Vibes";
    if (score >= 30)
        return "Bad Vibes";
    return "AI Slop Detected";
}
