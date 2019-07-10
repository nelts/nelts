import AgentAppplication from '../index';
import { ProcessMessageSendOptions } from '../../messager';
export default class Agent {
    app: AgentAppplication;
    [name: string]: any;
    constructor(app: AgentAppplication);
    send(method: string, data: any, options?: ProcessMessageSendOptions): number;
    asyncSend(method: string, data: any, options?: ProcessMessageSendOptions): Promise<unknown>;
    kill(): void;
}
