/// <reference types="node" />
import Component from './worker/index';
import EventEmitter from './helper/events';
import { NELTS_CONFIGS } from './export';
import * as Compose from 'koa-compose';
import Context from './worker/context';
export default class Plugin extends EventEmitter {
    private _name;
    private _cwd;
    private _app;
    private _env;
    private _source;
    private _components;
    private _service;
    private _configs;
    private _middleware;
    constructor(app: Component, name: string, cwd: string);
    readonly middleware: {
        [name: string]: Compose.Middleware<Context>;
    };
    readonly configs: NELTS_CONFIGS;
    readonly service: {
        [name: string]: any;
    };
    readonly server: import("http").Server;
    readonly app: Component;
    readonly name: string;
    readonly cwd: string;
    readonly env: string;
    readonly source: string;
    addCompiler(compiler: (plugin: Plugin) => Promise<any>): Plugin;
    setComponent(...deps: string[]): void;
    getComponent(name: string): Plugin;
    render(configs: NELTS_CONFIGS): void;
}
