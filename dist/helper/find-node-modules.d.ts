declare type findNodeModulesOptions = {
    cwd?: string;
    relative?: boolean;
    searchFor?: string;
};
export default function findNodeModules(options: findNodeModulesOptions): string[];
export {};
