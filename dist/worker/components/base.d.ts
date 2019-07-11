import WorkerPlugin from '../plugin';
import { ProcessMessageSendOptions } from '../../messager';
export default class Controller {
    readonly app: WorkerPlugin;
    constructor(plugin: WorkerPlugin);
    readonly messager: import("../../messager").default<import("..").default>;
    send(method: string, data?: any, options?: ProcessMessageSendOptions): number;
    asyncSend(method: string, data?: any, options?: ProcessMessageSendOptions): Promise<unknown>;
}
