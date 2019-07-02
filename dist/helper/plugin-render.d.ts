import WorkerPlugin from '../worker/plugin';
import WorkerApplication from '../worker/index';
export declare function MakeWorkerPluginRender(app: WorkerApplication): (component_path: string, root?: WorkerPlugin) => Promise<WorkerPlugin>;
