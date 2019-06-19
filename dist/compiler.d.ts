import Plugin from './plugin';
export default class Loader {
    private plugins;
    private compilers;
    constructor();
    addPlugin(plugin: Plugin): Loader;
    addCompiler(compiler: (plugin: Plugin) => Promise<any>): Loader;
    run(): Promise<void>;
}
