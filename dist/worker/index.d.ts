/// <reference types="node" />
import * as http from 'http';
import * as Router from 'find-my-way';
import { Processer } from '@nelts/process';
import { Middleware } from '../helper/request-response-compose';
import Factory from '../factory';
import WorkerPlugin from './plugin';
export default class WorkerComponent extends Factory<WorkerPlugin> {
    private _app;
    private _port;
    private _middlewares;
    private _handler;
    server: http.Server;
    render: (path: string) => Promise<WorkerPlugin>;
    router: Router.Instance<Router.HTTPVersion.V1>;
    constructor(processer: Processer, args: {
        [name: string]: any;
    });
    use(...args: Middleware[]): this;
    readonly app: WorkerPlugin;
    componentWillCreate(): Promise<void>;
    componentDidCreated(): Promise<void>;
    componentWillDestroy(): Promise<void>;
    componentDidDestroyed(): Promise<void>;
    componentCatchError(err: Error): void;
    componentReceiveMessage(message: any, socket?: any): void;
}
