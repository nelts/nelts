/// <reference types="node" />
import * as http from 'http';
import * as Router from 'find-my-way';
import { Processer } from '@nelts/process';
import { Middleware } from '../helper/request-response-compose';
import Messager, { ProcessMessageReceiveDataType } from '../messager';
import Factory, { InCommingMessage } from '../factory';
import WorkerPlugin from './plugin';
export default class WorkerComponent extends Factory<WorkerPlugin> {
    private _app;
    private _port;
    private _middlewares;
    private _handler;
    private _socket;
    private _sticky;
    server: http.Server;
    render: (path: string) => Promise<WorkerPlugin>;
    router: Router.Instance<Router.HTTPVersion.V1>;
    messager: Messager<WorkerComponent>;
    constructor(processer: Processer, args: InCommingMessage);
    use(...args: Middleware[]): this;
    readonly app: WorkerPlugin;
    private resumeConnection;
    componentWillCreate(): Promise<void>;
    componentDidCreated(): Promise<void>;
    componentWillDestroy(): Promise<void>;
    componentDidDestroyed(): Promise<void>;
    componentCatchError(err: Error): void;
    componentReceiveMessage(message: ProcessMessageReceiveDataType, socket?: any): void;
}
