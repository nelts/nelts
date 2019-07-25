import { Component, Processer, ProcessArgvType } from '@nelts/process';
import { NELTS_CONFIGS } from './export';
import Compiler from './compiler';
export interface InCommingMessage extends ProcessArgvType {
    base: string;
    env: string;
    config?: string;
    cwd: string;
    script: string;
    kind: number;
    [name: string]: any;
}
export default class Factory<T> extends Component {
    private _base;
    private _env;
    private _inCommingMessage;
    private _configs;
    private _plugins;
    readonly compiler: Compiler<T>;
    constructor(processer: Processer, args: InCommingMessage);
    readonly inCommingMessage: InCommingMessage;
    readonly logger: import("log4js").Logger;
    readonly base: string;
    readonly env: string;
    readonly plugins: {
        [name: string]: T;
    };
    readonly configs: NELTS_CONFIGS;
}
