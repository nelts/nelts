import { Component, Processer } from '@nelts/process';
import Messager, { ProcessMessageReceiveDataType } from './messager';
export * from './export';
export default class Master extends Component {
    private _base;
    private _max;
    private _config;
    private _port;
    private _messager;
    private _forker;
    readonly messager: Messager<Master>;
    readonly logger: import("log4js").Logger;
    constructor(processer: Processer, args: {
        [name: string]: any;
    });
    private health;
    componentWillCreate(): Promise<void>;
    componentDidCreated(): Promise<void>;
    componentCatchError(err: Error): void;
    componentReceiveMessage(message: ProcessMessageReceiveDataType, socket?: any): void;
    private masterMessageConvert;
    private createReply;
}
