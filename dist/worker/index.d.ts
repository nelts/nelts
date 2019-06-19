/// <reference types="node" />
import * as http from 'http';
import Plugin from '../plugin';
import Compiler from '../compiler';
import * as Router from 'find-my-way';
import { Component, Processer } from '@nelts/process';
export declare type PLUGINS = {
    [name: string]: Plugin;
};
export default class DemoComponent extends Component {
    private _base;
    private _env;
    private _plugins;
    private _app;
    private _port;
    private _configs;
    compiler: Compiler;
    server: http.Server;
    render: (path: string) => Promise<Plugin>;
    router: Router.Instance<Router.HTTPVersion.V1>;
    constructor(processer: Processer, args: {
        [name: string]: any;
    });
    readonly app: Plugin;
    readonly base: string;
    readonly env: string;
    readonly plugins: PLUGINS;
    componentWillCreate(): Promise<void>;
    componentDidCreated(): Promise<void>;
    componentWillDestroy(): Promise<void>;
    componentDidDestroyed(): Promise<void>;
    componentCatchError(err: Error): void;
    componentReceiveMessage(message: any, socket?: any): void;
}
