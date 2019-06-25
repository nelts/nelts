import * as path from 'path';
import Component from './worker/index';
import EventEmitter from './helper/events';
import { NELTS_CONFIGS, Require } from './export';
import * as fs from 'fs';

export default class Plugin extends EventEmitter {
  private _name: string;
  private _cwd: string;
  private _app: Component;
  private _env: string;
  private _source: string;
  private _components: Array<string> = [];
  private _configs: NELTS_CONFIGS;
  public root: Plugin;
  [name: string]: any;

  constructor(app: Component, name: string, cwd: string) {
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

  get server() {
    return this._app.server;
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
      const component = this.getComponent(this._components[i]);
      const res = component.isDepended(name);
      if (res) return true;
    }
  }

  addCompiler(compiler: (plugin: Plugin) => Promise<any>): Plugin {
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

  getComponent(name: string) {
    if (this._components.indexOf(name) === -1) throw new Error(`${name} is not depended on ${this.name}`);
    return this._app.plugins[name];
  }

  async props(configs: NELTS_CONFIGS) {
    this._configs = typeof configs === 'object' 
      ? Object.freeze(configs) 
      : configs;
    await this.emit('props', this._configs);
  }

  async broadcast(name: string, ...args:any[]) {
    await this.emit(name, ...args);
    for (let i = 0; i < this._components.length; i++) {
      const componentName = this._components[i];
      const plugin = this._app.plugins[componentName];
      if (plugin) await plugin.callLife(name, ...args);
    }
  }
}