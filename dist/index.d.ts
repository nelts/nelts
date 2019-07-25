import { Component, Processer, ProcessArgvType, WidgetComponent } from '@nelts/process';
import Messager, { ProcessMessageReceiveDataType } from './messager';
export * from './export';
interface MasterProcessArgvType extends ProcessArgvType {
    base?: string;
    max?: number;
    port?: number;
    config?: string;
    socket?: boolean;
}
export default class Master extends Component implements WidgetComponent {
    private _base;
    private _max;
    private _config;
    private _port;
    private _socket;
    private _sticky;
    private _messager;
    private _forker;
    readonly messager: Messager<Master>;
    readonly logger: import("log4js").Logger;
    constructor(processer: Processer, args: MasterProcessArgvType);
    private health;
    private notice;
    componentWillCreate(): Promise<void>;
    componentDidCreated(): Promise<void>;
    componentCatchError(err: Error): void;
    componentReceiveMessage(message: ProcessMessageReceiveDataType, socket?: any): void;
    private masterMessageConvert;
    private createReply;
    private createSocketInterceptor;
}
