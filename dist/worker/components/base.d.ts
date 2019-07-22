import WorkerPlugin from '../plugin';
import { ProcessMessageSendOptions } from '../../messager';
export default class Base<T extends WorkerPlugin> {
    readonly app: T;
    constructor(plugin: T);
    readonly logger: import("log4js").Logger;
    readonly messager: import("../../messager").default<import("..").default>;
    send(method: string, data?: any, options?: ProcessMessageSendOptions): number;
    asyncSend(method: string, data?: any, options?: ProcessMessageSendOptions): Promise<any>;
    asyncHealth(): Promise<any>;
}
