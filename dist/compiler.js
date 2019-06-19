"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Loader {
    constructor() {
        this.plugins = [];
        this.compilers = [];
    }
    addPlugin(plugin) {
        this.plugins.push(plugin);
        return this;
    }
    addCompiler(compiler) {
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
exports.default = Loader;
