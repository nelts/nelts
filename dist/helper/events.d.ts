export declare type AsyncEventEmitterListener = (...args: any[]) => void;
export default class EventEmitter {
    private _eventStacks;
    static readonly Methods: string[];
    constructor();
    on(name: string, listener: AsyncEventEmitterListener): this;
    off(name: string, listener: AsyncEventEmitterListener): this;
    addListener(name: string, listener: AsyncEventEmitterListener): this;
    removeListener(name: string, listener?: AsyncEventEmitterListener): void;
    prependListener(name: string, listener: AsyncEventEmitterListener): void;
    removeAllListeners(name: string): void;
    emit(name: string, ...args: any[]): Promise<void>;
    eventNames(): string[];
    listenerCount(name: string): number;
    listeners(name: string): AsyncEventEmitterListener[];
}
