import AgentAppplication from '../index';
import { ProcessMessageSendOptions } from '../../messager';
export default class Agent {
    app: AgentAppplication;
    [name: string]: any;
    constructor(app: AgentAppplication);
    readonly logger: import("log4js").Logger;
    readonly messager: import("../../messager").default<AgentAppplication>;
    send(method: string, data?: any, options?: ProcessMessageSendOptions): number;
    asyncSend(method: string, data?: any, options?: ProcessMessageSendOptions): Promise<any>;
    asyncHealth(): Promise<any>;
    kill(): void;
    notice(type: string, data: any): void;
}
