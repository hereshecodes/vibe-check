import { SyntaxKind } from "ts-morph";
export const NoAny = {
    name: "no-any",
    description: "Detects usage of the 'any' type",
    run(sourceFile, filePath) {
        const violations = [];
        // Find all type references that are 'any'
        sourceFile.forEachDescendant((node) => {
            // Check for explicit 'any' type annotations
            if (node.getKind() === SyntaxKind.AnyKeyword) {
                const line = node.getStartLineNumber();
                const column = node.getStart() - (node.getStartLinePos() ?? 0);
                violations.push({
                    rule: this.name,
                    message: "Avoid using 'any' type - it defeats the purpose of TypeScript",
                    file: filePath,
                    line,
                    column,
                    severity: "error",
                });
            }
        });
        return { violations };
    },
};
