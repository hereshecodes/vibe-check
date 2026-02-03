interface RepoInfo {
    isGitRepo: boolean;
    isPrivate: boolean | null;
    repoUrl: string | null;
}
export declare function getRepoInfo(): RepoInfo;
export declare function isLikelyPrivateRepo(): boolean;
export {};
