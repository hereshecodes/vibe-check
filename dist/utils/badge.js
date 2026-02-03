import { getScoreLabel } from "../scoring/calculator.js";
function getScoreBadgeColor(score) {
    if (score >= 90)
        return "brightgreen";
    if (score >= 70)
        return "green";
    if (score >= 50)
        return "yellow";
    if (score >= 30)
        return "orange";
    return "red";
}
export function generateBadgeUrl(score) {
    const color = getScoreBadgeColor(score);
    const label = encodeURIComponent("vibe score");
    const message = encodeURIComponent(`${score}`);
    return `https://img.shields.io/badge/${label}-${message}-${color}`;
}
export function generateBadgeMarkdown(score) {
    const badgeUrl = generateBadgeUrl(score);
    return `[![Vibe Score](${badgeUrl})](https://github.com/hereshecodes/vibe-check)`;
}
export function getBadgeInstructions(score) {
    const markdown = generateBadgeMarkdown(score);
    const label = getScoreLabel(score);
    return `
Add this badge to your README:

${markdown}

Status: ${label}
`;
}
