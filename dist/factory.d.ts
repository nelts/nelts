import { Component, Processer } from '@nelts/process';
import { NELTS_CONFIGS } from './export';
import Compiler from './compiler';
export default class Factory<T> extends Component {
    private _base;
    private _env;
    private _configs;
    private _plugins;
    readonly compiler: Compiler<T>;
    constructor(processer: Processer, args: {
        [name: string]: any;
    });
    readonly base: string;
    readonly env: string;
    readonly plugins: {
        [name: string]: T;
    };
    readonly configs: NELTS_CONFIGS;
}
