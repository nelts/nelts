import * as path from 'path';
import Component from './worker/index';
import EventEmitter from './helper/events';
import { NELTS_CONFIGS } from './export';
import * as Compose from  'koa-compose';
import Context from './worker/context';

export default class Plugin extends EventEmitter {
  private _name: string;
  private _cwd: string;
  private _app: Component;
  private _env: string;
  private _source: string;
  private _components: Array<string>;
  private _service: { [name: string]: any };
  private _configs: NELTS_CONFIGS;
  private _middleware: { [name: string]: Compose.Middleware<Context> } = {};

  constructor(app: Component, name: string, cwd: string) {
    super();
    this._app = app;
    this._name = name;
    this._cwd = cwd;
    this._service = {};
    this._source = app.env.indexOf('dev') === 0 
      ? path.resolve(cwd, 'src') 
      : path.resolve(cwd, 'dist');
    this._env = app.env;
    this._components = [];
  }

  get middleware() {
    return this._middleware;
  }

  get configs() {
    return this._configs;
  }

  get service() {
    return this._service;
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

  render(configs: NELTS_CONFIGS) {
    this._configs = typeof configs === 'object' 
      ? Object.freeze(configs) 
      : configs;
  }
}