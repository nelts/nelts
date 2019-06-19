/// <reference types="node" />
import Component from './worker/index';
import * as emitter from 'events';
export default class Plugin extends emitter.EventEmitter {
    private _name;
    private _cwd;
    private _app;
    private _env;
    private _source;
    private _components;
    private _service;
    constructor(app: Component, name: string, cwd: string);
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
}
