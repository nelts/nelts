import * as path from 'path';
import * as http from 'http';
import Plugin from '../plugin';
import PluginRender from '../helper/plugin-render';
import Compiler from '../compiler';
import * as Router from 'find-my-way';
import { Component, Processer } from '@nelts/process';
import { NELTS_CONFIGS, Require } from '../export';

import BootstrapCompiler from './compilers/bootstrap';
import ControllerCompiler from './compilers/controller';
import MiddlewareCompiler from './compilers/middleware';
import ServiceCompiler from './compilers/service';

export type PLUGINS = { [name:string]: Plugin };

export default class WorkerComponent extends Component {
  private _base: string;
  private _env: string;
  private _plugins: PLUGINS;
  private _app: Plugin;
  private _port: number;
  private _configs: NELTS_CONFIGS;
  public compiler: Compiler;
  public server: http.Server;
  public render: (path: string) => Promise<Plugin>;
  public router: Router.Instance<Router.HTTPVersion.V1>;

  constructor(processer: Processer, args: { [name:string]: any }) {
    console.info(`[pid:${process.pid}] server opening...`);
    super(processer, args);
    this._base = args.base ? path.resolve(args.base || '.') : args.cwd;
    this._env = args.env;

    if (args.config) {
      this._configs = Require(args.config, this._base);
    }

    this._plugins = {};
    this._port = Number(args.port || 8080);
    this.compiler = new Compiler();
    this.router = Router({
      ignoreTrailingSlash: true,
      defaultRoute(req, res) {
        res.statusCode = 404;
        res.end();
      }
    });
  }

  get app() {
    return this._app;
  }

  get base() {
    return this._base;
  }

  get env() {
    return this._env;
  }

  get plugins() {
    return this._plugins;
  }

  async componentWillCreate() {
    this.render = PluginRender(this, true);
    this._app = await this.render(this.base);
    this.compiler.addCompiler(MiddlewareCompiler);
    this.compiler.addCompiler(ServiceCompiler);
    this.compiler.addCompiler(ControllerCompiler);
    this.compiler.addCompiler(BootstrapCompiler);
    this.server = http.createServer((req, res) => this._app.broadcast('ServerRequest', req, res).then(() => this.router.lookup(req, res)).catch(e => {
      res.statusCode = 500;
      res.end(e.message);
    }));
  }

  async componentDidCreated() {
    await this.compiler.run();
    if (this._configs) this._app.props(this._configs);
    await new Promise((resolve, reject) => {
      this.server.listen(this._port, (err?: Error) => {
        if (err) return reject(err);
        resolve();
      });
    });
    await this._app.broadcast('ServerStarted');
    console.info(`[pid:${process.pid}] server opened at http://127.0.0.1:${this._port}`);
  }

  async componentWillDestroy() {
    await this._app.broadcast('ServerStopping');
  }

  async componentDidDestroyed() {
    this.server.close();
    await new Promise(resolve => process.nextTick(resolve));
    await this._app.broadcast('ServerStopped');
    console.info(`[pid:${process.pid}] server closed`);
  }

  componentCatchError(err: Error) {
    console.error(err);
  }

  componentReceiveMessage(message:any, socket?:any) {}
}