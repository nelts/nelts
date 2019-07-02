import * as fs from 'fs';
import * as path from 'path';
import EventEmitter from './helper/events';
import { NELTS_CONFIGS } from './export';
import Require from './helper/require';
import Factory from './factory';
import { Compiler } from './compiler';

export default class Plugin<M extends Factory<Plugin<M>>> extends EventEmitter {
  private _name: string;
  private _cwd: string;
  private _app: M;
  private _env: string;
  private _source: string;
  private _components: string[] = [];
  private _configs: NELTS_CONFIGS;
  public root: Plugin<M>;

  constructor(app: M, name: string, cwd: string) {
    super();
    this._app = app;
    this._name = name;
    this._cwd = cwd;
    this._env = app.env;
    this._source = this._findSource(cwd);
  }

  private _findSource(cwd: string) {
    const packageFilePath = path.resolve(cwd, 'package.json');
    if (!fs.existsSync(packageFilePath)) return cwd;
    const packageExports = Require(packageFilePath);
    if (!packageExports.source) return cwd;
    return path.resolve(cwd, packageExports.source);
  }

  get configs() {
    return this._configs;
  }

  get app() {
    return this._app;
  }

  get name() {
    return this._name;
  }

  get cwd() {
    return this._cwd;
  }

  get env() {
    return this._env;
  }

  get source() {
    return this._source;
  }

  isDepended(name: string) {
    if (!this._components.length) return;
    if (this._components.indexOf(name) > -1) return true;
    for (let i = 0; i < this._components.length; i++) {
      const component = this._getComponent(this._components[i]);
      const res = component.isDepended(name);
      if (res) return true;
    }
  }

  addCompiler<T extends Plugin<M>>(compiler: Compiler<T>) {
    this._app.compiler.addCompiler(compiler);
    return this;
  }

  setComponent(...deps: string[]) {
    deps.forEach(dep => {
      if (this._components.indexOf(dep) === -1) {
        this._components.push(dep);
      }
    });
  }

  _getComponent<T extends Plugin<M>>(name: string) {
    if (this._components.indexOf(name) === -1) throw new Error(`${name} is not depended on ${this.name}`);
    return <T>this._app.plugins[name];
  }

  async props(configs: NELTS_CONFIGS) {
    this._configs = typeof configs === 'object' 
      ? Object.freeze(configs) 
      : configs;
    await this.emit('props', this._configs);
  }

  async broadcast(name: string, ...args: any[]) {
    await this.emit(name, ...args);
    for (let i = 0; i < this._components.length; i++) {
      const componentName = this._components[i];
      const plugin = this._app.plugins[componentName];
      if (plugin) await plugin.broadcast(name, ...args);
    }
  }
}