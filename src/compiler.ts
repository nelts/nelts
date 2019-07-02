export type Compiler<T> = (plugin: T) => Promise<void>;
export default class Loader<T> {
  private plugins: T[];
  private compilers: Function[];

  constructor() {
    this.plugins = [];
    this.compilers = [];
  }

  addPlugin(plugin: T): Loader<T> {
    this.plugins.push(plugin);
    return this;
  }

  addCompiler(compiler: Compiler<T>): Loader<T> {
    this.compilers.push(compiler);
    return this;
  }

  async run() {
    for (let i = 0; i < this.plugins.length; i++) {
      const plugin = this.plugins[i];
      for (let j = 0; j < this.compilers.length; j++) {
        const compiler = this.compilers[j];
        await compiler(plugin);
      }
    }
  }
}