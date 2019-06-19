export interface COLLECT_OPTIONS {
    env: string;
    isWorker: boolean;
    agentName?: string;
}
export interface DEFINE_PLUGIN_OPTIONS {
    enable?: boolean;
    env?: string | Array<string>;
    worker?: boolean;
    agent?: string | Array<string>;
    package?: string;
    path?: string;
}
export interface PLUGIN_COLLECT_RESULT {
    name: string;
    dependenties: string[];
}
export default function Collect(cwd: string, node_module_path: string, options: COLLECT_OPTIONS): PLUGIN_COLLECT_RESULT;
