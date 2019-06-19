import Plugin from './plugin';
export default class Loader {
  private plugins: Plugin[];
  private compilers: Function[];

  constructor() {
    this.plugins = [];
    this.compilers = [];
  }

  addPlugin(plugin: Plugin): Loader {
    this.plugins.push(plugin);
    return this;
  }

  addCompiler(compiler: (plugin: Plugin) => Promise<any>): Loader {
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