import WorkerPlugin from '../worker/plugin';
import WorkerApplication from '../worker/index';
import AgentPlugin from '../agent/plugin';
import AgentApplication from '../agent/index';
export declare function MakeWorkerPluginRender(app: WorkerApplication): (component_path: string, root?: WorkerPlugin) => Promise<WorkerPlugin>;
export declare function MakeAgentPluginRender(agentName: string, app: AgentApplication): (component_path: string, root?: AgentPlugin) => Promise<AgentPlugin>;
