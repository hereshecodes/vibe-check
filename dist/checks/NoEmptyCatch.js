import { SyntaxKind } from "ts-morph";
export const NoEmptyCatch = {
    name: "no-empty-catch",
    description: "Detects empty catch blocks that swallow errors",
    run(sourceFile, filePath) {
        const violations = [];
        sourceFile.forEachDescendant((node) => {
            if (node.getKind() === SyntaxKind.CatchClause) {
                const catchClause = node;
                const block = catchClause.getChildrenOfKind(SyntaxKind.Block)[0];
                if (block) {
                    const statements = block.getStatements();
                    // Check if catch block is empty or only has comments
                    if (statements.length === 0) {
                        violations.push({
                            rule: this.name,
                            message: "Empty catch block swallows errors silently",
                            file: filePath,
                            line: node.getStartLineNumber(),
                            column: node.getStart() - node.getStartLinePos(),
                            severity: "error",
                        });
                    }
                }
            }
        });
        return { violations };
    },
};
