export declare type Compiler<T> = (plugin: T) => Promise<void>;
export default class Loader<T> {
    private plugins;
    private compilers;
    constructor();
    addPlugin(plugin: T): Loader<T>;
    addCompiler(compiler: Compiler<T>): Loader<T>;
    run(): Promise<void>;
}
