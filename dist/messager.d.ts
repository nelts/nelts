declare type ipcStatus = 0 | 1;
export declare type ProcessMessageSendOptions = string | number | {
    to?: string | number;
    socket?: any;
};
export declare type ProcessMessageReceiveDataType = {
    id: number;
    to: string | number;
    from: number;
    method?: string;
    data?: any;
    code?: ipcStatus;
};
export default class Messager<T> {
    private app;
    mpid: number;
    private _stacks;
    constructor(app: T, mpid: number);
    parse(id: number, code: ipcStatus, data: any): void;
    createAgent(name: any, file: string, args?: any): Promise<unknown>;
    send(method: string, data: any, options?: ProcessMessageSendOptions): number;
    asyncSend(method: string, data: any, options?: ProcessMessageSendOptions): Promise<unknown>;
}
export {};
