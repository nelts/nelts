import EventEmitter from './helper/events';
import { NELTS_CONFIGS } from './export';
import Factory from './factory';
import { Compiler } from './compiler';
export default class Plugin<M extends Factory<Plugin<M>>> extends EventEmitter {
    private _name;
    private _cwd;
    private _app;
    private _env;
    private _source;
    private _components;
    private _configs;
    root: Plugin<M>;
    constructor(app: M, name: string, cwd: string);
    private _findSource;
    readonly logger: import("log4js").Logger;
    readonly configs: NELTS_CONFIGS;
    readonly app: M;
    readonly name: string;
    readonly cwd: string;
    readonly env: string;
    readonly source: string;
    isDepended(name: string): boolean;
    addCompiler<T extends Plugin<M>>(compiler: Compiler<T>): this;
    setComponent(...deps: string[]): void;
    _getComponent<T extends Plugin<M>>(name: string): T;
    props(configs: NELTS_CONFIGS): Promise<void>;
    broadcast(name: string, ...args: any[]): Promise<void>;
}
