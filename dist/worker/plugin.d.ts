/// <reference types="node" />
import Plugin from '../plugin';
import Component from './index';
export default class WorkerPlugin extends Plugin<Component> {
    service: {
        [name: string]: any;
    };
    middleware: {
        [name: string]: any;
    };
    constructor(app: Component, name: string, cwd: string);
    readonly server: import("http").Server;
    getComponent(name: string): WorkerPlugin;
}
