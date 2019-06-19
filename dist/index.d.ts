import { Component, Processer } from '@nelts/process';
export * from './export';
export default class Master extends Component {
    private _base;
    private _max;
    private _config;
    private _forker;
    constructor(processer: Processer, args: {
        [name: string]: any;
    });
    componentWillCreate(): Promise<void>;
    componentDidCreated(): Promise<void>;
    componentCatchError(err: Error): void;
    componentReceiveMessage(message: any, socket?: any): void;
}
