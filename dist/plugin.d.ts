/// <reference types="node" />
import Component from './worker/index';
import EventEmitter from './helper/events';
import { NELTS_CONFIGS } from './export';
export default class Plugin extends EventEmitter {
    private _name;
    private _cwd;
    private _app;
    private _env;
    private _source;
    private _components;
    private _configs;
    closed: boolean;
    [name: string]: any;
    constructor(app: Component, name: string, cwd: string);
    readonly configs: NELTS_CONFIGS;
    readonly server: import("http").Server;
    readonly app: Component;
    readonly name: string;
    readonly cwd: string;
    readonly env: string;
    readonly source: string;
    addCompiler(compiler: (plugin: Plugin) => Promise<any>): Plugin;
    setComponent(...deps: string[]): void;
    getComponent(name: string): Plugin;
    props(configs: NELTS_CONFIGS): void;
    callLife(name: string, ...args: any[]): Promise<void>;
}
